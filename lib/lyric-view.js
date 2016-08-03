'use babel'

// this is a wrapper for the editor class
// it provides an easy way to set the text
// in the editor, and shows a loading message
// until the text is set
export default class LyricView {
  /**
   * static openTab - open a new editor tab
   * and pass the editor for that tab to a
   * new LyricView
   *
   * @param  {String} tabName                     description
   * @param  {Boolean} activatePreviousPane = true description
   * @return {type}                             description
   */
  static openTab (tabName, activatePreviousPane = true) {
    const opts = {split: 'right', activatePane: false}
    return atom.workspace.open(tabName, opts).then(editor => {
      const view = new LyricView(editor)
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
    // if already displaying waiting message, do nothing
    if (this.isDisplayingWaiting) return
    let i = 0

    const spin = () => {
      if (this.waitingForContent) {
        i = (i + 1) % 3
        let ellipsis = '.'.repeat(i + 1)
        let message = 'Fetching fresh lyrics' + ellipsis
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
