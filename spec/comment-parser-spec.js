'use babel'

import CommentParser from '../lib/comment-parser'

const sample = `# like Fleet Foxes, Sufjan Stevens
# like Beirut
This is not a comment.
This is also # not a comment`
const lines = sample.split('\n')

describe('CommentParser', () => {
  var comments
  beforeEach(() => {
    comments = new CommentParser('#', {
      SIMILAR_TO: 'like'
    })
  })
  describe('::getCommentLines', () => {
    var commentLines
    beforeEach(() => {
      commentLines = comments.getCommentLines(sample)
    })

    it('returns all the comment lines in a string', () => {
      expect(commentLines).toContain(lines[0])
      expect(commentLines).toContain(lines[1])
    })

    it('returns only the comment lines in a string', () => {
      expect(commentLines).not.toContain(lines[2])
      expect(commentLines).not.toContain(lines[3])
    })
  })

  describe('::getKey', () => {
    it('correctly parses similar_to keys in comments with multiple values', () => {
      expect(comments.getKey(lines[0])).toEqual(comments.keys.SIMILAR_TO)
    })

    it('correctly parses similar_to keys in comments with single values', () => {
      expect(comments.getKey(lines[1])).toEqual(comments.keys.SIMILAR_TO)
    })

    it('returns null for non-comments', () => {
      expect(comments.getKey(lines[2])).toBe(null)
      expect(comments.getKey(lines[3])).toBe(null)
    })
  })

  describe('::getValues', () => {
    it('extracts all and only the values in multi-value comments', () => {
      const values = comments.getValues(lines[0])
      expect(values).toContain('Fleet Foxes')
      expect(values).toContain('Sufjan Stevens')
      expect(values.length).toEqual(2)
    })

    it('extracts only the value in single-value comments', () => {
      const values = comments.getValues(lines[1])
      expect(values).toContain('Beirut')
      expect(values.length).toEqual(1)
    })

    it('returns an empty array for non-comments', () => {
      const values = comments.getValues(lines[2])
      expect(values.length).toEqual(0)
    })
  })

  describe('::parseLine', () => {
    it('extracts the correct keys and values in a multi-value comment', () => {
      const comment = comments.parseLine(lines[0])
      const similarValues = comment[comments.keys.SIMILAR_TO]

      expect(similarValues).toContain('Fleet Foxes')
      expect(similarValues).toContain('Sufjan Stevens')
      expect(similarValues.length).toEqual(2)
      expect(Object.keys(comment).length).toEqual(1)
    })

    it('extracts the correct keys and values in a single-value comment', () => {
      const comment = comments.parseLine(lines[1])
      const similarValues = comment[comments.keys.SIMILAR_TO]

      expect(similarValues).toContain('Beirut')
      expect(similarValues.length).toEqual(1)
      expect(Object.keys(comment).length).toEqual(1)
    })

    it('returns an empty object for non-comments', () => {
      const comment = comments.parseLine(lines[2])
      const similarValues = comment[comments.keys.SIMILAR_TO]
      expect(similarValues).toBe(undefined)
      expect(Object.keys(comment).length).toEqual(0)
    })
  })

  describe('::parse', () => {
    it('extracts the correct keys and values from a block of text', () => {
      const commentData = comments.parse(sample)
      const similarValues = commentData[comments.keys.SIMILAR_TO]

      expect(similarValues).toContain('Fleet Foxes')
      expect(similarValues).toContain('Sufjan Stevens')
      expect(similarValues).toContain('Beirut')
      expect(similarValues.length).toEqual(3)
      expect(Object.keys(commentData).length).toEqual(1)
    })
  })
})
