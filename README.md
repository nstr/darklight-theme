# Darklight

A VS Code theme that is neither dark nor light: a deep blue workbench frames a white editor.
The syntax colors keep the Material Palenight spirit, tuned so every token stays readable on white.

Darklight is the successor of [Nest Theme](https://marketplace.visualstudio.com/items?itemName=nesterman.material-nest-theme).

## Highlights

- Dark frame (`#1B1E2B` / `#292D3E`) around a white editor; the active tab is one step lighter and joins the breadcrumbs.
- Syntax colors meet WCAG contrast on white: 4.5:1 for code, 3.5:1 for comments and operators.
- Every color that VS Code draws over the editor is set explicitly: search, selection, diff, inlay hints, ghost text, bracket pairs, sticky scroll, minimap.
- Hovers, suggestions and peek views are light, so highlighted code inside them stays readable.
- Semantic highlighting for TypeScript and React.

## Install

Search for **Darklight** in the Extensions view, then pick it with **Preferences: Color Theme**.

## Development

Requires Node 20 or newer.

```bash
npm install
npm run build    # writes themes/darklight-color-theme.json from src/
npm run check    # format, required keys and contrast checks
npm test         # unit tests
npm run package  # build, check and create the .vsix
```

Colors live in `src/palette.mjs`. `src/workbench.mjs` maps workbench color keys and `src/syntax.mjs` maps TextMate and semantic scopes to palette names. Do not edit the generated JSON by hand.

Press F5 in VS Code ("Launch Extension") to open a window with the theme and the files in `samples/`.

## License

MIT
