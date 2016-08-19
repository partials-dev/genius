'use babel'

import NodeGenius from 'node-genius'
import scrape from 'scrape-url'
import auth from '../auth'

export default {
  get client () {
    if (!this._clientPromise) {
      this._clientPromise = auth.services.genius.authenticate().then(({accessToken}) => {
        return new NodeGenius(accessToken)
      })
    }
    return this._clientPromise
  },

  set client (newClient) {
    this._client = newClient
  },

  deauthenticate () {
    this.client = null
  },

  search (query) {
    return this.client.then((client) => {
      return new Promise((resolve, reject) => {
        client.search(query, (err, results) => {
          if (err) {
            reject(err)
          } else {
            results = JSON.parse(results)
            if (results.response.hits.length === 0) {
              reject('no hits')
            } else {
              resolve(results.response.hits)
            }
          }
        })
      })
    })
  },

  getLyrics (songPath) {
    return new Promise((resolve, reject) => {
      scrape(`http://genius.com${songPath}`, 'lyrics > p', (err, selectorMatches) => {
        if (err) {
          reject(err)
        } else {
          const elements = selectorMatches[0]
          // remove script tags and their contents from the
          // selector match
          elements.find('script').remove()

          var text = elements.text()
            // eliminate multiple spaces in a row
            .replace(/\s*/, ' ')
            // trim whitespace at the beginning of a line
            .replace(/^\s*/, '')
            // eliminate text between brackets
            // .replace(/\[.*\]/, '')
            .trim()

          resolve(text)
        }
      })
    })
  },

  getArtistSongs (artistId, page = 1, songPromisesSoFar = []) {
    return this.client.then((client) => {
      return new Promise((resolve, reject) => {
        client.getArtistSongs(artistId, { page: page }, (err, data) => {
          if (err) {
            reject(err)
          } else {
            const parsed = JSON.parse(data)
            const response = parsed.response
            const promises = response.songs.map((song) => {
              return this.getLyrics(song.path).then((lyrics) => {
                song.lyrics = lyrics
                return song
              })
            })
            songPromisesSoFar = songPromisesSoFar.concat(promises)
            if (parsed.response.next_page) {
              resolve(this.getArtistSongs(artistId, response.next_page, songPromisesSoFar))
            } else {
              resolve(Promise.all(songPromisesSoFar))
            }
          }
        })
      })
    })
  }
}
