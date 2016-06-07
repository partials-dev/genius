'use babel'

import RhymingDictionary from '../lib/rhyming-dictionary'
import datamuseHelpers from './datamuse-helpers'
import rhymingDictionaryHelpers from './rhyming-dictionary-helpers'

describe('RhymingDictionary', () => {
  var dictionary
  beforeEach(() => {
    datamuseHelpers.fakeGet()
    runs(() => {
      RhymingDictionary.fetchRhymes('test').then((d) => { dictionary = d })
    })
    waitsFor(() => !!dictionary, 'dictionary retrieval', 1000)
  })

  describe('.fetchRhymes', () => {
    it('returns a Promise', () => {
      expect(RhymingDictionary.fetchRhymes('test').constructor.name).toEqual('Promise')
    })

    it('resolves to an instance of RhymingDictionary', () => {
      runs(() => {
        expect(dictionary.constructor.name).toEqual('RhymingDictionary')
      })
    })
  })

  describe('::getRhymeDescriptions', () => {
    it('returns the right data for a single rhyme type', () => {
      runs(() => {
        const perfectRhymes = dictionary.getRhymeDescriptions('perfect')
        const nearRhymes = dictionary.getRhymeDescriptions('near')
        expect(perfectRhymes).toEqual(datamuseHelpers.FAKE_PERFECT_RHYMES)
        expect(nearRhymes).toEqual(datamuseHelpers.FAKE_NEAR_RHYMES)
      })
    })

    it('returns the right data for multiple rhyme types', () => {
      runs(() => {
        const rhymes = dictionary.getRhymeDescriptions(['perfect', 'near'])
        expect(rhymes).toEqual(datamuseHelpers.FAKE_PERFECT_RHYMES.concat(datamuseHelpers.FAKE_NEAR_RHYMES))
      })
    })
  })

  describe('::getSyllableGroups', () => {
    it('returns rhymes of a single type sorted into syllable groups', () => {
      runs(() => {
        const perfectSyllableGroups = dictionary.getSyllableGroups('perfect')
        const nearSyllableGroups = dictionary.getSyllableGroups('near')
        expect(perfectSyllableGroups).toEqual(rhymingDictionaryHelpers.FAKE_PERFECT_SYLLABLE_GROUPS)
        expect(nearSyllableGroups).toEqual(rhymingDictionaryHelpers.FAKE_NEAR_SYLLABLE_GROUPS)
      })
    })
  })
})
