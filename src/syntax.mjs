import { palette } from './palette.mjs'

const s = palette.syntax

const rule = (name, scope, foreground, fontStyle) => ({
  name,
  scope,
  settings: fontStyle === undefined ? { foreground } : { foreground, fontStyle },
})

// TextMate rules. Selectors are always arrays of single selectors (no "," or "|").
// VS Code picks the rule matching the deepest scope, then the longest selector,
// so generic rules (e.g. `variable`) can sit next to specific ones (`variable.language`).
export const tokenColors = [
  rule('Comments', ['comment', 'punctuation.definition.comment', 'string.quoted.docstring'], s.comment, 'italic'),
  rule('JSDoc tags', ['storage.type.class.jsdoc', 'punctuation.definition.block.tag.jsdoc'], s.keyword),
  rule('JSDoc types', ['entity.name.type.instance.jsdoc'], s.type),
  rule('JSDoc names', ['variable.other.jsdoc'], s.fg),

  rule('Keywords and storage', [
    'keyword',
    'keyword.control',
    'keyword.other',
    'keyword.operator.new',
    'keyword.operator.expression',
    'keyword.operator.word',
    'storage.type',
    'storage.modifier',
  ], s.keyword),

  rule('Operators', [
    'keyword.operator',
    'keyword.other.template',
    'keyword.other.substitution',
    'punctuation.accessor.optional',
    'punctuation.definition.template-expression',
    'constant.character.escape',
    'constant.other.placeholder',
  ], s.operator),

  rule('Variables, parameters, properties', [
    'variable',
    'variable.other',
    'variable.parameter',
    'variable.other.readwrite.alias',
    'meta.object-literal.key',
    'support.variable.property',
  ], s.fg),

  rule('Functions, methods, this, decorators', [
    'entity.name.function',
    'variable.function',
    'support.function',
    'keyword.other.special-method',
    'variable.language',
    'meta.decorator',
    'punctuation.decorator',
  ], s.function),

  rule('Types and classes', [
    'entity.name.type',
    'entity.name.class',
    'entity.name.namespace',
    'entity.other.inherited-class',
    'support.type',
    'support.class',
  ], s.type),

  rule('Strings', ['string', 'punctuation.definition.string', 'constant.other.symbol'], s.string),
  rule('Regular expressions', ['string.regexp'], s.special),

  rule('Numbers and constants', [
    'constant',
    'constant.numeric',
    'constant.language',
    'constant.character',
    'constant.other.color',
    'support.constant',
    'keyword.other.unit',
    'variable.other.enummember',
  ], s.constant),

  rule('Tags', ['entity.name.tag', 'support.class.component'], s.tag),
  rule('Tag punctuation', ['punctuation.definition.tag'], s.operator),
  rule('JSX attributes', ['entity.other.attribute-name'], s.attribute),
  rule('JSX text and embedded braces', ['meta.jsx.children', 'punctuation.section.embedded'], s.fg),

  rule('HTML attributes and CSS selectors', [
    'entity.other.attribute-name.html',
    'entity.other.attribute-name.class',
    'entity.other.attribute-name.id',
    'entity.other.attribute-name.pseudo-class',
    'entity.other.attribute-name.pseudo-element',
  ], s.cssClass),
  rule('CSS properties', ['support.type.property-name', 'support.type.vendored.property-name'], s.cssProperty),
  rule('JSON keys', ['support.type.property-name.json'], s.function),

  rule('Invalid', ['invalid', 'invalid.illegal'], s.invalid),
  rule('Deprecated', ['invalid.deprecated'], s.special),

  rule('Markdown headings', [
    'markup.heading',
    'markup.heading entity.name',
    'entity.name.section.markdown',
    'punctuation.definition.heading.markdown',
  ], s.attribute, 'bold'),
  rule('Markdown bold', ['markup.bold'], s.type, 'bold'),
  rule('Markdown italic', ['markup.italic'], s.type, 'italic'),
  rule('Markdown bold italic', ['markup.bold markup.italic', 'markup.italic markup.bold'], s.type, 'bold italic'),
  rule('Markdown code', ['markup.inline.raw', 'markup.fenced_code.block.markdown', 'markup.raw.block'], s.special),
  rule('Markdown quotes, fences, separators', [
    'markup.quote',
    'punctuation.definition.quote.begin.markdown',
    'fenced_code.block.language',
    'punctuation.definition.markdown',
    'meta.separator.markdown',
  ], s.comment),
  rule('Markdown links', ['string.other.link.title.markdown', 'string.other.link.description.markdown'], s.function),
  rule('Markdown link targets', ['markup.underline.link', 'constant.other.reference.link.markdown'], s.cssClass),
  rule('Markdown list markers', ['punctuation.definition.list.begin.markdown'], s.operator),
  { name: 'Markdown underline', scope: ['markup.underline'], settings: { fontStyle: 'underline' } },
  { name: 'Markdown strikethrough', scope: ['markup.strikethrough'], settings: { fontStyle: 'strikethrough' } },

  rule('Diff inserted', ['markup.inserted'], s.attribute),
  rule('Diff deleted', ['markup.deleted'], s.invalid),
  rule('Diff changed', ['markup.changed'], s.special),
  rule('Diff headers', ['meta.diff.header', 'meta.diff.range'], s.function),
]

export const semanticTokenColors = {
  class: s.type,
  interface: s.type,
  enum: s.type,
  type: s.type,
  typeParameter: s.type,
  namespace: s.type,
  function: s.function,
  method: s.function,
  enumMember: s.constant,
  variable: s.fg,
  parameter: s.fg,
  property: s.fg,
  '*.deprecated': { strikethrough: true },
}
