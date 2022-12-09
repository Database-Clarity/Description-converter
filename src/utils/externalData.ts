import { readFileSync } from 'fs'
import syncFetch from 'sync-fetch'
import { Database } from '../descriptionConverter/interfaces'
import { InventoryItems } from '../descriptionConverter/inventoryItem.interface'

let database_placeholder: Database | null = null
if (database_placeholder === null) {
   database_placeholder = JSON.parse(readFileSync('./intermediateDatabase.json', 'utf8'))
}
export const database = database_placeholder as Database

const justFetch = (link: string, retries: number = 0): any => {
   const resp = syncFetch(link)
   if (resp.status === 200) return resp.json()
   if (retries > 5) return
   return justFetch(link, retries + 1)
}

let inventoryItems_placeHolder: InventoryItems | null = null
if (inventoryItems_placeHolder === null) {
   const manifest = justFetch('https://www.bungie.net/Platform/Destiny2/Manifest/')
   if (manifest === undefined) throw new Error('failed getting manifest')

   const inventoryItemUrl = `https://www.bungie.net${manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition}`
   const inventoryItemsData = justFetch(inventoryItemUrl)

   if (inventoryItemsData === undefined) throw new Error('Failed getting inventory items')
   inventoryItems_placeHolder = inventoryItemsData as InventoryItems
}
export const inventoryItems = inventoryItems_placeHolder