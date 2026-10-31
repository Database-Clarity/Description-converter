// Companion to publisher.ts, based on origin/converter:externalData.ts.
// In the publisher, change '../index.js' to '@icemourne/description-converter'.
import { readFileSync } from 'fs'

import { Database } from '../index.js'
import { fetchBungieManifest } from '@icemourne/tool-box'

const data: { perks: Database['perks']; databaseSettings?: Database['databaseSettings'] } = JSON.parse(readFileSync('./liveDescriptions.json', 'utf8'))
export const database = data.perks
export const databaseSettings = data.databaseSettings
const { inventoryItem } = await fetchBungieManifest(['inventoryItem'])
export { inventoryItem }
