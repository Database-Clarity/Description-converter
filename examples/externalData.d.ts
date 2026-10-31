// Types of the publisher's externalData.ts (liveDescriptions.json perks and the Bungie manifest inventoryItem table)
import { IntermediatePerks } from '../index.js'

export const database: IntermediatePerks
export const inventoryItem: Record<string, { displayProperties?: { description?: string } }> | undefined
