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

test('all weapon sections become headings in every output', () => {
  for (const input of [sections, oldSyntax]) {
    const converted = convert(input)
    for (const name of Object.keys(converterSettings)) {
      const result = descriptionFilter(structuredClone(converted), name)
      const json = JSON.stringify(result)
      for (const body of input === sections ? ['hand cannons and pulses', 'swords', 'everything else'] : ['bows and hand cannons', 'pulses', 'rest']) assert.ok(json.includes(body), `${name}: ${body}`)
      assert.ok(!json.includes('weaponTypes'), name)
      assert.ok(json.includes(input === sections ? 'Sword:' : 'Pulse:'), name)
    }
  }
})
