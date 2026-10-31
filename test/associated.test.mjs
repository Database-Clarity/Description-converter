import assert from 'node:assert/strict'
import { test } from 'node:test'

import { converterSettings, getDataFromPerk } from '../index.js'

const perk = {
  hash: 1,
  name: 'Perk',
  uploadedBy: 'tester',
  type: 'Weapon Perk',
  updateTracker: { descriptions: {} },
  editor: { en: { main: 'main', secondary: 'secondary' } },
  lastUpload: 1,
  inLiveDatabase: true,
  uploadToLive: true
}

const filters = (associated) => ({ ...converterSettings.clarityV2.getFromPerk, associated })

test('flag false: associated is not published', () => {
  const result = getDataFromPerk({ ...perk, associated: [2, 1] }, filters(false))
  assert.equal('associated' in result, false)
})

test('flag true: associated is passed through in authored order', () => {
  const result = getDataFromPerk({ ...perk, associated: [2, 1] }, filters(true))
  assert.deepEqual(result.associated, [2, 1])
})

test('flag true: perk without associated gets no key', () => {
  const result = getDataFromPerk(perk, filters(true))
  assert.equal('associated' in result, false)
})

test('only clarityV2 enables associated', () => {
  for (const [name, settings] of Object.entries(converterSettings)) {
    assert.equal(settings.getFromPerk.associated, name === 'clarityV2', name)
  }
  assert.equal(converterSettings.clarityV2.getFromPerk.stats, false)
})
