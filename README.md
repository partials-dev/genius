# Atom Rhyming Dictionary

[![Build Status](https://travis-ci.org/partials-music/atom-rhyming-dictionary.svg?branch=master)](https://travis-ci.org/partials-music/atom-rhyming-dictionary)

Easily find rhymes in [Atom](http://atom.io).

![Atom rhyming dictionary demo](https://cloud.githubusercontent.com/assets/5033974/15276372/2ff824d4-1ab4-11e6-99f9-873ffba70be8.gif)

There are three commands:

- **Find Perfect Rhymes** will find rhymes like *snow* and *flow*.
- **Find Near Rhymes** will find rhymes like *morning* and *forming*.
- **Find All Rhymes** will show you perfect and near rhymes together.

If you have text selected, it will try to find rhymes to go with that. Otherwise, it'll find rhymes for the word under the cursor.

# Usage

There are three ways to use the commands.

## Keyboard Shortcuts

| Command | Shortcut |
| :------------- | :------------- |
| Find Perfect Rhymes | `ctrl-alt-p` |
| Find Near Rhymes | `ctrl-alt-n` |
| Find All Rhymes | `ctrl-alt-a` |

You can also customize the shortcuts that atom-rhyming-dictionary uses. First, open your keymap file (the `Atom -> Keymap...` menu item on OS X), then add something like:

```
'atom-text-editor':
  'ctrl-cmd-p': 'rhyming-dictionary:find-perfect-rhymes'
  'ctrl-cmd-n': 'rhyming-dictionary:find-near-rhymes'
  'ctrl-cmd-a': 'rhyming-dictionary:find-all-rhymes'
```

Your new keyboard shortcuts should work as soon as you save the keymap file. More information on keymaps is [here](http://flight-manual.atom.io/using-atom/sections/basic-customization/).

## Command Palette

Open the [command palette](https://atom.io/packages/command-palette) by pressing `cmd-shift-p` (OS X) or `ctrl-shift-p` (Linux/Windows), then search for the command name. Press enter to execute.

## Menu

All the commands are available under the `Packages -> Rhyming Dictionary` menu, and also from the context menu.
