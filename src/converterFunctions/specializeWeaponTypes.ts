import { Languages } from '../livePerkTypes.js'
import { CellContent, DescriptionLine, LinesContent, WeaponTypeLabels } from '../types.js'
import { toLegacyWeaponTypes } from '../weaponTypeNames.js'

export type WeaponTypeContext = {
  /**
   ** Weapon types of the perk (IntermediatePerk.weaponTypes of the expanded perk, so an alias uses its own)
   ** Undefined or empty if they are not known
   */
  weaponTypes: readonly string[] | undefined

  /**
   ** databaseSettings.weaponTypeLabels
   */
  labels: WeaponTypeLabels | undefined

  language: Languages
}

type Apply = (lines: DescriptionLine[]) => DescriptionLine[]

const hasWeaponLines = (lines: DescriptionLine[] | undefined): boolean =>
  lines?.some(
    (line) =>
      line.weaponTypes !== undefined ||
      line.linesContent?.some((content) => hasWeaponLines(content.title)) ||
      line.table?.some((row) => row.rowContent?.some((cell) => cell.cellContent.some((content) => hasWeaponLines(content.title))))
  ) ?? false

const mapContent = <T extends LinesContent | CellContent>(contents: T[], apply: Apply): T[] =>
  contents.map((content) => (content.title ? { ...content, title: apply(content.title) } : content))

/** Applies `apply` to the lines of every title nested in the line */
const mapNested = (line: DescriptionLine, apply: Apply): DescriptionLine => {
  const result = { ...line }
  if (line.linesContent) result.linesContent = mapContent(line.linesContent, apply)
  if (line.table) {
    result.table = line.table.map((row) => ({
      ...row,
      ...(row.rowContent && {
        rowContent: row.rowContent.map((cell) => ({ ...cell, cellContent: mapContent(cell.cellContent, apply) }))
      })
    }))
  }
  return result
}

const strip = ({ weaponTypes, weaponBlock, weaponOther, ...line }: DescriptionLine): DescriptionLine => line

/**
 * Keeps lines that only apply to some weapon types, with the weapon types they apply to
 * Removes what is only needed to find the blocks (weaponBlock, weaponOther)
 * `names` 'legacy' converts the names to the old ones (HC, Heavy GL, …)
 */
export const tagWeaponTypes = (lines: DescriptionLine[], names: 'legacy' | 'canonical'): DescriptionLine[] => {
  if (!hasWeaponLines(lines)) return lines

  const tag: Apply = (input) =>
    input.map((line) => {
      const { weaponTypes, weaponBlock, weaponOther, ...rest } = line
      const tagged = weaponTypes
        ? { weaponTypes: names === 'legacy' ? toLegacyWeaponTypes(weaponTypes as string[], weaponOther === true) : weaponTypes, ...rest }
        : rest
      return mapNested(tagged, tag)
    })
  return tag(lines)
}

const labelOf = (name: string, language: Languages, labels: WeaponTypeLabels | undefined) =>
  labels?.[name]?.[language] ?? labels?.[name]?.en ?? (name === 'other' ? 'Other' : name)

/**
 * Label of the block, the names of the types it applies to. With `among` only the ones the perk is on, so a block
 * that was `other` names the types that were left for it
 */
const blockLabel = (line: DescriptionLine, context: WeaponTypeContext, among: readonly string[] | undefined) => {
  const types = (line.weaponTypes ?? []) as string[]
  const relevant = among ? types.filter((type) => among.includes(type)) : types
  if (line.weaponOther && (!relevant.length || !among)) return labelOf('other', context.language, context.labels)

  const shown = relevant.length ? relevant : types
  return shown.length ? shown.map((type) => labelOf(type, context.language, context.labels)).join(', ') : undefined
}

/**
 * Turns lines that only apply to some weapon types into plain lines for a perk
 * One weapon type: lines for other weapon types are dropped
 * Several or unknown: all lines are kept and the first line of each block gets the label of the block ("Hand Cannon: ")
 * Lines that apply to every weapon type are always kept
 */
export const specializeWeaponTypes = (lines: DescriptionLine[], context: WeaponTypeContext): DescriptionLine[] => {
  if (!hasWeaponLines(lines)) return lines

  const types = context.weaponTypes ?? []
  if (types.length === 1) {
    const keep: Apply = (input) =>
      input
        .filter((line) => !line.weaponTypes || line.weaponTypes.includes(types[0]))
        .map((line) => mapNested(strip(line), keep))
    return keep(lines)
  }

  const among = types.length ? types : undefined
  const label: Apply = (input) => {
    const output: DescriptionLine[] = []
    let previousBlock: number | undefined
    for (const line of input) {
      const stripped = mapNested(strip(line), label)
      const first = line.weaponBlock !== undefined && line.weaponBlock !== previousBlock
      previousBlock = line.weaponBlock
      const text = first ? blockLabel(line, context, among) : undefined

      if (text === undefined) output.push(stripped)
      else if (stripped.linesContent && !stripped.table) {
        output.push({ ...stripped, linesContent: [{ text: `${text}: ` }, ...stripped.linesContent] })
      } else output.push({ linesContent: [{ text: `${text}:` }] }, stripped)
    }
    return output
  }
  return label(lines)
}
