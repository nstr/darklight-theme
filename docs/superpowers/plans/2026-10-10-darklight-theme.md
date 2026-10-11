# Darklight Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Darklight VS Code color theme from the Nest Theme palette, verify it, package a `.vsix` and install it into the author's VS Code.

**Architecture:** Plain ES modules: `src/palette.mjs` holds every hex value; `src/workbench.mjs` and `src/syntax.mjs` map VS Code keys and TextMate/semantic scopes to palette names; `src/theme.mjs` assembles the theme object; `scripts/build.mjs` writes it to `themes/darklight-color-theme.json`; `scripts/check-lib.mjs` holds pure check functions used by `scripts/check.mjs` (CLI) and by `node --test` tests.

**Tech Stack:** Node 22 (works on ≥20), `node:test`, `@vscode/vsce`, `ovsx`, `rsvg-convert` for the icon.

**Spec:** `docs/superpowers/specs/2026-10-10-darklight-theme-design.md`

## Global Constraints

- Theme `name: "Darklight"`, `type: "dark"`, `semanticHighlighting: true`; package `name: darklight-theme`, `publisher: nstr`, `version: 0.1.0`, `engines.vscode: ^1.85.0`, `uiTheme: vs-dark`.
- Only `src/palette.mjs` contains hex literals; colors are `#RRGGBB` or `#RRGGBBAA`.
- Contrast thresholds: syntax 4.5 (comment/operator 3.5, special 4.3) on `#FFFFFF` and `#F4F5F7`; text on selection/find/diff ≥ 3.5; chrome text ≥ 4.5 on `#1B1E2B` and `#292D3E`.
- Italic only for comments. No runtime dependencies.
- The VS Code CLI is `/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code` (not on PATH).

## Review Focus

- A token color that is not a palette syntax color (e.g. a stray hex in `syntax.mjs`) — check must fail with the offending scope (test in Task 2).
- A `tokenColors` scope string containing `|` or `,` — check must fail (test in Task 2).
- A required key accidentally set to an empty string — check must fail (test in Task 2).
- Widget backgrounds: hover/suggest/peek must be light, find/rename/quick input dark (test in Task 4).
- Semantic token colors must also pass contrast (test in Task 2 fixtures and real run in Task 5).

---

### Task 1: Scaffold + color math

**Files:** Create `package.json`, `.gitignore`, `.vscodeignore`, `.vscode/launch.json`, `src/color.mjs`, `test/color.test.mjs`.

**Produces:** `alpha(hex, a) → '#RRGGBBAA'`, `parseHex(hex) → {r,g,b,a}` (0..1), `blend(hex, bgHex) → '#RRGGBB'`, `contrast(fgHex, bgHex) → number` (alpha blended over bg first).

- [ ] Write tests: `alpha('#80CBC4', 0.35) === '#80CBC459'`; `contrast('#FFFFFF','#000000')` ≈ 21; `contrast('#597078','#FFFFFF')` ≈ 5.23; `blend('#80CBC459','#FFFFFF') === '#D3EDEA'`; `parseHex('#12')` throws.
- [ ] Run `node --test test/` → fail; implement; run → pass; commit.

### Task 2: Palette + check library

**Files:** Create `src/palette.mjs`, `scripts/check-lib.mjs`, `test/check-lib.test.mjs`.

**Produces:** `palette = { syntax, ui, editor, status, terminal }` with values from spec §4; `syntaxThresholds = { comment: 3.5, operator: 3.5, special: 4.3 }` (default 4.5). Check functions, each returning `string[]` of errors: `checkFormat(theme)`, `checkCoverage(theme, requiredKeys)`, `checkSyntaxContrast(theme, palette)`, `checkHighlightContrast(theme, palette)`, `checkChromeContrast(palette)`.

- [ ] Tests with small fixture themes: bad hex `##597078` → error; empty string → error; scope with `|` → error; scope-less rule → error; token color not in `palette.syntax` → error naming the scope; low-contrast palette entry → error; missing required key → error; the real palette passes `checkChromeContrast`.
- [ ] Fail → implement → pass → commit.

### Task 3: Syntax rules + theme build

**Files:** Create `src/syntax.mjs`, `src/theme.mjs`, `scripts/build.mjs`, `test/syntax.test.mjs`.

**Produces:** `tokenColors` (array, scopes as arrays), `semanticTokenColors`; `buildTheme() → theme object`.

- [ ] Tests: resolving scope `entity.name.function.tsx` gives `palette.syntax.function`; `support.type.property-name.json` → function; `entity.other.attribute-name.tsx` → attribute; `comment.line` fontStyle italic and no other rule italic; `semanticTokenColors.interface === syntax.type`; `checkFormat` and `checkSyntaxContrast` return [] on `buildTheme()`.
- [ ] Fail → implement per spec §6 → pass → commit.

### Task 4: Workbench colors + required keys

**Files:** Create `src/workbench.mjs`, `scripts/required-keys.mjs`, `test/workbench.test.mjs`.

- [ ] Tests: `checkCoverage(buildTheme(), requiredKeys)` empty; tabs per spec §5.2; `editorHoverWidget.background`, `editorSuggestWidget.background`, `peekViewEditor.background` equal `editor.widgetBg`; `editorWidget.background`, `quickInput.background` equal `ui.surface`; Nest local patch keys present (`button.secondaryBackground`, `settings.textInputBackground`, `profileBadge.background`); `checkHighlightContrast` empty.
- [ ] Fail → implement per spec §5 → pass → commit.

### Task 5: Build output, CLI check, samples, docs, icon

**Files:** Create `scripts/check.mjs`, `themes/darklight-color-theme.json` (generated), `samples/*`, `README.md`, `CHANGELOG.md`, `icon.svg`, `icon.png`.

- [ ] `npm run build && npm run check` → exit 0; `npm test` passes.
- [ ] Commit.

### Task 6: Package, live verification, install

- [ ] `npm install`, `npm run package` → `darklight-theme-0.1.0.vsix`.
- [ ] Isolated VS Code (`--user-data-dir`/`--extensions-dir` in scratchpad) with the theme selected; open `samples/`; walk spec §8 checklist; fix findings (back to the owning task's module + test).
- [ ] Install into the author's VS Code: `code --install-extension darklight-theme-0.1.0.vsix`; verify with `code --list-extensions | grep darklight`.
- [ ] Commit.
