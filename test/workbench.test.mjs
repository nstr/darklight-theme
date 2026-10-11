import { test } from 'node:test'
import assert from 'node:assert/strict'
import { palette } from '../src/palette.mjs'
import { buildTheme } from '../src/theme.mjs'
import { requiredKeys } from '../scripts/required-keys.mjs'
import { checkCoverage, checkFormat, checkHighlightContrast } from '../scripts/check-lib.mjs'
import { contrast } from '../src/color.mjs'

const { colors } = buildTheme()
const { ui, editor } = palette

test('every editor-surface key is set', () => {
  assert.deepEqual(checkCoverage(buildTheme(), requiredKeys), [])
})

test('workbench colors are well-formed', () => {
  assert.deepEqual(checkFormat(buildTheme()), [])
})

test('text stays readable on selection, find and diff highlights', () => {
  assert.deepEqual(checkHighlightContrast(buildTheme(), palette), [])
})

test('tabs: dark strip, active tab one step lighter with accent on top', () => {
  assert.equal(colors['editorGroupHeader.tabsBackground'], ui.bg)
  assert.equal(colors['tab.inactiveBackground'], ui.bg)
  assert.equal(colors['tab.inactiveForeground'], ui.fgMuted)
  assert.equal(colors['tab.activeBackground'], ui.surface)
  assert.equal(colors['tab.activeForeground'], ui.fgStrong)
  assert.equal(colors['tab.activeBorderTop'], ui.accent)
  assert.equal(colors['tab.unfocusedActiveBackground'], ui.surface)
  assert.equal(colors['tab.unfocusedActiveForeground'], ui.fg)
  assert.equal(colors['breadcrumb.background'], ui.surface)
  assert.equal(colors['modernEditorTab.activeBackground'], ui.surface)
  assert.equal(colors['modernEditorTab.activeForeground'], ui.fgStrong)
})

test('widgets that render code are light', () => {
  for (const key of ['editorHoverWidget.background', 'editorSuggestWidget.background', 'peekViewEditor.background', 'inlineChat.background']) {
    assert.equal(colors[key], editor.widgetBg, key)
  }
})

test('widgets with inputs stay dark', () => {
  for (const key of ['editorWidget.background', 'quickInput.background', 'menu.background', 'notifications.background']) {
    assert.equal(colors[key], ui.surface, key)
  }
})

test('cursor and warnings are visible on white', () => {
  assert.ok(contrast(colors['editorCursor.foreground'], editor.bg) >= 3)
  assert.equal(colors['editorWarning.foreground'], palette.status.warning)
  assert.ok(contrast(colors['editorLineNumber.foreground'], editor.bg) >= 3)
})

test('focus border is visible', () => {
  assert.notEqual(colors.focusBorder.slice(7), '00')
})

test('local Nest patches are carried over', () => {
  for (const key of [
    'button.foreground',
    'button.secondaryBackground',
    'dropdown.listBackground',
    'profileBadge.background',
    'settings.textInputBackground',
    'settings.checkboxBackground',
    'settings.focusedRowBorder',
    'welcomePage.progress.foreground',
    'editorPane.background',
  ]) {
    assert.ok(colors[key], key)
  }
})

test('text fields are light everywhere, like the editor', () => {
  for (const key of ['input.background', 'settings.textInputBackground', 'settings.numberInputBackground', 'settings.dropdownBackground', 'settings.checkboxBackground']) {
    assert.equal(colors[key], editor.widgetBg, key)
  }
  assert.ok(contrast(colors['input.foreground'], colors['input.background']) >= 4.5)
  assert.ok(contrast(colors['settings.textInputForeground'], colors['settings.textInputBackground']) >= 4.5)
})

test('shared text reads on the white editor area and on the dark frame', () => {
  for (const key of ['foreground', 'descriptionForeground', 'textLink.foreground']) {
    assert.ok(contrast(colors[key], editor.bg) >= 3.5, `${key} on editor`)
    assert.ok(contrast(colors[key], ui.bg) >= 4.2, `${key} on frame`)
  }
  assert.ok(contrast(colors['settings.headerForeground'], editor.bg) >= 4.5)
})

test('chips carry their own light background', () => {
  for (const [fg, bg] of [
    ['textPreformat.foreground', 'textPreformat.background'],
    ['keybindingLabel.foreground', 'keybindingLabel.background'],
    ['badge.foreground', 'badge.background'],
  ]) {
    assert.ok(contrast(colors[fg], colors[bg]) >= 4.5, `${fg} on ${bg}`)
  }
})

test('output panel uses the editor background for light syntax colors', () => {
  assert.equal(colors['outputView.background'], editor.bg)
})

test('modern UI tab chips read on white Settings and in the dark frame', () => {
  assert.equal(colors['modernTab.activeBackground'], ui.surface)
  assert.ok(contrast(colors['modernTab.activeForeground'], colors['modernTab.activeBackground']) >= 4.5)
  assert.ok(contrast(colors['modernTab.activeBackground'], editor.bg) >= 3)
})
