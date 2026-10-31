import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

import {
  allWeaponTypeNames,
  converterSettings,
  descriptionConverter,
  descriptionFilter,
  expandAliases,
  getDataFromPerk,
  getSettings,
  legacyWeaponTypeNames,
  specializeWeaponTypes,
  weaponTypeExtraTags,
  weaponTypeNames,
  weaponTypes
} from '../index.js'

const editor = JSON.parse(readFileSync(new URL('./fixtures/editor-weapon-types.json', import.meta.url), 'utf8'))

const empty = { en: { main: '', secondary: '' } }
const perk = (hash, text, extra = {}) => ({
  hash,
  name: `Perk ${hash}`,
  type: 'Weapon Frame',
  uploadedBy: 'tester',
  updateTracker: { descriptions: {} },
  editor: { en: { main: text, secondary: text } },
  lastUpload: 1,
  inLiveDatabase: true,
  uploadToLive: true,
  ...extra
})
const convert = (text) =>
  descriptionConverter({
    database: { 1: perk(1, ''), 2: perk(2, ''), 3: perk(3, ''), 100: perk(100, text) },
    descriptionString: text,
    editorType: 'main',
    hash: 100,
    language: 'en'
  })
const textOf = (lines) => lines.map((line) => line.linesContent?.map((content) => content.text).join('') ?? '')
const context = (weaponTypes, labels, language = 'en') => ({ weaponTypes, labels, language })

const sections = [
  'shared first',
  '<weapons Hand Cannon, Pulse Rifle>',
  'hand cannons and pulses',
  '</weapons>',
  '<weapons Sword>',
  'swords',
  '</weapons>',
  '<weapons other>',
  'everything else',
  '</weapons>',
  'shared last'
].join('\n')

const oldSyntax = ['< weapon type ( HC, Bow ) >', 'bows and hand cannons', '< ( Pulse ) >', 'pulses', '< ( other ) >', 'rest', '<$$>'].join(
  '\n'
)

test('names are the editor ones', () => {
  assert.deepEqual(weaponTypeNames, editor.weaponTypeNames)
  assert.deepEqual(weaponTypeExtraTags, editor.weaponTypeExtraTags)
  assert.deepEqual(allWeaponTypeNames, editor.markupWeaponTypes)
  assert.deepEqual(legacyWeaponTypeNames, editor.legacyWeaponTypeNames)
})

test('every old name is one of the names', () => {
  assert.equal(weaponTypes.length, allWeaponTypeNames.length)
  const lines = convert(['< weapon type ( ' + weaponTypes.join(', ') + ' ) >', 'all', '<$$>'].join('\n'))
  assert.deepEqual([...lines[0].weaponTypes].sort(), [...allWeaponTypeNames].sort())
})

test('<weapons> blocks tag their lines with the names', () => {
  const lines = convert(sections)

  assert.deepEqual(textOf(lines), [
    'shared first',
    'hand cannons and pulses',
    'swords',
    'everything else',
    'shared last'
  ])
  assert.equal('weaponTypes' in lines[0], false)
  assert.deepEqual(lines[1].weaponTypes, ['Hand Cannon', 'Pulse Rifle'])
  assert.deepEqual(lines[2].weaponTypes, ['Sword'])
  assert.equal(lines[3].weaponOther, true)
  assert.deepEqual(
    lines[3].weaponTypes,
    allWeaponTypeNames.filter((name) => !['Hand Cannon', 'Pulse Rifle', 'Sword'].includes(name))
  )
  assert.equal(new Set([1, 2, 3].map((index) => lines[index].weaponBlock)).size, 3)
})

test('malformed blocks do not throw', () => {
  const lines = convert(
    ['<weapons Nonsense, Sword>', 'sword', '<weapons Bow>', 'nested', '</weapons>', 'still sword', '</weapons>', '</weapons>', '<weapons Glaive>', 'never closed'].join('\n')
  )
  assert.deepEqual(textOf(lines), ['sword', 'nested', 'still sword', 'never closed'])
  assert.deepEqual(lines[0].weaponTypes, ['Sword'])
  assert.deepEqual(lines.at(-1).weaponTypes, ['Glaive'])
})

test('old syntax gives the same names, other is what the chain left', () => {
  const lines = convert(oldSyntax)

  assert.deepEqual(lines[0].weaponTypes, ['Hand Cannon', 'Combat Bow'])
  assert.deepEqual(lines[1].weaponTypes, ['Pulse Rifle'])
  assert.equal(lines[2].weaponOther, true)
  assert.deepEqual(
    lines[2].weaponTypes,
    allWeaponTypeNames.filter((name) => !['Hand Cannon', 'Combat Bow', 'Pulse Rifle'].includes(name))
  )
})

test('settings that keep weapon type lines tag them, with old names or the names', () => {
  const legacy = descriptionFilter(convert(oldSyntax), 'clarity')
  assert.deepEqual(legacy[0].weaponTypes, ['HC', 'Bow'])
  // same key order as before the markers existed
  assert.deepEqual(Object.keys(legacy[0]), ['weaponTypes', 'linesContent'])
  // other keeps the order of the old list
  assert.deepEqual(legacy[2].weaponTypes, weaponTypes.filter((name) => !['HC', 'Bow', 'Pulse'].includes(name)))
  assert.ok(legacy.every((line) => !('weaponBlock' in line) && !('weaponOther' in line)))

  const canonical = descriptionFilter(convert(sections), 'clarityV2')
  assert.deepEqual(canonical[1].weaponTypes, ['Hand Cannon', 'Pulse Rifle'])
  assert.ok(canonical.every((line) => !('weaponBlock' in line) && !('weaponOther' in line)))
  // new syntax in an output with old names
  assert.deepEqual(descriptionFilter(convert(sections), 'clarity')[1].weaponTypes, ['HC', 'Pulse'])
})

test('weaponTypes is not output with the perk', () => {
  for (const name of Object.keys(converterSettings)) {
    const result = getDataFromPerk(perk(100, 'text', { weaponTypes: ['Sword'] }), getSettings(name).getFromPerk)
    assert.equal('weaponTypes' in result, false, name)
  }
})

test('other settings without weapon type context remove the lines', () => {
  assert.deepEqual(textOf(descriptionFilter(convert(sections), 'dim')), ['shared first', 'shared last'])
})

test('one weapon type keeps the shared lines and its sections, untagged', () => {
  const lines = descriptionFilter(convert(sections), 'dim', context(['Sword']))
  assert.deepEqual(textOf(lines), ['shared first', 'swords', 'shared last'])
  assert.ok(lines.every((line) => !('weaponTypes' in line) && !('weaponBlock' in line) && !('weaponOther' in line)))

  // the type is in the complement of the blocks
  assert.deepEqual(textOf(descriptionFilter(convert(sections), 'dim', context(['Glaive']))), [
    'shared first',
    'everything else',
    'shared last'
  ])
})

test('several or unknown weapon types keep every section with labels', () => {
  const labels = {
    'Hand Cannon': { en: 'Hand Cannon', de: 'Handkanone' },
    'Pulse Rifle': { en: 'Pulse Rifle' },
    Sword: { en: 'Sword' }
  }

  assert.deepEqual(textOf(descriptionFilter(convert(sections), 'dim', context(['Hand Cannon', 'Sword'], labels))), [
    'shared first',
    'Hand Cannon: hand cannons and pulses',
    'Sword: swords',
    // other names what is left among the types of the perk
    'Other: everything else',
    'shared last'
  ])
  // localized label, English when the language has none, comma separated for blocks with several names
  assert.deepEqual(
    textOf(descriptionFilter(convert(sections), 'dim', context(['Hand Cannon', 'Pulse Rifle', 'Sword'], labels, 'de'))).slice(1, 3),
    ['Handkanone, Pulse Rifle: hand cannons and pulses', 'Sword: swords']
  )
  // unknown weapon types: every block is labelled, without labels table the names are used
  const unknown = textOf(descriptionFilter(convert(sections), 'dim', context(undefined, undefined)))
  assert.equal(unknown[1], 'Hand Cannon, Pulse Rifle: hand cannons and pulses')
  assert.equal(unknown[2], 'Sword: swords')
  assert.equal(unknown[3], 'Other: everything else')
  assert.deepEqual(textOf(descriptionFilter(convert(sections), 'dim', context([], labels))), textOf(descriptionFilter(convert(sections), 'dim', context(undefined, undefined))))
})

test('an other block names the types of the perk that were left', () => {
  const lines = descriptionFilter(convert(sections), 'dim', context(['Sword', 'Glaive', 'Shotgun'], {}))
  assert.equal(textOf(lines)[3], 'Glaive, Shotgun: everything else')
})

test('a table or empty first line gets the label on its own line', () => {
  const lines = convert(['<weapons Sword>', '< table >', '|b a|b b', '<$>', '</weapons>'].join('\n'))
  const result = specializeWeaponTypes(lines, context(['Sword', 'Glaive'], {}))

  assert.deepEqual(textOf(result.slice(0, 1)), ['Sword:'])
  assert.ok(result[1].table)
})

test('weapon type lines in titles are specialised too', () => {
  const title = [{ weaponTypes: ['Sword'], weaponBlock: 0, linesContent: [{ text: 'sword title' }] }, { linesContent: [{ text: 'always' }] }]
  const lines = [{ linesContent: [{ text: 'hover', title }] }]

  const single = specializeWeaponTypes(lines, context(['Glaive']))
  assert.deepEqual(textOf(single[0].linesContent[0].title), ['always'])
  const several = specializeWeaponTypes(lines, context(['Sword', 'Glaive']))
  assert.deepEqual(textOf(several[0].linesContent[0].title), ['Sword: sword title', 'always'])
})

test('lines without weapon type sections are returned as they are', () => {
  const lines = convert('one\ntwo\n\nthree')
  for (const name of Object.keys(converterSettings)) {
    const filtered = JSON.stringify(descriptionFilter(JSON.parse(JSON.stringify(lines)), name, context(['Sword', 'Glaive'], {})))
    assert.equal(filtered, JSON.stringify(descriptionFilter(JSON.parse(JSON.stringify(lines)), name)), name)
  }
})

test('an alias uses its own weapon types, a sandbox alias the ones of the original', () => {
  const expanded = expandAliases({
    100: perk(100, 'text', { weaponTypes: ['Sword'] }),
    200: { hash: 200, aliasOf: 100, aliasKind: 'sandbox' },
    300: { hash: 300, aliasOf: 100, aliasKind: 'frame', name: 'Frame', type: 'Weapon Frame', weaponTypes: ['Glaive', 'Shotgun'] },
    400: { hash: 400, aliasOf: 100, aliasKind: 'frame', name: 'Frame', type: 'Weapon Frame' }
  })

  assert.deepEqual(expanded[200].weaponTypes, ['Sword'])
  assert.deepEqual(expanded[300].weaponTypes, ['Glaive', 'Shotgun'])
  assert.equal('weaponTypes' in expanded[400], false)
})

test('clarity specialises with context while clarityV2 retains canonical tags', () => {
  const lines = descriptionFilter(convert(sections), 'clarity', context(['Sword']))
  assert.ok(lines.every((line) => !('weaponTypes' in line)))
  assert.ok(JSON.stringify(lines).includes('sword'))
  assert.ok(!JSON.stringify(lines).includes('hand cannons'))
  assert.ok(descriptionFilter(convert(sections), 'clarityV2', context(['Sword'])).some((line) => line.weaponTypes))
})
