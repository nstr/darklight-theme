import { test } from 'node:test'
import assert from 'node:assert/strict'
import { palette } from '../src/palette.mjs'
import {
  checkFormat,
  checkCoverage,
  checkSyntaxContrast,
  checkHighlightContrast,
  checkChromeContrast,
} from '../scripts/check-lib.mjs'

const theme = (overrides = {}) => ({
  name: 'Fixture',
  type: 'dark',
  colors: { 'editor.background': palette.editor.bg },
  tokenColors: [{ scope: ['comment'], settings: { foreground: palette.syntax.comment, fontStyle: 'italic' } }],
  semanticTokenColors: { class: palette.syntax.type },
  ...overrides,
})

test('a clean fixture passes every theme check', () => {
  assert.deepEqual(checkFormat(theme()), [])
  assert.deepEqual(checkSyntaxContrast(theme(), palette), [])
})

test('checkFormat rejects malformed and empty colors', () => {
  const errors = checkFormat(theme({ colors: { 'editor.background': '##597078', 'editorWidget.border': '' } }))
  assert.equal(errors.length, 2)
  assert.match(errors.join('\n'), /editor\.background/)
  assert.match(errors.join('\n'), /editorWidget\.border/)
})

test('checkFormat rejects bad token rules', () => {
  const errors = checkFormat(
    theme({
      tokenColors: [
        { settings: { foreground: '#FFFFFF' } },
        { scope: ['markup.heading | markup.heading entity.name'], settings: { foreground: palette.syntax.attribute } },
        { scope: 'string, comment', settings: { foreground: palette.syntax.string } },
      ],
    }),
  )
  assert.equal(errors.length, 3)
  assert.match(errors[0], /no scope/)
  assert.match(errors[1], /\|/)
  assert.match(errors[2], /array/)
})

test('checkFormat validates semantic token colors', () => {
  const errors = checkFormat(theme({ semanticTokenColors: { class: '#12' } }))
  assert.match(errors.join('\n'), /semanticTokenColors\.class/)
})

test('checkCoverage lists missing and empty required keys', () => {
  const errors = checkCoverage(theme(), ['editor.background', 'editor.findMatchBackground'])
  assert.deepEqual(errors, ['missing required color key: editor.findMatchBackground'])
})

test('checkSyntaxContrast rejects colors outside the syntax palette', () => {
  const errors = checkSyntaxContrast(
    theme({ tokenColors: [{ scope: ['string'], settings: { foreground: '#FB8C00' } }] }),
    palette,
  )
  assert.equal(errors.length, 1)
  assert.match(errors[0], /string/)
  assert.match(errors[0], /not a palette\.syntax color/)
})

test('checkSyntaxContrast reports contrast below the threshold', () => {
  const weak = { ...palette, syntax: { ...palette.syntax, string: '#FB8C00' } }
  const errors = checkSyntaxContrast(
    theme({ tokenColors: [{ scope: ['string'], settings: { foreground: '#FB8C00' } }] }),
    weak,
  )
  assert.equal(errors.length, 2)
  assert.match(errors[0], /syntax\.string .* < 4\.5/)
})

test('checkHighlightContrast reports text that disappears on a highlight', () => {
  const t = theme({ colors: { 'editor.background': '#FFFFFF', 'editor.selectionBackground': '#597078CC' } })
  const errors = checkHighlightContrast(t, palette)
  assert.ok(errors.some((e) => e.includes('editor.selectionBackground')))
})

test('the real palette meets chrome contrast', () => {
  assert.deepEqual(checkChromeContrast(palette), [])
})

test('checkChromeContrast catches dim chrome text', () => {
  const dim = { ...palette, ui: { ...palette.ui, fgMuted: '#676E95' } }
  assert.ok(checkChromeContrast(dim).some((e) => e.includes('ui.fgMuted')))
})

test('checkChromeContrast catches shared text that fails on white', () => {
  const pale = { ...palette, ui: { ...palette.ui, fgShared: '#A6ACCD' } }
  assert.ok(checkChromeContrast(pale).some((e) => e.includes('ui.fgShared')))
})
