import { blend, contrast } from '../src/color.mjs'
import { syntaxThresholds } from '../src/palette.mjs'

const HEX = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/
const isColor = (value) => typeof value === 'string' && HEX.test(value)
const fmt = (n) => n.toFixed(2)

const semanticForeground = (value) => (typeof value === 'string' ? value : value?.foreground)

function formatColor(where, value) {
  if (value === '') return [`${where}: empty color value`]
  return isColor(value) ? [] : [`${where}: invalid color ${JSON.stringify(value)}`]
}

export function checkFormat(theme) {
  const errors = []
  for (const [key, value] of Object.entries(theme.colors ?? {})) errors.push(...formatColor(`colors.${key}`, value))

  theme.tokenColors?.forEach((rule, i) => {
    const where = `tokenColors[${i}]${rule.name ? ` (${rule.name})` : ''}`
    if (rule.scope === undefined || rule.scope.length === 0) return errors.push(`${where}: no scope`)
    if (!Array.isArray(rule.scope)) return errors.push(`${where}: scope must be an array of selectors`)
    for (const selector of rule.scope) {
      if (typeof selector !== 'string' || selector.trim() === '') errors.push(`${where}: empty selector`)
      else if (/[|,]/.test(selector)) errors.push(`${where}: selector ${JSON.stringify(selector)} contains "|" or ","`)
    }
    for (const prop of ['foreground', 'background']) {
      if (rule.settings?.[prop] !== undefined) errors.push(...formatColor(`${where}.${prop}`, rule.settings[prop]))
    }
  })

  for (const [token, value] of Object.entries(theme.semanticTokenColors ?? {})) {
    const fg = semanticForeground(value)
    if (fg !== undefined) errors.push(...formatColor(`semanticTokenColors.${token}`, fg))
  }
  return errors
}

export function checkCoverage(theme, requiredKeys) {
  return requiredKeys
    .filter((key) => !isColor(theme.colors?.[key]))
    .map((key) => `missing required color key: ${key}`)
}

function syntaxForegrounds(theme) {
  const out = []
  theme.tokenColors?.forEach((rule, i) => {
    if (rule.settings?.foreground) out.push([`tokenColors[${i}] ${[rule.scope].flat().join(' ')}`, rule.settings.foreground])
  })
  for (const [token, value] of Object.entries(theme.semanticTokenColors ?? {})) {
    const fg = semanticForeground(value)
    if (fg) out.push([`semanticTokenColors.${token}`, fg])
  }
  return out
}

export function checkSyntaxContrast(theme, palette) {
  const names = Object.fromEntries(Object.entries(palette.syntax).map(([name, hex]) => [hex.toUpperCase(), name]))
  const backgrounds = [palette.editor.bg, palette.editor.lineHighlight]
  const errors = []
  for (const [where, color] of syntaxForegrounds(theme)) {
    const name = names[color.toUpperCase()]
    if (!name) {
      errors.push(`${where}: ${color} is not a palette.syntax color`)
      continue
    }
    const min = syntaxThresholds[name] ?? syntaxThresholds.default
    for (const bg of backgrounds) {
      const ratio = contrast(color, bg)
      if (ratio < min) errors.push(`${where}: syntax.${name} ${color} on ${bg} = ${fmt(ratio)} < ${min}`)
    }
  }
  return errors
}

const HIGHLIGHT_KEYS = [
  'editor.selectionBackground',
  'editor.findMatchBackground',
  'editor.findMatchHighlightBackground',
  'editor.wordHighlightBackground',
  'editor.wordHighlightStrongBackground',
  'diffEditor.insertedTextBackground',
  'diffEditor.removedTextBackground',
]
// Text on selection, find and diff highlights may lose a little contrast against its own
// threshold, but never needs more than HIGHLIGHT_MIN.
const HIGHLIGHT_MIN = 3.5
const HIGHLIGHT_ALLOWANCE = 0.6

export function checkHighlightContrast(theme, palette) {
  const editorBg = theme.colors?.['editor.background'] ?? palette.editor.bg
  const texts = { fg: palette.syntax.fg, string: palette.syntax.string, keyword: palette.syntax.keyword }
  const errors = []
  for (const key of HIGHLIGHT_KEYS) {
    const highlight = theme.colors?.[key]
    if (!isColor(highlight)) continue
    const surface = blend(highlight, editorBg)
    for (const [name, color] of Object.entries(texts)) {
      const min = Math.min(HIGHLIGHT_MIN, (syntaxThresholds[name] ?? syntaxThresholds.default) - HIGHLIGHT_ALLOWANCE)
      const ratio = contrast(color, surface)
      if (ratio < min) errors.push(`${key}: syntax.${name} on ${surface} = ${fmt(ratio)} < ${min}`)
    }
  }
  return errors
}

const CHROME_MIN = 4.5
const SHARED_ON_EDITOR_MIN = 3.5
const SHARED_ON_FRAME_MIN = 4.2

export function checkChromeContrast(palette) {
  const errors = []
  for (const text of ['fg', 'fgMuted', 'fgStrong']) {
    for (const bg of ['bg', 'surface']) {
      const ratio = contrast(palette.ui[text], palette.ui[bg])
      if (ratio < CHROME_MIN) errors.push(`ui.${text} on ui.${bg} = ${fmt(ratio)} < ${CHROME_MIN}`)
    }
  }
  // Shared text appears on both the white editor area and the dark frame.
  for (const text of ['fgShared', 'linkShared']) {
    for (const [bg, min] of [[palette.editor.bg, SHARED_ON_EDITOR_MIN], [palette.ui.bg, SHARED_ON_FRAME_MIN]]) {
      const ratio = contrast(palette.ui[text], bg)
      if (ratio < min) errors.push(`ui.${text} on ${bg} = ${fmt(ratio)} < ${min}`)
    }
  }
  return errors
}
