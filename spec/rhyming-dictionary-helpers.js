'use babel'

import datamuseHelpers from './datamuse-helpers'
// import RhymingDictionary from '../lib/rhyming-dictionary'

const FAKE_NEAR_SYLLABLE_GROUPS = []
FAKE_NEAR_SYLLABLE_GROUPS[1] = ['meshed']
FAKE_NEAR_SYLLABLE_GROUPS[2] = ['bereft']
const FAKE_PERFECT_SYLLABLE_GROUPS = []
FAKE_PERFECT_SYLLABLE_GROUPS[2] = ['detest']
FAKE_PERFECT_SYLLABLE_GROUPS[3] = ['manifest']

export default {
  FAKE_PERFECT_SYLLABLE_GROUPS,
  FAKE_NEAR_SYLLABLE_GROUPS,
  fakeFetchRhymes () { datamuseHelpers.fakeGet() }
}
