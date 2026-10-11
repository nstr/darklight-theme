import { readFileSync } from 'node:fs'
import { palette } from '../src/palette.mjs'
import { requiredKeys } from './required-keys.mjs'
import {
  checkFormat,
  checkCoverage,
  checkSyntaxContrast,
  checkHighlightContrast,
  checkChromeContrast,
} from './check-lib.mjs'

const path = new URL('../themes/darklight-color-theme.json', import.meta.url)
let theme
try {
  theme = JSON.parse(readFileSync(path, 'utf8'))
} catch (error) {
  console.error(`Cannot read ${path.pathname}: ${error.message}\nRun "npm run build" first.`)
  process.exit(1)
}

const checks = {
  format: checkFormat(theme),
  coverage: checkCoverage(theme, requiredKeys),
  'syntax contrast': checkSyntaxContrast(theme, palette),
  'highlight contrast': checkHighlightContrast(theme, palette),
  'chrome contrast': checkChromeContrast(palette),
}

let failed = 0
for (const [name, errors] of Object.entries(checks)) {
  console.log(`${errors.length ? '✗' : '✓'} ${name}`)
  for (const error of errors) console.log(`    ${error}`)
  failed += errors.length
}
console.log(`${Object.keys(theme.colors).length} colors, ${theme.tokenColors.length} token rules`)
process.exit(failed ? 1 : 0)
