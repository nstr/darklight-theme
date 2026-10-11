// Every color in Darklight comes from here. Hues are Nest Theme's; lightness is tuned
// so syntax colors stay readable on the white editor (see the design spec, section 4).

export const palette = {
  syntax: {
    fg: '#455A64',
    comment: '#72858F',
    keyword: '#8F59B3',
    function: '#5171A6',
    tag: '#4B71AE',
    string: '#E37600',
    type: '#D62750',
    constant: '#2C7896',
    attribute: '#587B15',
    cssClass: '#A46000',
    cssProperty: '#63718A',
    operator: '#009098',
    special: '#7C4DFF',
    invalid: '#D72929',
  },

  ui: {
    bg: '#1B1E2B',
    surface: '#292D3E',
    input: '#333747',
    fg: '#A6ACCD',
    fgStrong: '#EEFFFF',
    fgMuted: '#8B93B9',
    // Text VS Code draws both on the dark frame and on editor-area pages (Settings, Welcome).
    fgShared: '#7E86AD',
    linkShared: '#009098',
    accent: '#80CBC4',
    button: '#717CB4',
    black: '#000000',
    white: '#FFFFFF',
  },

  editor: {
    bg: '#FFFFFF',
    lineHighlight: '#F4F5F7',
    widgetBg: '#FAFBFC',
    widgetBorder: '#D8DCE3',
    subtleBg: '#F0F2F5',
    stickyBg: '#F7F8FA',
    stickyHover: '#EEF0F3',
    lineNumber: '#8A96A2',
    cursor: '#009098',
    guide: '#E8EAED',
    guideActive: '#B0BEC5',
    whitespace: '#B4BCC5',
    ghost: '#8E9AA6',
    findMatch: '#FFB62C',
    findBorder: '#A46000',
  },

  // Diagnostics and diff/git markers on the white editor.
  status: {
    error: '#D72929',
    warning: '#BA5100',
    info: '#5171A6',
    hint: '#72858F',
    added: '#587B15',
    modified: '#5171A6',
    deleted: '#D72929',
  },

  // Bright Nest/Palenight hues for the dark frame: terminal, git decorations, badges.
  bright: {
    blue: '#82AAFF',
    cyan: '#89DDFF',
    green: '#C3E88D',
    magenta: '#C792EA',
    red: '#FF5370',
    yellow: '#FFCB6B',
    orange: '#F78C6C',
  },
}

// Minimum contrast for syntax colors on the editor background and the current line.
export const syntaxThresholds = {
  default: 4.5,
  comment: 3.5,
  // Nest Theme's orange strings, only slightly darkened at the author's request.
  string: 2.8,
  operator: 3.5,
  special: 4.3,
}
