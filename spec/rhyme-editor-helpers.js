'use babel'

export default {
  createEditorSpy () {
    return jasmine.createSpyObj('editor', ['getText', 'setText', 'getSelectedText', 'insertText', 'insertNewline', 'setSoftWrapped', 'moveToTop', 'destroy', 'setSelectedBufferRange', 'getSelectedBufferRange', 'selectWordsContainingCursors'])
  }
}
