'use babel'

import datamuse from '../lib/datamuse'
import datamuseHelpers from './datamuse-helpers'

describe('Datamuse', () => {
  describe('.getRhymes', () => {
    it('returns a Promise', () => {
      const promise = datamuse.getRhymes('test')
      expect(promise.constructor.name).toEqual('Promise')
    })

    it('returns an Object with data about all possible rhyme types', () => {
      datamuseHelpers.fakeGet()

      var rhymes
      runs(() => {
        datamuse.getRhymes('test').then((r) => {
          rhymes = r
        })
      })

      waitsFor(() => !!rhymes, 'rhyme retrieval', 1000)

      runs(() => {
        expect(rhymes).toEqual({
          perfect: datamuseHelpers.FAKE_PERFECT_RHYMES,
          near: datamuseHelpers.FAKE_NEAR_RHYMES
        })
      })
    })
  })
})
