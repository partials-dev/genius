'use babel'

import { CompositeDisposable } from 'atom'
import genius from './genius'
import auth from './auth'
import LyricsController from './lyrics-controller'
import LyricSearchView from './lyric-search-view'

const geniusLyrics = {
  subscriptions: null,
  target: 'atom-workspace',
  commands: {
    'genius:clear-permissions': () => {
      genius.deauthenticate()
      auth.deauthenticate()
    },
    'genius:clear-cache': () => {
      genius.clearCache()
    },
    'genius:lyric-search': () => {
      geniusLyrics.searchView.show()
      // const {controller, disposable} = LyricsController.create({full_title: 'Your Protector by Fleet Foxes'})
      // genius.lyrics('Fleet Foxes', 'Your Protector').then((lyricsData) => {
      //   controller.data = lyricsData
      //   geniusLyrics.subscriptions.add(disposable)
      // })
    }
  },

  activate (state) {
    if (!state) state = {}
    this.searchView = new LyricSearchView()
    genius.activate(state.genius)
    auth.activate(['genius'])

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register commands
    const commandsSubscription = atom.commands.add(this.target, this.commands)
    this.subscriptions.add(commandsSubscription)
  },

  deactivate () {
    genius.deactivate()
    auth.deactivate()
    if (this.lyricsEditor) this.lyricsEditor.destroy()
    this.subscriptions.dispose()
  },

  serialize () {
    return {
      genius: genius.serialize()
    }
  }
}

export default geniusLyrics
