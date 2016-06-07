'use babel'

import rhymingDictionaryPackage from '../lib/index'
import rhymingDictionaryHelpers from './rhyming-dictionary-helpers'
import indexHelpers from './index-helpers'
import datamuse from '../lib/datamuse'

import RhymeEditor from '../lib/rhyme-editor'

describe('package', () => {
  describe('.activate', () => {
    it('registers all commands', () => {
      spyOn(atom.commands, 'add').andCallThrough()
      rhymingDictionaryPackage.activate()
      const target = rhymingDictionaryPackage.target
      const commands = rhymingDictionaryPackage.commands
      expect(atom.commands.add).toHaveBeenCalledWith(target, commands)
    })
  })

  describe('.showRhymes', () => {
    runs(() => {
      rhymingDictionaryHelpers.fakeFetchRhymes()
      spyOn(RhymeEditor, 'openTab').andCallThrough()
      indexHelpers.fakeActiveTextEditor()
      rhymingDictionaryPackage.showRhymes('test', 'perfect')
    })

    waitsFor(() => {
      return !!rhymingDictionaryPackage.rhymeEditor
    }, 'rhyme editor')

    runs(() => {
      const openTabArgs = RhymeEditor.openTab.mostRecentCall.args
      expect(openTabArgs[0]).toEqual('perfect')
      expect(openTabArgs[1]).toEqual('test')
    })
  })

  describe('.commands', () => {
    var workspaceElement
    var activationPromise

    // this function comes from
    // https://discuss.atom.io/t/need-help-with-writing-specs-around-package-activation/15053
    // TODO: actually read that discussion and understand why it works
    function executeCommand (command, callback) {
      atom.commands.dispatch(workspaceElement, command)
      waitsForPromise(() => activationPromise)
      runs(callback)
    }

    beforeEach(() => {
      indexHelpers.fakeActiveTextEditor()
      workspaceElement = atom.views.getView(atom.workspace)
      activationPromise = atom.packages.activatePackage('atom-rhyming-dictionary')
    })

    function testCommand (rhymeType) {
      const commandString = `rhyming-dictionary:find-${rhymeType}-rhymes`
      describe(commandString, () => {
        it('should activate the package', () => {
          spyOn(rhymingDictionaryPackage, 'activate').andCallThrough()
          executeCommand(commandString, () => {
            expect(rhymingDictionaryPackage.activate).toHaveBeenCalledWith({})
          })
        })

        it('should call showRhymes with the proper arguments', () => {
          spyOn(rhymingDictionaryPackage, 'showRhymes')
          executeCommand(commandString, () => {
            expect(rhymingDictionaryPackage.showRhymes).toHaveBeenCalledWith('test', rhymeType)
          })
        })
      })
    }

    datamuse.rhymeTypes.forEach(testCommand)
  })

  describe('.getCurrentWordOrSelection', () => {
    it('should return the selected word', () => {
      indexHelpers.fakeActiveTextEditor(false)
      expect(rhymingDictionaryPackage.getCurrentWordOrSelection()).toEqual('test')
    })

    it('should return the word under the cursor', () => {
      indexHelpers.fakeActiveTextEditor(true)
      expect(rhymingDictionaryPackage.getCurrentWordOrSelection()).toEqual('test')
    })
  })

  describe('.parseComments', () => {
    it('should return any comments from the active editor', () => {
      indexHelpers.fakeActiveTextEditor(false, '# like Fleet Foxes \n notcomment \n # like Beirut')
      expect(rhymingDictionaryPackage.parseComments()).toEqual({like: ['Fleet Foxes', 'Beirut']})
    })
  })
})
