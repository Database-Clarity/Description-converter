import { doMath } from './converterFunctions/doMath'
import { database } from '../externalData'
import { extractTitles } from './converterFunctions/extractTitles'
import { loadExports } from './converterFunctions/loadExports'
import { loadVariables } from './converterFunctions/loadVariables'
import { removePerkSpecificText } from './converterFunctions/removePerkSpecificText'
import { removeUnusedText } from './converterFunctions/removeUnusedText'
import { separateTableWeaponType } from './converterFunctions/separateTableWeaponType'
import { DescriptionLine, Languages } from './interfaces'

const prepareDescription = (
   description: string,
   editorType: 'main' | 'secondary',
   language: Languages,
   hash: number
) => {
   description = loadExports(description, editorType, language, hash)

   // removes enhanced/exotic perks and catalysts if perk is not enhanced/exotic perk or catalyst
   description = removePerkSpecificText(description, database[hash].type)

   description = loadVariables(description, language)
   description = doMath(description)

   return {
      preparedDescription: removeUnusedText(description.trim()),
      titles: {
         ...extractTitles(removeUnusedText(description, false)),
         ...extractTitles(database[3].editor[language]?.main!),
         ...extractTitles(database[3].editor[language]?.secondary!)
      }
   }
}

export const descriptionConverter = (
   description: string,
   editorType: 'main' | 'secondary',
   language: Languages,
   hash: number
) => {
   const { preparedDescription, titles } = prepareDescription(description, editorType, language, hash)

   const convertedTitles = Object.entries(titles || {}).reduce<{ [key: string]: DescriptionLine[] }>(
      (acc, [titleName, titleContent]) => {
         const { preparedDescription } = prepareDescription(titleContent, editorType, language, hash)

         const convertedTitles = separateTableWeaponType(preparedDescription, {})
         if (convertedTitles) acc[titleName] = convertedTitles
         return acc
      },
      {}
   )

   return separateTableWeaponType(preparedDescription, convertedTitles)
}
