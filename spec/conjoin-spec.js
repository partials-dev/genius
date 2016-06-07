'use babel'

import conjoin from '../lib/conjoin'

const sample = ['one', 'two', 'three']

describe('Conjoin', () => {
  it('returns a single word unaltered', () => {
    expect(conjoin(sample[0])).toEqual(sample[0])
  })

  it('combines two words with "and"', () => {
    expect(conjoin(sample[0], sample[1])).toEqual(`${sample[0]} and ${sample[1]}`)
  })

  it('combines three or more words in natural english style: a, b, and c', () => {
    expect(conjoin(...sample)).toEqual(`${sample[0]}, ${sample[1]} and ${sample[2]}`)
  })
})
