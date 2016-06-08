'use babel'

import {SelectListView} from 'atom-space-pen-views'
import genius from './genius'

export default class LyricSearchView extends SelectListView {
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
        this.setLoading('hang tight. finding fresh lyrics just for you.')
        genius.search(query).then((hits) => {
          hits = hits.map((hit) => hit.result)
          this.setItems(hits)
        })
      }
    })
    this.addClass('lyric-search')
  }

  // what key on the items should we use to fuzzy search?
  getFilterKey () {
    return 'full_title'
  }

  cancelled () { this.hide() }

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
  }

  hide () {
    if (this.panel) {
      this.panel.hide()
    }
  }

  viewForItem (item) {
    // Style matched characters in search results
    // const filterQuery = this.getFilterQuery()
    return `<li>${item.full_title}</li>`
  }

  confirmed (item) {
    this.cancel()
    console.log(`Confirmed ${item}`)
  }
}
