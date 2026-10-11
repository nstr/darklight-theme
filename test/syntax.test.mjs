import { test } from 'node:test'
import assert from 'node:assert/strict'
import { palette } from '../src/palette.mjs'
import { tokenColors, semanticTokenColors } from '../src/syntax.mjs'
import { buildTheme } from '../src/theme.mjs'
import { checkFormat, checkSyntaxContrast } from '../scripts/check-lib.mjs'
import { resolve } from './support/resolve.mjs'

const s = palette.syntax
const fg = (...stack) => resolve(tokenColors, stack).foreground ?? 'default'
const tsx = (...scopes) => fg('source.tsx', ...scopes)

const cases = [
  ['keyword import', tsx('meta.import.tsx', 'keyword.control.import.tsx'), s.keyword],
  ['const', tsx('meta.var.expr.tsx', 'storage.type.tsx'), s.keyword],
  ['typeof', tsx('keyword.operator.expression.typeof.tsx'), s.keyword],
  ['new', tsx('meta.class.tsx', 'new.expr.tsx', 'keyword.operator.new.tsx'), s.keyword],
  ['arrow', tsx('meta.arrow.tsx', 'storage.type.function.arrow.tsx'), s.keyword],
  ['function declaration', tsx('meta.function.tsx', 'meta.definition.function.tsx', 'entity.name.function.tsx'), s.function],
  ['method call', tsx('meta.function-call.tsx', 'entity.name.function.tsx'), s.function],
  ['this', tsx('variable.language.this.tsx'), s.function],
  ['decorator', tsx('meta.decorator.tsx', 'punctuation.decorator.tsx'), s.function],
  ['interface name', tsx('meta.interface.tsx', 'entity.name.type.interface.tsx'), s.type],
  ['primitive type', tsx('meta.type.annotation.tsx', 'support.type.primitive.tsx'), s.type],
  ['class heritage', tsx('meta.class.tsx', 'entity.other.inherited-class.tsx'), s.type],
  ['parameter', tsx('meta.parameters.tsx', 'variable.parameter.tsx'), s.fg],
  ['property access', tsx('variable.other.property.tsx'), s.fg],
  ['object key', tsx('meta.objectliteral.tsx', 'meta.object.member.tsx', 'meta.object-literal.key.tsx'), s.fg],
  ['const variable', tsx('meta.var.expr.tsx', 'meta.definition.variable.tsx', 'variable.other.constant.tsx'), s.fg],
  ['string', tsx('string.quoted.single.tsx'), s.string],
  ['string quote', tsx('string.quoted.single.tsx', 'punctuation.definition.string.begin.tsx'), s.string],
  ['template ${', tsx('string.template.tsx', 'meta.template.expression.tsx', 'punctuation.definition.template-expression.begin.tsx'), s.operator],
  ['variable inside template', tsx('string.template.tsx', 'meta.template.expression.tsx', 'meta.embedded.line.tsx', 'variable.other.readwrite.tsx'), s.fg],
  ['assignment', tsx('keyword.operator.assignment.tsx'), s.operator],
  ['optional chaining', tsx('punctuation.accessor.optional.tsx'), s.operator],
  ['number', tsx('constant.numeric.decimal.tsx'), s.constant],
  ['boolean', tsx('constant.language.boolean.false.tsx'), s.constant],
  ['enum member', tsx('meta.enum.declaration.tsx', 'variable.other.enummember.tsx'), s.constant],
  ['regexp', tsx('string.regexp.tsx'), s.special],
  ['regexp anchor', tsx('string.regexp.tsx', 'keyword.control.anchor.regexp'), s.operator],
  ['regexp quantifier', tsx('string.regexp.tsx', 'keyword.operator.quantifier.regexp'), s.operator],
  ['regexp flags', tsx('string.regexp.tsx', 'keyword.other.tsx'), s.special],
  ['decorator name', tsx('meta.decorator.tsx', 'variable.other.readwrite.tsx'), s.function],
  ['decorator call', tsx('meta.decorator.tsx', 'meta.function-call.tsx', 'entity.name.function.tsx'), s.function],
  ['escape', tsx('string.quoted.double.tsx', 'constant.character.escape.tsx'), s.operator],
  ['jsx tag', tsx('meta.tag.tsx', 'entity.name.tag.tsx'), s.tag],
  ['jsx component', tsx('meta.tag.tsx', 'entity.name.tag.tsx', 'support.class.component.tsx'), s.tag],
  ['jsx angle bracket', tsx('meta.tag.tsx', 'punctuation.definition.tag.begin.tsx'), s.operator],
  ['jsx attribute', tsx('meta.tag.tsx', 'meta.tag.attributes.tsx', 'entity.other.attribute-name.tsx'), s.attribute],
  ['jsx expression brace', tsx('meta.tag.tsx', 'meta.jsx.children.tsx', 'meta.embedded.expression.tsx', 'punctuation.section.embedded.begin.tsx'), s.fg],
  ['jsx text', tsx('meta.tag.tsx', 'meta.jsx.children.tsx'), s.fg],
  ['comment', tsx('comment.line.double-slash.tsx'), s.comment],
  ['jsdoc tag', tsx('comment.block.documentation.tsx', 'storage.type.class.jsdoc'), s.keyword],
  ['jsdoc type', tsx('comment.block.documentation.tsx', 'entity.name.type.instance.jsdoc'), s.type],
  ['jsdoc name', tsx('comment.block.documentation.tsx', 'variable.other.jsdoc'), s.fg],
  ['json key', fg('source.json', 'meta.structure.dictionary.json', 'support.type.property-name.json'), s.function],
  ['nested json key', fg('source.json', 'meta.structure.dictionary.json', 'meta.structure.dictionary.value.json', 'meta.structure.dictionary.json', 'support.type.property-name.json'), s.function],
  ['json string', fg('source.json', 'meta.structure.dictionary.value.json', 'string.quoted.double.json'), s.string],
  ['css property', fg('source.css', 'meta.property-name.css', 'support.type.property-name.css'), s.cssProperty],
  ['css class', fg('source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'), s.cssClass],
  ['html attribute', fg('text.html.basic', 'meta.tag.inline.html', 'entity.other.attribute-name.html'), s.cssClass],
  ['md heading', fg('text.html.markdown', 'markup.heading.markdown', 'entity.name.section.markdown'), s.attribute],
  ['md heading hash', fg('text.html.markdown', 'markup.heading.markdown', 'punctuation.definition.heading.markdown'), s.attribute],
  ['md bold', fg('text.html.markdown', 'meta.paragraph.markdown', 'markup.bold.markdown'), s.type],
  ['md inline code', fg('text.html.markdown', 'markup.inline.raw.string.markdown'), s.special],
  ['md quote', fg('text.html.markdown', 'markup.quote.markdown', 'meta.paragraph.markdown'), s.comment],
  ['md fence language', fg('text.html.markdown', 'markup.fenced_code.block.markdown', 'fenced_code.block.language.markdown'), s.comment],
  ['md link text', fg('text.html.markdown', 'meta.link.inline.markdown', 'string.other.link.title.markdown'), s.function],
  ['md link url', fg('text.html.markdown', 'meta.link.inline.markdown', 'markup.underline.link.markdown'), s.cssClass],
  ['md list bullet', fg('text.html.markdown', 'markup.list.unnumbered.markdown', 'punctuation.definition.list.begin.markdown'), s.operator],
  ['diff inserted', fg('source.diff', 'markup.inserted.diff'), s.attribute],
  ['diff deleted', fg('source.diff', 'markup.deleted.diff'), s.invalid],
]

for (const [name, actual, expected] of cases) {
  test(`scope: ${name}`, () => assert.equal(actual, expected))
}

test('plain source text uses the editor foreground', () => {
  assert.equal(tsx('meta.var.expr.tsx'), 'default')
})

test('only comments are italic', () => {
  assert.equal(resolve(tokenColors, ['source.tsx', 'comment.line.double-slash.tsx']).fontStyle, 'italic')
  const italic = tokenColors.filter((r) => r.settings.fontStyle?.includes('italic'))
  for (const rule of italic) {
    assert.ok(
      rule.scope.every((sel) => /^(comment|punctuation\.definition\.comment|string\.quoted\.docstring|markup\.italic|markup\.bold markup\.italic|markup\.italic markup\.bold)/.test(sel)),
      `unexpected italic rule: ${rule.name}`,
    )
  }
})

test('markdown headings are bold', () => {
  assert.equal(resolve(tokenColors, ['text.html.markdown', 'markup.heading.markdown', 'entity.name.section.markdown']).fontStyle, 'bold')
})

test('semantic tokens follow the TextMate roles', () => {
  for (const key of ['class', 'interface', 'enum', 'type', 'typeParameter', 'namespace']) assert.equal(semanticTokenColors[key], s.type, key)
  for (const key of ['function', 'method']) assert.equal(semanticTokenColors[key], s.function, key)
  assert.equal(semanticTokenColors.enumMember, s.constant)
  for (const key of ['variable', 'parameter', 'property']) assert.equal(semanticTokenColors[key], s.fg, key)
  assert.deepEqual(semanticTokenColors['*.deprecated'], { strikethrough: true })
})

test('the built theme is well-formed and readable', () => {
  const theme = buildTheme()
  assert.equal(theme.name, 'Darklight')
  assert.equal(theme.type, 'dark')
  assert.equal(theme.semanticHighlighting, true)
  assert.deepEqual(checkFormat(theme), [])
  assert.deepEqual(checkSyntaxContrast(theme, palette), [])
})
