// Complete index.ts for Live-Clarity-Database `converter`, updated for alias stubs.
// Based on origin/converter:index.ts (0bd5dae). In the publisher repository import from '@icemourne/description-converter'
// instead of '../index.js'; everything else is a drop-in replacement. Tested by test/publisher.test.mjs
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

import {
  DescriptionData,
  Database,
  IntermediatePerks,
  Languages,
  LiveAlias,
  LivePerk,
  converterSettings,
  descriptionConverter,
  descriptionFilter,
  expandAliases,
  getAliasOutput,
  getDataFromPerk,
  getSettings,
  isAliasStub
} from '../index.js'
import { cleanObject, customJsonStringify, persistentFetch } from '@icemourne/tool-box'
import _ from 'lodash'

type InventoryItem = { [hash: string]: { displayProperties?: { description?: string } } } | undefined

export const databaseConverter = (
  converterType: string,
  database: IntermediatePerks,
  inventoryItem: InventoryItem,
  databaseSettings?: Database['databaseSettings']
) => {
  const settings = getSettings(converterType)
  // alias stubs become full copies of their original, used for every lookup and for the checks below
  const lookup = expandAliases(database)
  const references: { [hash: string]: LiveAlias } = {}

  const newDatabase = _.transform(database, (acc: { [key: string]: LivePerk }, rawPerk, hash) => {
    const aliasOutput = isAliasStub(rawPerk) ? getAliasOutput(settings, rawPerk) : 'copy'
    const perk = lookup[hash]
    // 'skip' is a sandbox alias of a legacy setting, no perk means the alias points at a missing perk
    if (aliasOutput === 'skip' || perk === undefined) return

    // first 50 are reserved for internal use only
    if (Number(hash) < 50) return

    const editorDescription = perk.editor.en?.main.trim() || ''
    // remove perks with out description
    if (editorDescription === '') return
    // remove perks with bungie description
    if (!settings.optional && editorDescription === inventoryItem?.[hash]?.displayProperties?.description) return

    // kept for after the loop, the original may not be output
    if (isAliasStub(rawPerk) && aliasOutput === 'reference') {
      references[hash] = { hash: rawPerk.hash, aliasOf: rawPerk.aliasOf }
      return
    }

    const cleanPerk = getDataFromPerk(perk, settings.getFromPerk)

    const descriptions = Object.entries(cleanPerk.editor).reduce<{ [key: string]: any }>(
      (acc, [language, descriptions]) => {
        const descriptionData: DescriptionData = {
          database: lookup,
          descriptionString: descriptions[settings.editor],
          editorType: settings.editor,
          hash: cleanPerk.hash as number,
          language: language as Languages
        }
        const convertedDescription = descriptionConverter(descriptionData)
        if (convertedDescription) {
          // weapon type blocks are specialised for the weapon types of this perk (the alias's own for aliases)
          acc[language] = descriptionFilter(convertedDescription, converterType, {
            weaponTypes: perk.weaponTypes,
            labels: databaseSettings?.weaponTypeLabels,
            language: language as Languages
          })
        }
        return acc
      },
      {}
    )

    acc[hash] = {
      ...(_.omit(cleanPerk, 'editor') as any),
      descriptions
    }
  })

  // a reference is only useful if the original is part of the same output, otherwise nothing can be looked up
  for (const [hash, reference] of Object.entries(references)) {
    if (newDatabase[reference.aliasOf] !== undefined) newDatabase[hash] = reference as any
  }

  return cleanObject(newDatabase)
}

// only publish when started as the program, so databaseConverter can be imported by tests
if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { database, databaseSettings, inventoryItem } = await import('./externalData.js')

  if (!existsSync('./database')) {
    mkdirSync('./database')
  }
  if (!existsSync('./database/descriptions')) {
    mkdirSync('./database/descriptions')
  }

  for (const key in converterSettings) {
    writeFileSync(
      `./database/descriptions/${key}.json`,
      customJsonStringify(databaseConverter(key, database, inventoryItem, databaseSettings), [
        'stat',
        'multiplier',
        'weaponTypes',
        'classNames'
      ])
    )
  }

  type Versions = {
    descriptions: number
  }

  const version = await persistentFetch<Versions>(
    'https://raw.githubusercontent.com/Database-Clarity/Live-Clarity-Database/live/versions.json',
    3
  )
  const newVersion = {
    ...version,
    descriptions: Number((version.descriptions * 10000 + 1).toFixed(4)) / 10000
  }
  writeFileSync('./database/versions.json', JSON.stringify(newVersion, null, 1))

  console.log('Completed')
}
