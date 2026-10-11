import { palette } from './palette.mjs'

const { syntax, editor } = palette

export const workbench = {
  'editor.background': editor.bg,
  'editor.foreground': syntax.fg,
}
