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
  500: stub(500, 300, 'frame', { name: 'Frame alias', type: 'Weapon Frame' }),
  // alias of a perk that does not exist
  600: stub(600, 999, 'frame', { name: 'Lost', type: 'Weapon Frame' })
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
    assert.equal(output[600], undefined, name)
    assert.equal(output[500].hash, 500, name)
    assert.equal('aliasOf' in output[500], false, name)
    assert.deepEqual(output[500].descriptions, output[300].descriptions, name)
  }
  assert.equal(databaseConverter('clarity', database, inventoryItem)[500].name, 'Frame alias')
})

test('does not throw on stubs, including unknown targets and stubs of stubs', () => {
  const output = databaseConverter('clarityV2', { ...database, 700: stub(700, 400, 'sandbox') }, inventoryItem)
  assert.equal(output[600], undefined)
  assert.equal(output[700], undefined)
})
