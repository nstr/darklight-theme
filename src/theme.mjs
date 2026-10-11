import { workbench } from './workbench.mjs'
import { tokenColors, semanticTokenColors } from './syntax.mjs'

export function buildTheme() {
  return {
    $schema: 'vscode://schemas/color-theme',
    name: 'Darklight',
    type: 'dark',
    semanticHighlighting: true,
    colors: workbench,
    tokenColors,
    semanticTokenColors,
  }
}
