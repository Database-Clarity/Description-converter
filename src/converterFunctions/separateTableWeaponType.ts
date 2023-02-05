import { classNameList, weaponTypes } from '../data.js'
import { DescriptionLine, TableClassNames } from '../types.js'
import { getLineClasses } from './extractClassesFromLine.js'
import { convertLinesContent } from './lineConverter.js'
import { splitTable } from './splitTable.js'

/*
   (
      < table [^]+?\n<\$>\n?
      |
      < weapon type [^]+?\n<\$\$>\n?
   )
   |
   (
      .+\n?
      |
      \n
   )
*/

export const separateTableWeaponType = (description: string, titles: { [key: string]: DescriptionLine[] }) => {
   const splittedDescription = description
      .match(/(< table [^]+?\n<\$>\n?|< weapon type [^]+?\n<\$\$>\n?)|(.+\n?|\n)/g)
      ?.map((l) => l.trimEnd())

   if (!splittedDescription) return

   return splittedDescription.reduce<DescriptionLine[]>((acc, description) => {
      if (description.startsWith('< table ')) {
         const tableLines = description.split('\n')
         if (tableLines.length < 3) return acc

         // remove first and last lines this mutates original array
         tableLines.splice(-1)
         const firstLine = tableLines.splice(0, 1)

         const tableClasses = classNameList.table

         const tableClassNames = firstLine[0]
            .replace(/< table | >/g, '')
            .match(/(\w+)/g)
            ?.filter((string) => tableClasses.includes(string as TableClassNames))

         acc.push({
            table: tableLines.flatMap((line) => splitTable(line, titles)),
            classNames: [...(tableClassNames || []), 'table'],
            isFormula: tableClassNames?.includes('formula')
         })
         return acc
      }
      if (description.startsWith('< weapon type ')) {
         const weaponTypeLines = description.match(/(< (weapon type )?\([^]+?\) >\n[^]*?)(?=(< \(|<\$\$>))/g)

         let notSelectedWeaponTypes: string[] = [...weaponTypes]
         weaponTypeLines?.forEach((weaponLine) => {
            const weaponLines = weaponLine.split('\n')
            const firstLine = weaponLines.splice(0, 1)

            const currentWeaponTypes = firstLine[0]
               .replace(/< (weapon type )?\(| \) >/g, '')
               .split(',')
               .map((s) => s.trim())
               ?.filter((string) => [...weaponTypes, 'other'].includes(string))

            notSelectedWeaponTypes = notSelectedWeaponTypes.filter((type) => !currentWeaponTypes.includes(type))

            separateTableWeaponType(weaponLines.join('\n'), titles)?.forEach((line) => {
               acc.push({
                  weaponTypes: currentWeaponTypes.includes('other') ? notSelectedWeaponTypes : currentWeaponTypes,
                  ...line
               })
            })
         })
         return acc
      }
      if (description.trim() === '') {
         acc.push({
            classNames: ['spacer']
         })
         return acc
      }

      const { classNames, cleanLine } = getLineClasses(description, classNameList.line)

      const breakSpaces = description.includes('<breakSpaces/>')
      acc.push({
         classNames,
         linesContent: convertLinesContent(breakSpaces ? cleanLine.trimEnd() : cleanLine.trim(), titles)
      })

      return acc
   }, [])
}
