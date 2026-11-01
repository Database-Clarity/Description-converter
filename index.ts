export { converterSettings, getSettings } from './src/converterSettings.js'
export { languageKeys, languages, statNames, weaponTypes } from './src/data.js'
export type { Languages, LiveAlias, LivePerk, StatNames, WeaponTypes } from './src/livePerkTypes.js'
export type {
  CellContent,
  AliasStub,
  Database,
  ExpandedPerks,
  DescriptionData,
  DescriptionLine,
  Editor,
  FolderTypes,
  IntermediatePerk,
  IntermediatePerks,
  LinesContent,
  PerkTypes,
  RowContent,
  Stat,
  Stats,
  TableLine,
  WeaponTypeLabels
} from './src/types.js'

export { expandAliases, getAliasOutput, isAliasStub } from './src/converterFunctions/expandAliases.js'
export { validateOutputReferences, validateReferences } from './src/converterFunctions/validateReferences.js'
export { extractTitles } from './src/converterFunctions/extractTitles.js'
export { getDataFromPerk } from './src/converterFunctions/getDataFromPerk.js'
export { getVariables } from './src/converterFunctions/loadVariables.js'
export {
  allWeaponTypeNames,
  canonicalWeaponType,
  legacyWeaponTypeNames,
  weaponTypeExtraTags,
  weaponTypeNames
} from './src/weaponTypeNames.js'
export { descriptionConverter } from './src/descriptionConverter.js'
export { descriptionFilter } from './src/descriptionFilter.js'
