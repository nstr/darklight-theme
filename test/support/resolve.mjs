// Simplified TextMate theme matching, close enough to VS Code's for unit tests:
// a selector matches when its last segment is a dot-prefix of some scope in the stack
// and its earlier segments match earlier scopes in order. The deepest match wins,
// then the longer matched prefix, then more segments, then the later rule.

const prefixMatch = (selector, scope) => scope === selector || scope.startsWith(selector + '.')

function score(selector, stack) {
  const parts = selector.trim().split(/\s+/)
  for (let depth = stack.length - 1; depth >= 0; depth--) {
    if (!prefixMatch(parts.at(-1), stack[depth])) continue
    let cursor = depth - 1
    let ok = true
    for (let p = parts.length - 2; p >= 0; p--) {
      while (cursor >= 0 && !prefixMatch(parts[p], stack[cursor])) cursor--
      if (cursor < 0) ok = false
      cursor--
    }
    if (ok) return [depth, parts.at(-1).length, parts.length]
  }
  return null
}

const better = (a, b) => {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] > b[i]
  return true
}

// Returns { foreground, fontStyle } resolved independently, like VS Code does.
export function resolve(tokenColors, stack) {
  const result = {}
  for (const prop of ['foreground', 'fontStyle']) {
    let best = null
    for (const rule of tokenColors) {
      if (rule.settings?.[prop] === undefined) continue
      for (const selector of rule.scope) {
        const s = score(selector, stack)
        if (s && (!best || better(s, best.s))) best = { s, value: rule.settings[prop] }
      }
    }
    if (best) result[prop] = best.value
  }
  return result
}
