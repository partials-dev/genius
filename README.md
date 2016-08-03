# Atom Genius

Easily search lyrics from [Genius](http://genius.com/) in [Atom](http://atom.io).

![Lyric search demo](https://cloud.githubusercontent.com/assets/5033974/17353671/c859c8ba-590f-11e6-96a2-760427ce8dab.gif)

# Keyboard shortcut

The keyboard shortcut is `ctrl-l` (as in "lyrics"). The command is named
`genius:lyric-search`. To change the shortcut to `ctrl-y`, you
would write something like this in your `keymap.cson`:

```
'atom-text-editor':
  'ctrl-y': 'genius:lyric-search'
```

More information on keymaps is [here](http://flight-manual.atom.io/using-atom/sections/basic-customization/).
