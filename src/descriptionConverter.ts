import { DescriptionData, DescriptionLine } from './types'

import { doMath } from './converterFunctions/doMath'
import { extractTitles } from './converterFunctions/extractTitles'
import { loadExports } from './converterFunctions/loadExports'
import { loadVariables } from './converterFunctions/loadVariables'
import { removePerkSpecificText } from './converterFunctions/removePerkSpecificText'
import { removeUnusedText } from './converterFunctions/removeUnusedText'
import { separateTableWeaponType } from './converterFunctions/separateTableWeaponType'

const prepareDescription = (descriptionData: DescriptionData) => {
   const { language, hash, database } = descriptionData
   let description = loadExports(descriptionData)

   // removes enhanced/exotic perks and catalysts if perk is not enhanced/exotic perk or catalyst
   description = removePerkSpecificText(description, database[hash].type)

   description = loadVariables({ ...descriptionData, descriptionString: description })
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

export const descriptionConverter = (descriptionData: DescriptionData) => {
   const { preparedDescription, titles } = prepareDescription(descriptionData)

   const convertedTitles = Object.entries(titles || {}).reduce<{ [key: string]: DescriptionLine[] }>(
      (acc, [titleName, titleContent]) => {
         const { preparedDescription } = prepareDescription({ ...descriptionData, descriptionString: titleContent })

         const convertedTitles = separateTableWeaponType(preparedDescription, {})
         if (convertedTitles) acc[titleName] = convertedTitles
         return acc
      },
      {}
   )

   return separateTableWeaponType(preparedDescription, convertedTitles)
}
