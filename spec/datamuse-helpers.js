'use babel'

import datamuse from '../lib/datamuse'

const FAKE_PERFECT_RHYMES = [{word: 'manifest', score: 1221, numSyllables: 3}, {word: 'detest', score: 305, numSyllables: 2}]
const FAKE_NEAR_RHYMES = [{word: 'bereft', score: 622, numSyllables: 2}, {word: 'meshed', score: 104, numSyllables: 1}]

const matchPerfectRhymeIds = new RegExp(datamuse.__testonly__.rhymeTypeIds.perfect)
const matchNearRhymeIds = new RegExp(datamuse.__testonly__.rhymeTypeIds.near)

export default {
  FAKE_PERFECT_RHYMES,
  FAKE_NEAR_RHYMES,
  fakeGet () {
    function fake (url) {
      if (matchPerfectRhymeIds.test(url)) {
        return Promise.resolve({ data: JSON.stringify(FAKE_PERFECT_RHYMES) })
      } else if (matchNearRhymeIds.test(url)) {
        return Promise.resolve({ data: JSON.stringify(FAKE_NEAR_RHYMES) })
      } else {
        throw new Error('Attempted to get datamuse rhymes of unknown rhyme type')
      }
    }
    spyOn(datamuse.__testonly__.get, 'default').andCallFake(fake)
  }
}
