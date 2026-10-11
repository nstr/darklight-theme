import { test } from 'node:test'
import assert from 'node:assert/strict'
import { alpha, blend, contrast, parseHex } from '../src/color.mjs'

test('alpha appends a two-digit alpha channel', () => {
  assert.equal(alpha('#80CBC4', 0.35), '#80CBC459')
  assert.equal(alpha('#1B1E2B', 1), '#1B1E2BFF')
})

test('alpha rejects a color that already has alpha', () => {
  assert.throws(() => alpha('#80CBC459', 0.5))
})

test('parseHex reads rgb and optional alpha', () => {
  assert.deepEqual(parseHex('#FF0000'), { r: 1, g: 0, b: 0, a: 1 })
  assert.equal(parseHex('#00000080').a.toFixed(2), '0.50')
  assert.throws(() => parseHex('#12'))
  assert.throws(() => parseHex('##597078'))
})

test('blend composites a translucent color over a background', () => {
  assert.equal(blend('#80CBC459', '#FFFFFF'), '#D3EDEA')
  assert.equal(blend('#597078', '#FFFFFF'), '#597078')
})

test('contrast follows WCAG 2.x', () => {
  assert.equal(contrast('#FFFFFF', '#000000').toFixed(1), '21.0')
  assert.equal(contrast('#597078', '#FFFFFF').toFixed(2), '5.23')
  assert.equal(contrast('#FFFFFF', '#597078').toFixed(2), '5.23')
})
