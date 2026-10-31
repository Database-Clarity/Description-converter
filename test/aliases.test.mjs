import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  converterSettings,
  descriptionConverter,
  expandAliases,
  getAliasOutput,
  getSettings,
  isAliasStub
} from '../index.js'

const perk = {
  hash: 100,
  name: 'Original',
  type: 'Weapon Frame',
  itemHash: 7,
  itemName: 'Item',
  uploadedBy: 'tester',
  updateTracker: { descriptions: {} },
  editor: { en: { main: 'main text', secondary: 'secondary text' } },
  associated: [3, 2],
  lastUpload: 1,
  inLiveDatabase: true,
  uploadToLive: true
}

test('stub without facts becomes a copy of the original with its own hash', () => {
  const stub = { hash: 200, aliasOf: 100, aliasKind: 'sandbox' }
  const input = { 100: perk, 200: stub }
  const expanded = expandAliases(input)

  assert.deepEqual(expanded[200], { ...perk, hash: 200 })
  assert.equal(expanded[100], perk)
  assert.deepEqual(Object.keys(expanded), ['100', '200'])
  assert.equal(input[200], stub, 'input is not modified')
  assert.equal(isAliasStub(input[200]), true)
  assert.equal(isAliasStub(input[100]), false)
})

test('stub facts replace the copied ones, the others are dropped', () => {
  const stub = { hash: 200, aliasOf: 100, aliasKind: 'frame', name: 'Alias', type: 'Weapon Frame Enhanced' }
  const copy = expandAliases({ 100: perk, 200: stub })[200]

  assert.equal(copy.name, 'Alias')
  assert.equal(copy.type, 'Weapon Frame Enhanced')
  assert.equal('itemHash' in copy, false)
  assert.equal('itemName' in copy, false)
  assert.deepEqual(copy.editor, perk.editor)
  assert.equal(copy.hash, 200)
})

test('unknown aliasOf and alias of an alias are skipped without throwing', () => {
  const expanded = expandAliases({
    100: perk,
    200: { hash: 200, aliasOf: 999, aliasKind: 'sandbox' },
    300: { hash: 300, aliasOf: 200, aliasKind: 'sandbox' }
  })
  assert.deepEqual(Object.keys(expanded), ['100'])
})

test('imports from an alias hash and type lookups keep working', () => {
  const empty = { en: { main: '', secondary: '' } }
  const database = expandAliases({
    1: { ...perk, hash: 1, type: 'none', editor: empty },
    2: { ...perk, hash: 2, type: 'none', editor: empty },
    3: { ...perk, hash: 3, type: 'none', editor: empty },
    100: { ...perk, editor: { en: { main: 'shared text', secondary: 'shared text' } } },
    200: { hash: 200, aliasOf: 100, aliasKind: 'sandbox' },
    300: { ...perk, hash: 300, editor: { en: { main: 'import main from 200', secondary: '' } } }
  })
  const convert = (hash) =>
    JSON.stringify(
      descriptionConverter({
        database,
        descriptionString: database[hash].editor.en.main,
        editorType: 'main',
        hash,
        language: 'en'
      })
    )

  assert.match(convert(300), /shared text/)
  assert.doesNotMatch(convert(300), /import/)
  assert.match(convert(200), /shared text/)
})

test('aliases output follows the settings', () => {
  const sandbox = { hash: 2, aliasOf: 1, aliasKind: 'sandbox' }
  const frame = { hash: 3, aliasOf: 1, aliasKind: 'frame' }

  for (const [name, settings] of Object.entries(converterSettings)) {
    if (name === 'clarityV2') continue
    assert.equal(settings.aliases, 'legacy', name)
    assert.equal(getAliasOutput(getSettings(name), sandbox), 'skip', name)
    assert.equal(getAliasOutput(getSettings(name), frame), 'copy', name)
  }
  assert.equal(converterSettings.clarityV2.aliases, 'reference')
  assert.equal(getAliasOutput(getSettings('clarityV2'), sandbox), 'reference')
  assert.equal(getAliasOutput(getSettings('clarityV2'), frame), 'reference')
})
