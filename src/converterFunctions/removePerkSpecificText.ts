import { PerkTypes } from "../interfaces"

// begging is enhanced (
// ending is )
const removeBeginningAndEnding = (description: string) => {
   const arr = description.split('\n')
   arr.shift()
   arr.pop()
   return arr.join('\n')
}

export const removePerkSpecificText = (description: string, perkType: PerkTypes) => {
   const enhancedExports = description.match(/^enhanced \([\s\S]*?\n\)$/gm)

   if (enhancedExports && perkType !== 'Weapon Perk Enhanced') {
      enhancedExports.forEach((enhancedExport) => {
         description = description.replace(enhancedExport, '')
      })
   } else {
      description = removeBeginningAndEnding(description)
   }

   description = description.replaceAll('#e', '')

   const catalystExports = description.match(/^catalyst \([\s\S]*?\n\)$/gm)

   if (catalystExports && perkType !== 'Weapon Catalyst Exotic') {
      catalystExports.forEach((catalystExport) => {
         description = description.replace(catalystExport, '')
      })
   } else {
      description = removeBeginningAndEnding(description)
   }

   const exoticPerkExports = description.match(/^exotic perk \([\s\S]*?\n\)$/gm)

   if (exoticPerkExports && perkType !== 'Weapon Perk Exotic') {
      exoticPerkExports.forEach((exoticPerkExport) => {
         description = description.replace(exoticPerkExport, '')
      })
   } else {
      description = removeBeginningAndEnding(description)
   }

   return description
}
