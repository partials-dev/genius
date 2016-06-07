'use babel'

import lyrics from './lyrics'

export default {
  activate (state) {
    if (!state) state = {}
    lyrics.activate(state.lyrics)
  },
  lyrics (artistOrSongs, title) {
    if (Array.isArray(artistOrSongs)) {
      const songs = artistOrSongs
      return lyrics.getAll(songs)
    } else {
      const artist = artistOrSongs
      return lyrics.get(artist, title)
    }
  },
  clearCache () {
    lyrics.clearCache()
  },
  serialize () {
    return {
      lyrics: lyrics.serialize()
    }
  },
  deauthenticate () {
    lyrics.deauthenticate()
  },
  deactivate () {
  }
}
