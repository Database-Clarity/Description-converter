import { allWeaponTypeNames, canonicalWeaponType } from '../weaponTypeNames.js'

const openTag = /^\s*<weapons(?:\s+(.*?))?\s*>\s*$/i
const closeTag = /^\s*<\/weapons\s*>\s*$/i

export type WeaponSegment =
  | { kind: 'text'; lines: string[] }
  | { kind: 'block'; types: string[]; other: boolean; lines: string[] }

/**
 * True when a `<weapons …>` or `</weapons>` tag line is present
 */
export const hasWeaponTags = (text: string) => /^\s*<\/?weapons(\s|>)/im.test(text)

/**
 * Lines as parser input: every line, including the last, ends with a newline
 */
export const joinLines = (lines: readonly string[]) => lines.map((line) => line + '\n').join('')

/**
 * Splits text into plain segments and `<weapons …>` blocks, same as the editor does. Tags stand on their own line.
 * Never throws: unknown names are dropped, a block that is never closed ends with the text, a stray close tag
 * is ignored and a tag inside a block is dropped without starting a new block (the editor reports these as errors)
 * `<weapons other>` is every name that no block of this text lists
 */
export const scanWeaponSections = (text: string): WeaponSegment[] => {
  const segments: WeaponSegment[] = []
  const blocks: { names: string[]; other: boolean; lines: string[] }[] = []
  const named = new Set<string>()
  let current: { names: string[]; other: boolean; lines: string[] } | undefined
  let depth = 0
  let plain: string[] = []

  const flushPlain = () => {
    if (plain.length) segments.push({ kind: 'text', lines: plain })
    plain = []
  }
  const closeBlock = (block: NonNullable<typeof current>) => {
    blocks.push(block)
    segments.push({ kind: 'block', types: [], other: block.other, lines: block.lines })
    block.names.forEach((name) => named.add(name))
  }

  for (const content of text.replace(/\r/g, '').split('\n')) {
    const opening = openTag.exec(content)
    if (opening) {
      if (current) {
        depth++
        continue
      }
      const listed = (opening[1] ?? '')
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
      const other = listed.some((name) => name.toLowerCase() === 'other')
      const names: string[] = []
      for (const name of listed) {
        const canonical = name.toLowerCase() === 'other' ? undefined : canonicalWeaponType(name)
        if (canonical && !names.includes(canonical)) names.push(canonical)
      }
      flushPlain()
      current = { names: other ? [] : names, other, lines: [] }
      continue
    }
    if (closeTag.test(content)) {
      if (depth > 0) depth--
      else if (current) {
        closeBlock(current)
        current = undefined
      }
      continue
    }
    ;(current ? current.lines : plain).push(content)
  }
  if (current) closeBlock(current)
  flushPlain()

  const complement = allWeaponTypeNames.filter((name) => !named.has(name))
  let index = 0
  for (const segment of segments) {
    if (segment.kind !== 'block') continue
    segment.types = blocks[index].other ? complement : blocks[index].names
    index++
  }
  return segments
}
