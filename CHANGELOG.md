# Changelog

## 0.1.4

- Modern UI card outlines are opaque dark, so the white editor no longer gets a grey edge.

## 0.1.3

- Modern UI card outlines use the dark frame border instead of a light hairline on rounded corners.

## 0.1.2

- The Settings User/Workspace switch and Modern UI chips use a dark navy chip instead of grey.

## 0.1.1

- Settings, Welcome and modal editors are fully light: all text fields are light everywhere, like the editor.
- Shared text, descriptions and links use mid tones that read on both the white editor area and the dark frame.
- Inline code, quotes, code blocks, keybinding labels and badges carry their own light chip.
- The Output panel uses the editor background, since it is colored with the light syntax palette.

## 0.1.0

First preview of Darklight, rebuilt from Nest Theme 1.0.40.

- Syntax palette darkened to meet contrast on the white editor; JSON keys use one color at every depth.
- Explicit colors for everything drawn over the editor: find, selection, word highlights, diff and merge, inlay hints, ghost text, bracket pairs, sticky scroll, minimap, scrollbars.
- Light hover, suggest, peek and inline chat widgets; find, rename and menus stay dark.
- Dark active tab, one step lighter than the tab strip, with an accent line on top.
- Semantic highlighting for TypeScript.
- Modern UI tab colors for the pill tab style; README explains the setting for the connected style.
- Fixed from Nest: invalid JSON, broken color values and selectors, white-on-white default token color, invisible cursor and line numbers, green warnings, invisible keyboard focus, grey function declarations.
