'use babel'

import { CompositeDisposable, Disposable } from 'atom'
import genius from './genius'
import auth from './auth'
import LyricSearchView from './lyric-search-view'
import LyricView from './lyric-view'

const geniusPackage = {
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
      // show search modal
      geniusPackage.searchView.show()
      // when user selects an item
      geniusPackage.searchView.onDidConfirm().then((song) => {
        // open a text editor in a new tab
        LyricView.openTab(song.full_title).then((view) => {
          const viewDisposable = new Disposable(() => view.destroy())
          geniusPackage.subscriptions.add(viewDisposable)
          // when we're done pulling the lyrics from the network,
          // set them as the content of the editor
          genius.lyrics(song.primary_artist.name, song.title).then((data) => {
            view.text = data.lyrics
          })
        })
      })
    }
  },

  activate (state) {
    if (!state) state = {}
    this.searchView = new LyricSearchView()
    genius.activate(state.genius)
    auth.activate(['genius'])

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register commands, populate disposables
    const commandsSubscription = atom.commands.add(this.target, this.commands)
    this.subscriptions.add(commandsSubscription)
    const geniusDisposable = new Disposable(() => genius.deactivate())
    this.subscriptions.add(geniusDisposable)
    const authDisposable = new Disposable(() => auth.deactivate())
    this.subscriptions.add(authDisposable)
  },

  deactivate () {
    this.subscriptions.dispose()
  },

  serialize () {
    return {
      genius: genius.serialize()
    }
  }
}

export default geniusPackage
