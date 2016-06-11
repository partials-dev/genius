'use babel'

import {SelectListView} from 'atom-space-pen-views'
import genius from './genius'

export default class LyricSearchView extends SelectListView {
  // lifecycle management
  static activate () {

  }

  static deactivate () {
    this.disposable.dispose()
  }

  constructor () {
    super()
    this.filterEditorView.getModel().getBuffer().onDidStopChanging((event) => {
      const query = this.getFilterQuery()
      if (!query) {
        this.setItems(null)
      } else {
        this.setLoading('just a sec. searching songs.')
        genius.search(query).then((hits) => {
          hits = hits.map((hit) => hit.result)
          this.setItems(hits)
        }).catch((reason) => {
          const message = `Genius search failed: ${reason}`
          console.log(message)
          this.didConfirm.reject(message)
        })
      }
    })
    this.addClass('lyric-search')
  }

  toggle () {
    if (this.panel && this.panel.isVisible()) {
      this.cancel()
    } else {
      this.show()
    }
  }

  show () {
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this})
    }
    this.panel.show()
    this.storeFocusedElement()
    this.focusFilterEditor()
    this.didConfirm = {}
    this.didConfirm.promise = new Promise((resolve, reject) => {
      this.didConfirm.resolve = resolve
      this.didConfirm.reject = reject
    })
  }

  cancelled () {
    this.hide()
    // if (this.didConfirm.promise) {
    //   this.didConfirm.reject('LyricSearchView was canceled')
    // }
  }

  hide () {
    if (this.panel) {
      this.panel.hide()
    }
  }

  // Called when the user selects a song from the list
  confirmed (song) {
    this.didConfirm.resolve(song)
    this.cancel()
  }

  // Allows other modules to be notified when the user selects a song
  onDidConfirm () {
    return this.didConfirm.promise
  }

  // Full title looks like "The Beatles - Love Me Do"
  // Use that to filter the items in the list
  getFilterKey () {
    return 'full_title'
  }

  // The view for each item is just an <li> containing the title
  viewForItem (song) {
    return `<li>${song.full_title}</li>`
  }
}
