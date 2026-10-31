import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

test('publisher companion loads settings from the real externalData implementation', () => {
  const dir = mkdtempSync(join(tmpdir(), 'publisher-data-'))
  try {
    // Use the compiled companion unchanged except for substituting the network manifest fetch.
    const code = readFileSync(new URL('../examples/externalData.js', import.meta.url), 'utf8')
      .replace("import { fetchBungieManifest } from '@icemourne/tool-box';", "const fetchBungieManifest = async () => ({ inventoryItem: { 42: {} } });")
    writeFileSync(join(dir, 'externalData.mjs'), code)
    writeFileSync(join(dir, 'liveDescriptions.json'), JSON.stringify({ perks: { 42: { hash: 42 } }, databaseSettings: { weaponTypeLabels: { Sword: { de: 'Schwert' } } } }))
    const run = spawnSync(process.execPath, ['--input-type=module', '-e', "const m = await import('./externalData.mjs'); console.log(JSON.stringify([m.database, m.databaseSettings, m.inventoryItem]))"], { cwd: dir, encoding: 'utf8' })
    assert.equal(run.status, 0, run.stderr)
    const [perks, settings, manifest] = JSON.parse(run.stdout)
    assert.equal(perks['42'].hash, 42)
    assert.equal(settings.weaponTypeLabels.Sword.de, 'Schwert')
    assert.ok(manifest['42'])
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
