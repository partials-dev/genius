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
      scrape(`http://genius.com${songPath}`, '.lyrics', (err, lyricsElements) => {
        if (err) {
          reject(err)
        } else {
          const elt = lyricsElements[0]
          // genius contributors use constructions like [verse]
          // to denote song sections and other metadata
          // directly in the lyrics.
          // remove that information for now.
          var text = elt.text()
            // trim whitespace at the beginning of a line
            .replace(/^\s*/, '')
            // eliminate multiple spaces in a row
            .replace(/\s*/, ' ')
            // eliminate text between brackets
            // .replace(/\[.*\]/, '')
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
