'use babel'

import LyricsView from './lyrics-view'
import {Disposable} from 'atom'

export default class LyricsController {
  static create (lyricsData) {
    const controller = new LyricsController(lyricsData)
    const disposable = new Disposable(() => { controller.dispose() })
    return {
      controller,
      disposable
    }
  }

  constructor (lyricsData) {
    lyricsData = lyricsData || {}
    const text = lyricsData.lyrics
    LyricsView.openTab(lyricsData.full_title, true).then((view) => {
      this.view = view
      this.view.text = text
    })
  }

  get data () {
    return this._data
  }

  set data (data) {
    this._data = data
    if (data) {
      this.view.text = data.lyrics
    }
  }

  dispose () {
    this.view.destroy()
  }
}
