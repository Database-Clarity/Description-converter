import assert from 'node:assert/strict'
import { test } from 'node:test'

import { converterSettings } from '../index.js'
import { databaseConverter } from '../examples/publisher.js'

const empty = { en: { main: '', secondary: '' } }
const perk = (hash, text, extra = {}) => ({
  hash,
  name: `Perk ${hash}`,
  type: 'Weapon Perk',
  uploadedBy: 'tester',
  updateTracker: { descriptions: {} },
  editor: { en: { main: text, secondary: text } },
  lastUpload: 1,
  inLiveDatabase: true,
  uploadToLive: true,
  ...extra
})
const stub = (hash, aliasOf, aliasKind, facts = {}) => ({ hash, aliasOf, aliasKind, ...facts })

const database = {
  // reserved perks used by the converter for variables, titles and exports
  1: perk(1, ''),
  2: perk(2, ''),
  3: perk(3, ''),
  // original that only repeats the Bungie description, alias that does not
  100: perk(100, 'Bungie text'),
  200: stub(200, 100, 'sandbox'),
  // original in the reserved range
  10: perk(10, 'Reserved text'),
  210: stub(210, 10, 'sandbox'),
  // original without an English description
  120: perk(120, ''),
  220: stub(220, 120, 'frame', { name: 'Empty frame', type: 'Weapon Frame' }),
  // normal original with a sandbox and a frame alias
  300: perk(300, 'Normal text'),
  400: stub(400, 300, 'sandbox'),
  500: stub(500, 300, 'frame', { name: 'Frame alias', type: 'Weapon Frame' })
}
const inventoryItem = { 100: { displayProperties: { description: 'Bungie text' } } }

test('every reference points at a row of the same output', () => {
  const output = databaseConverter('clarityV2', database, inventoryItem)

  assert.deepEqual(Object.keys(output), ['300', '400', '500'])
  assert.deepEqual(output[400], { hash: 400, aliasOf: 300 })
  assert.deepEqual(output[500], { hash: 500, aliasOf: 300 })
  assert.ok(output[300].descriptions.en)

  for (const row of Object.values(output)) {
    if ('aliasOf' in row) assert.ok(output[row.aliasOf]?.descriptions, `${row.hash} -> ${row.aliasOf}`)
  }
})

test('reference of a filtered original is omitted, whatever the order of the hashes', () => {
  // the alias passes the filters by itself (no Bungie description for its own hash), the original does not
  assert.equal(databaseConverter('clarityV2', database, inventoryItem)[200], undefined)
  assert.equal(databaseConverter('clarityV2', database, inventoryItem)[100], undefined)
  // reserved range and empty description
  for (const hash of [210, 220]) assert.equal(databaseConverter('clarityV2', database, inventoryItem)[hash], undefined)
  // alias hash lower than its original
  const reversed = { ...database, 5000: perk(5000, 'Bungie text'), 4000: stub(4000, 5000, 'sandbox') }
  const output = databaseConverter('clarityV2', reversed, { ...inventoryItem, 5000: inventoryItem[100] })
  assert.equal(output[4000], undefined)
})

test('legacy settings output frame copies and skip sandbox aliases', () => {
  for (const name of Object.keys(converterSettings).filter((name) => name !== 'clarityV2')) {
    const output = databaseConverter(name, database, inventoryItem)

    assert.equal(output[400], undefined, name)
    assert.equal(output[500].hash, 500, name)
    assert.equal('aliasOf' in output[500], false, name)
    assert.deepEqual(output[500].descriptions, output[300].descriptions, name)
  }
  assert.equal(databaseConverter('clarity', database, inventoryItem)[500].name, 'Frame alias')
})

test('rejects missing targets, alias chains, self references and cycles in every preset', () => {
  const invalid = [
    { 600: stub(600, 999, 'frame') },
    { 700: stub(700, 400, 'sandbox') },
    { 600: stub(600, 600, 'sandbox') },
    { 600: stub(600, 700, 'sandbox'), 700: stub(700, 600, 'sandbox') }
  ]
  for (const name of Object.keys(converterSettings)) {
    for (const aliases of invalid) {
      assert.throws(() => databaseConverter(name, { ...database, ...aliases }, inventoryItem), /Invalid alias/)
    }
  }
})

test('requires all reserved canonical globals before conversion, even for empty output', () => {
  for (const hash of [1, 2, 3]) {
    const missing = { ...database }
    delete missing[hash]
    assert.throws(() => databaseConverter('clarityV2', missing, inventoryItem), new RegExp(`reserved global ${hash}`))
    assert.throws(() => databaseConverter('clarityV2', { ...database, [hash]: stub(hash, 300, 'sandbox') }, inventoryItem), /reserved global/)
  }
})

test('rejects missing, alias and self associated targets without pruning authored associations', () => {
  for (const target of [999, 400, 300]) {
    const input = { ...database, 300: perk(300, 'Normal text', { associated: [target] }) }
    for (const name of Object.keys(converterSettings)) {
      assert.throws(() => databaseConverter(name, input, inventoryItem), /Invalid association/)
      assert.deepEqual(input[300].associated, [target])
    }
  }
})

test('checks associated closure after Bungie, empty and reserved target filtering', () => {
  for (const target of [100, 120, 10]) {
    const input = { ...database, 300: perk(300, 'Normal text', { associated: [target] }) }
    assert.throws(() => databaseConverter('clarityV2', input, inventoryItem), /canonical target was filtered out/)
    assert.deepEqual(input[300].associated, [target])
    assert.ok(databaseConverter('clarity', input, inventoryItem)[300])
  }
})

test('preserves associated order and exact stub shapes for closed valid output', () => {
  const input = {
    ...database,
    300: perk(300, 'Normal text', { associated: [900, 800] }),
    800: perk(800, 'Second target'),
    900: perk(900, 'First target')
  }
  const output = databaseConverter('clarityV2', input, inventoryItem)
  assert.deepEqual(output[300].associated, [900, 800])
  assert.deepEqual(output[400], { hash: 400, aliasOf: 300 })
  assert.deepEqual(output[500], { hash: 500, aliasOf: 300 })
  assert.equal('associated' in databaseConverter('clarity', input, inventoryItem)[300], false)
})

test('rejects missing import bodies and named exports in selected languages', () => {
  for (const text of ['import main from 999', 'import secondary from 999', 'import Missing from 300', 'import Missing from global']) {
    for (const name of Object.keys(converterSettings)) {
      assert.throws(() => databaseConverter(name, { ...database, 800: perk(800, text) }, inventoryItem), /Missing (import|export|global export)/)
    }
  }
  const translated = perk(800, 'English')
  translated.editor.de = { main: 'import main from 300', secondary: '' }
  assert.throws(() => databaseConverter('clarityV2', { ...database, 800: translated }, inventoryItem), /800\/de/)
  assert.ok(databaseConverter('vaultZero', { ...database, 800: translated }, inventoryItem)[800])
})

test('rejects import cycles instead of leaving unresolved markup after the pass limit', () => {
  const input = { ...database, 800: perk(800, 'import main from 900'), 900: perk(900, 'import main from 800') }
  assert.throws(() => databaseConverter('clarityV2', input, inventoryItem), /cyclic imports/)
})

test('allows intentionally empty imported bodies and preserves literal replacement characters', () => {
  const input = {
    ...database,
    800: perk(800, 'Before\nimport main from 120\nimport main from 400\nimport Money from global\nAfter'),
    300: perk(300, 'Cost $&'),
    1: perk(1, 'export Money (\nPrice $&\n)')
  }
  const text = JSON.stringify(databaseConverter('clarityV2', input, inventoryItem)[800].descriptions)
  assert.ok(text.includes('Cost $&'))
  assert.ok(text.includes('Price $&'))
  assert.equal(text.includes('import'), false)
})
