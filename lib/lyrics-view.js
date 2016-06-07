'use babel'

export default class LyricsView {
  static openTab (tabName, activatePreviousPane = false) {
    const opts = {split: 'right', activatePane: false}
    var view
    return atom.workspace.open(tabName, opts).then(editor => {
      view = new LyricsView(editor)
      return view
    }).then((view) => {
      if (activatePreviousPane) {
        atom.workspace.activatePreviousPane()
      }
      return view
    })
  }

  constructor (editor, text) {
    this.editor = editor
    this.editor.setSoftWrapped(true)
    this.text = text
  }

  get text () {
    return this._text
  }

  set text (text) {
    this._text = text
    this.update()
  }

  update () {
    this.waitingForContent = !this.text
    if (this.waitingForContent) {
      this.displayWaiting()
    } else {
      this.editor.setText(this.text)
    }
  }

  displayWaiting () {
    let i = 0
    // if already displaying waiting message, do nothing
    if (this.isDisplayingWaiting) return

    const spin = () => {
      if (this.waitingForContent) {
        i = (i + 1) % 3
        let ellipsis = '.'.repeat(i + 1)
        let message = 'hang on. fetching fresh lyrics just for you' + ellipsis
        this.editor.setText(message)
      } else {
        clearInterval(intervalId)
        this.isDisplayingWaiting = false
      }
    }

    const intervalId = setInterval(spin, 500)
    spin()
    this.isDisplayingWaiting = true
  }

  // Tear down any state and detach
  destroy () {
    this.editor.destroy()
  }
}
