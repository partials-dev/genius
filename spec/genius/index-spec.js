'use babel'

// import genius from '../../lib/genius'

// currently broken
// have to get the genius
// auth token in here somehow
// env vars don't work; atom config
// values don't work

// describe('Genius', () => {
//   beforeEach(() => {
//     genius.activate()
//   })
//   describe('::lyrics', () => {
//     it("should return the lyrics for all the artist's songs", () => {
//       var lyrics
//       runs(() => {
//         genius.lyrics('Fleet Foxes').then((result) => {
//           console.log(JSON.stringify(result))
//           lyrics = result
//         })
//       })
//
//       waitsFor(() => {
//         return !!lyrics
//       }, 'lyrics')
//
//       runs(() => {
//         const SNIPPETS = {
//           'Lorelai': 'So guess I got old',
//           'The Shrine/An Argument': 'among the dust and pollen',
//           'Tiger Mountain Peasant Song': 'Wanderers this morning came by',
//           'Mykonos': 'You will go to Mykonos',
//           'Ragged Wood': 'you have been gone too long',
//           'Oliver James': 'washed in the rain',
//           'Meadowlarks': 'sing to me'
//         }
//         Object.keys(SNIPPETS).forEach((title) => {
//           const snippet = new RegExp(SNIPPETS[title], 'gi')
//           const song = lyrics.find((lyric) => lyric.title === title)
//           expect(song).toBeDefined()
//           expect(song.lyrics).toMatch(snippet)
//         })
//       })
//     })
//   })
// })
