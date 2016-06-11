# Atom Genius

Easily search lyrics from [Genius](http://genius.com/) in [Atom](http://atom.io).

![Atom Genius demo](https://cloud.githubusercontent.com/assets/5033974/15982032/636fa3c6-2f4c-11e6-95a2-3c2b8f74fd1a.gif)

# Usage

Press `cmd-l y r` (as in `lyrics`) to open the lyric search bar. In detail:

- while holding `command`, press `l`
- release
- press `y`
- press `r`

Lyric search is also accessible from the [command palette](https://atom.io/packages/command-palette).
Press `cmd-shift-p` (OS X) or `ctrl-shift-p` (Linux/Windows), then search for
the command name. Available commands are:

- `Genius: Lyric Search`
- `Genius: Clear Cache`
- `Genius: Clear Permissions` (clears OAuth tokens Atom-Genius uses to make API calls)

## Customizing

You can customize the shortcut that atom-genius uses. First,
open your keymap file (`Atom -> Keymap...` on OS X), then add
something like:

```
'atom-text-editor':
  'ctrl-cmd-l': 'genius:lyric-search'
```

Your new keyboard shortcuts should work as soon as you save the file.
More information on keymaps is [here](http://flight-manual.atom.io/using-atom/sections/basic-customization/).

## Menu

All the commands are also available under the `Packages -> Genius Lyrics` menu.
