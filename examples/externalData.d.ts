// Types of the publisher's externalData.ts (liveDescriptions.json perks and the Bungie manifest inventoryItem table)
import { Database, IntermediatePerks } from '../index.js'

export const database: IntermediatePerks
export const databaseSettings: Database['databaseSettings'] | undefined
export const inventoryItem: Record<string, { displayProperties?: { description?: string } }> | undefined
