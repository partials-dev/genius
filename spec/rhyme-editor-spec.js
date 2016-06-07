'use babel'

import RhymeEditor from '../lib/rhyme-editor'
import rhymingDictionaryHelpers from './rhyming-dictionary-helpers'
import rhymeEditorHelpers from './rhyme-editor-helpers'

describe('RhymeEditor', () => {
  var rhymeEditor
  var editorSpy
  var dictionarySpy
  beforeEach(() => {
    editorSpy = rhymeEditorHelpers.createEditorSpy()
    dictionarySpy = {}

    dictionarySpy.target = 'test'
    dictionarySpy.getSyllableGroups = jasmine.createSpy().andReturn(rhymingDictionaryHelpers.FAKE_PERFECT_SYLLABLE_GROUPS)

    rhymeEditor = new RhymeEditor(editorSpy, ['perfect'], dictionarySpy)
    rhymeEditor.editor = editorSpy
  })

  describe('.getTabName', () => {
    it('capitalizes the first letter of its output', () => {
      const firstLetter = RhymeEditor.getTabName('test', 'perfect')[0]
      expect(firstLetter).toEqual(firstLetter.toUpperCase())
    })

    it('returns the correct output for a single rhyme type', () => {
      const tabName = RhymeEditor.getTabName('test', 'perfect')
      expect(tabName).toEqual('Perfect rhymes for test')
    })

    it('returns the correct output for multiple rhyme types', () => {
      const tabName = RhymeEditor.getTabName('test', ['perfect', 'near'])
      expect(tabName).toEqual('Perfect and near rhymes for test')
    })
  })

  describe('::update', () => {
    it('clears the current text in the editor', () => {
      rhymeEditor.update()
      expect(editorSpy.setText).toHaveBeenCalledWith('')
    })

    it('writes the syllable groups to the editor', () => {
      spyOn(rhymeEditor, 'displaySyllableGroups')
      rhymeEditor.update()
      expect(rhymeEditor.displaySyllableGroups).toHaveBeenCalledWith(rhymingDictionaryHelpers.FAKE_PERFECT_SYLLABLE_GROUPS)
    })
  })

  describe('::displaySyllableGroups', () => {
    it('inserts syllable headings into the editor', () => {
      rhymeEditor.update()
      rhymingDictionaryHelpers.FAKE_PERFECT_SYLLABLE_GROUPS.forEach((group, i) => {
        // two calls to insertText per group
        const insertTextIndex = i * 2
        const insertHeadingArgs = rhymeEditor.editor.insertText.calls[insertTextIndex].args
        expect(insertHeadingArgs[0]).toEqual(rhymeEditor.getSyllableHeading(i))

        const insertGroupArgs = rhymeEditor.editor.insertText.calls[insertTextIndex + 1].args
        expect(insertGroupArgs[0]).toEqual(group[0])
      })
    })
  })

  describe('::getSyllableHeading', () => {
    it('correctly pluralizes syllables', () => {
      const oneSyllableHeading = rhymeEditor.getSyllableHeading(1)
      expect(oneSyllableHeading).toMatch(/syllable/i)
      expect(oneSyllableHeading).not.toMatch(/syllables/i)
      expect(rhymeEditor.getSyllableHeading(2)).toMatch(/syllables/i)
    })
  })
})
