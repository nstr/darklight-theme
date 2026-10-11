import { writeFileSync, mkdirSync } from 'node:fs'
import { buildTheme } from '../src/theme.mjs'

const out = new URL('../themes/darklight-color-theme.json', import.meta.url)
mkdirSync(new URL('.', out), { recursive: true })
writeFileSync(out, JSON.stringify(buildTheme(), null, 2) + '\n')
console.log(`Wrote ${out.pathname}`)
