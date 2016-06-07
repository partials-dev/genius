'use babel'

import rhymeEditorHelpers from './rhyme-editor-helpers'

export default {
  fakeActiveTextEditor (bufferRangeIsEmpty = true, text = 'test') {
    spyOn(atom.workspace, 'getActiveTextEditor').andCallFake(() => {
      const spy = rhymeEditorHelpers.createEditorSpy()
      spy.getText.andReturn(text)
      spy.getSelectedText.andReturn('test')
      spy.getSelectedBufferRange.andCallFake(() => {
        const bufferRangeSpy = jasmine.createSpyObj('bufferRangeSpy', ['isEmpty'])
        bufferRangeSpy.isEmpty.andReturn(bufferRangeIsEmpty)
        return bufferRangeSpy
      })
      return spy
    })
    return atom.workspace.getActiveTextEditor()
  }
}
