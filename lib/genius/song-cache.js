'use babel'

import PersistentCache from './persistent-cache'
import combine from './combine-song-and-artist'

export default class SongCache {
  constructor (cache) {
    this.cache = new PersistentCache(cache)
  }
  getArtistSongs (artistName) {
    return this.cache.get(artistName)
  }
  getSong (artistName, songTitle) {
    const songKey = combine(artistName, songTitle)
    let song = this.cache.get(songKey)
    if (!song) {
      const artistSongs = this.cache.get(artistName)
      if (artistSongs) {
        song = artistSongs.find((song) => song.title === songTitle)
      }
    }
    return song
  }
  get (artistName, songTitle) {
    if (!songTitle) {
      this.getArtistSongs(artistName)
    } else {
      this.getSong(artistName, songTitle)
    }
  }
  setSong (artistName, songTitle, song) {
    let key = combine(artistName, songTitle)
    this.cache.set(key, song)
  }
  setArtistSongs (artistName, songs) {
    this.cache.set(artistName, songs)
  }
  set (artistName, songTitleOrSongs, songOrSongs) {
    if (Array.isArray(songTitleOrSongs)) {
      const songs = songTitleOrSongs
      this.setArtistSongs(artistName, songs)
    } else if (!songTitleOrSongs && Array.isArray(songOrSongs)) {
      const songs = songOrSongs
      this.setArtistSongs(artistName, songs)
    } else {
      const songTitle = songTitleOrSongs
      const song = songOrSongs
      this.setSong(artistName, songTitle, song)
    }
  }

  serialize () {
    return this.cache.serialize()
  }
}
