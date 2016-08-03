'use babel'

import {SelectListView} from 'atom-space-pen-views'
import genius from './genius'

// exposes the resolve and reject functions
// of a promise so that we can more easily
// fulfill the promise over the life of the view
class ExposedPromise {
  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export default class LyricSearchView extends SelectListView {
  // lifecycle management
  static activate () {

  }

  static deactivate () {
    this.disposable.dispose()
  }

  constructor () {
    super()

    // when the user pauses typing in the modal
    this.filterEditorView.getModel().getBuffer().onDidStopChanging((event) => {
      const query = this.getFilterQuery()
      if (!query) {
        // empty the modal list
        this.setItems(null)
      } else {
        this.setLoading('Searching songs.')
        // search genius for the user's query
        genius.search(query).then((hits) => {
          hits = hits.map((hit) => hit.result)
          // populate the modal list with the search results
          this.setItems(hits)
        }).catch((reason) => {
          // handle errors
          const message = `Genius search failed: ${reason}`
          console.log(message)
          this.didConfirm.reject(message)
        })
      }
    })
    //
    this.didConfirm = new ExposedPromise()
    this.addClass('lyric-search')
  }

  toggle () {
    // show if hidden
    // hide if shown
    if (this.panel && this.panel.isVisible()) {
      this.cancel()
    } else {
      this.show()
    }
  }

  show () {
    // create and show the modal panel
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this})
    }
    this.panel.show()
    // remember what was focused previously
    // so we can return focus to it when we're done
    this.storeFocusedElement()
    this.focusFilterEditor()
    // store a promise as well as its resolve and reject functions
    // so we can resolve it when the user confirms a song
    this.didConfirm = new ExposedPromise()
  }

  hide () {
    // hide if shown
    if (this.panel) {
      this.panel.hide()
    }
  }

  // Called when the user selects a song from the list
  confirmed (song) {
    this.didConfirm.resolve(song)
    this.hide()
  }

  cancelled () {
    this.hide()
    if (this.didConfirm.promise) {
      this.didConfirm.reject('LyricSearchView was canceled')
    }
  }

  // Allows other modules to be notified when the user selects a song
  onDidConfirm () {
    return this.didConfirm.promise
  }

  // SelectListView does filtering automatically for us
  // Return the object key that it should use to filter.
  getFilterKey () {
    // Full title looks like "The Beatles - Love Me Do"
    // Use that to filter the items in the list
    return 'full_title'
  }

  // The view for each item is just an <li> containing the title
  viewForItem (song) {
    return `<li>${song.full_title}</li>`
  }

  getEmptyMessage () {
    return 'Search a song or artist.'
  }
}
