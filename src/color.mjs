const HEX = /^#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?$/

export function parseHex(hex) {
  const match = HEX.exec(hex)
  if (!match) throw new Error(`Invalid color: ${JSON.stringify(hex)}`)
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16) / 255)
  const a = match[2] ? parseInt(match[2], 16) / 255 : 1
  return { r, g, b, a }
}

const toByte = (x) => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0').toUpperCase()

// Adds an alpha channel to an opaque palette color: alpha('#80CBC4', 0.35) → '#80CBC459'.
export function alpha(hex, a) {
  if (hex.length !== 7) throw new Error(`alpha() expects an opaque #RRGGBB color, got ${hex}`)
  parseHex(hex)
  return hex.toUpperCase() + toByte(a)
}

// Composites a (possibly translucent) color over an opaque background.
export function blend(hex, bgHex) {
  const fg = parseHex(hex)
  const bg = parseHex(bgHex)
  return '#' + ['r', 'g', 'b'].map((c) => toByte(fg[c] * fg.a + bg[c] * (1 - fg.a))).join('')
}

const channel = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

function luminance(hex) {
  const { r, g, b } = parseHex(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

// WCAG 2.x contrast ratio; a translucent foreground is blended over the background first.
export function contrast(fgHex, bgHex) {
  const [hi, lo] = [luminance(blend(fgHex, bgHex)), luminance(bgHex)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
