'use babel'

import parseRhymeTypes, { validRhymeTypes } from '../lib/parse-rhyme-types'

describe('.parseRhymeTypes', () => {
  it('defaults to "perfect" if no arguments are given', () => {
    expect(parseRhymeTypes()).toEqual(['perfect'])
  })

  it('wraps single strings in an array', () => {
    expect(parseRhymeTypes('perfect')).toEqual(['perfect'])
  })

  it('downcases rhymeTypes passed to it', () => {
    expect(parseRhymeTypes(['PERFECT', 'NEAR'])).toEqual(['perfect', 'near'])
  })

  it('returns all valid rhyme types if the arguments contain "all"', () => {
    expect(parseRhymeTypes(['all'])).toEqual(validRhymeTypes)
  })

  it('throws an error if it receives an unknown rhymetype', () => {
    let parseDerp = () => parseRhymeTypes(['derp'])
    expect(parseDerp).toThrow('Unknown rhyme type derp')
  })
})
