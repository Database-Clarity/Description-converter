import { classNameList } from '../data.js'
import { DescriptionLine, TableClassNames } from '../types.js'
import { allWeaponTypeNames, canonicalWeaponType } from '../weaponTypeNames.js'
import { getLineClasses } from './extractClassesFromLine.js'
import { convertLinesContent } from './lineConverter.js'
import { splitTable } from './splitTable.js'
import { hasWeaponTags, joinLines, scanWeaponSections } from './weaponSections.js'

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

/** Counts weapon blocks so lines can tell which block they belong to */
type BlockCounter = { next: number }

/**
 * Lines that only apply to some weapon types have `weaponTypes` (names from weaponTypeNames.ts), `weaponBlock`
 * (number of the block the line is in) and `weaponOther` (block was `other`). descriptionFilter removes the last two
 * Supports `<weapons A, B> … </weapons>` and the old `< weapon type (A, B) > … <$$>`
 */
export const separateTableWeaponType = (
  description: string,
  titles: { [key: string]: DescriptionLine[] },
  counter: BlockCounter = { next: 0 }
): DescriptionLine[] | undefined => {
  if (!hasWeaponTags(description)) return separateBlocks(description, titles, counter)

  return scanWeaponSections(description).flatMap((segment): DescriptionLine[] => {
    const lines = separateBlocks(joinLines(segment.lines), titles, counter) ?? []
    if (segment.kind === 'text') return lines

    const weaponBlock = counter.next++
    return lines.map(({ weaponTypes, weaponBlock: nestedBlock, weaponOther, ...line }) => ({
      weaponTypes: segment.types,
      weaponBlock,
      ...(segment.other && { weaponOther: true }),
      ...line
    }))
  })
}

const separateBlocks = (
  description: string,
  titles: { [key: string]: DescriptionLine[] },
  counter: BlockCounter
) => {
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

      let notSelectedWeaponTypes: string[] = [...allWeaponTypeNames]
      weaponTypeLines?.forEach((weaponLine) => {
        const weaponLines = weaponLine.split('\n')
        const firstLine = weaponLines.splice(0, 1)

        const currentWeaponTypes = firstLine[0]
          .replace(/< (weapon type )?\(\s*|\s*\) >/g, '')
          .split(',')
          .map((s) => s.trim())
          .flatMap((name) => (name === 'other' ? ['other'] : canonicalWeaponType(name, true) ?? []))

        notSelectedWeaponTypes = notSelectedWeaponTypes.filter((type) => !currentWeaponTypes.includes(type))

        const isOther = currentWeaponTypes.includes('other')
        const weaponBlock = counter.next++
        separateBlocks(weaponLines.join('\n'), titles, counter)?.forEach((line) => {
          acc.push({
            weaponTypes: isOther ? notSelectedWeaponTypes : currentWeaponTypes,
            weaponBlock,
            ...(isOther && { weaponOther: true }),
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
