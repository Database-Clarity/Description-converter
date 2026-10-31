import { classNameList } from '../data.js'
import { DescriptionLine, TableClassNames } from '../types.js'
import { getLineClasses } from './extractClassesFromLine.js'
import { convertLinesContent } from './lineConverter.js'
import { splitTable } from './splitTable.js'

/** Convert legacy weapon delimiters into ordinary headings before parsing tables and text. */
export const separateTableWeaponType = (
  description: string,
  titles: { [key: string]: DescriptionLine[] }
): DescriptionLine[] | undefined => {
  const ordinary = description
    .replace(/^[ \t]*<weapons\s+([^>]+)>[ \t]*$/gim, '$1:')
    .replace(/^[ \t]*<\/weapons\s*>[ \t]*$/gim, '')
    .replace(/^[ \t]*< (?:weapon type )?\(\s*([^)]*?)\s*\) >[ \t]*$/gm, '$1:')
    .replace(/^[ \t]*<\$\$>[ \t]*$/gm, '')
  return separateBlocks(ordinary, titles)
}

const separateBlocks = (description: string, titles: { [key: string]: DescriptionLine[] }) => {
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
