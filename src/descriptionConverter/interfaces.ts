import { allClassNames, classNameList, languages, statNames, weaponTypes } from './data'

/**
 ** Where is little to no relation to Bungie perk types
 */
export type PerkTypes =
   | 'Armor Perk Exotic'
   | 'Weapon Perk Exotic'
   | 'Weapon Frame Exotic'
   | 'Weapon Catalyst Exotic'
   // ---------
   | 'Weapon Perk'
   | 'Weapon Perk Enhanced'
   | 'Weapon Origin Trait'
   | 'Weapon Frame'
   // ---------
   | 'Subclass Fragment'
   | 'Subclass Aspect'
   | 'Subclass Super'
   | 'Subclass Grenade'
   | 'Subclass Melee'
   | 'Subclass Class'
   | 'Subclass Movement'
   // ---------
   | 'Armor Mod General'
   | 'Armor Mod Combat'
   | 'Armor Mod Activity'
   | 'Armor Mod Seasonal'
   | 'Weapon Mod'
   | 'Ghost Mod'

/**
 ** Where is little to no relation to Bungie stats
 */
export type StatNames = typeof statNames[number]

/**
 ** Where is little to no relation to Bungie weapon types
 */
export type WeaponTypes = typeof weaponTypes[number]

/**
 ** Languages are same us Bungie's
 */
export type Languages = typeof languages[number][0]

export type AllClassNames = typeof allClassNames[number]

export interface Stat {
   weaponTypes?: WeaponTypes[]
   active?: {
      multiplier?: number[]
      stat?: number[]
   }
   passive?: {
      multiplier?: number[]
      stat?: number[]
   }
}
export type Stats = {
   [key in StatNames]?: Stat[]
}

export type Editor = {
   [key in Languages]?: {
      main: string
      secondary: string
   }
}

export interface Perk {
   hash: number
   name: string
   itemHash?: number
   itemName?: string
   uploadedBy: string
   type: PerkTypes
   importStatsFrom?: number
   linking?: {
      weaponPerkExotic?: number
      weaponFrameExotic?: number
      weaponCatalystExotic?: number
      weaponPerkEnhanced?: number
   }
   // linkedWith?: number | undefined
   updateTracker: {
      stats?: {
         lastUpdate: number
         updatedBy: string
      }
      descriptions: {
         [key in Languages]?: {
            lastUpdate: number
            updatedBy: string
         }
      }
   }
   editor: Editor
   stats?: Stats
   lastUpload: number
   inLiveDatabase: boolean
   optional: boolean
   hidden: boolean
   uploadToLive: boolean
}
export type Database = {
   [key in string]: Perk
}

export interface LinesContent {
   /** Text in this part of the line */
   text?: string
   /** Class names of this parts of the line */
   classNames?: (string | undefined)[]
   /** If this line has URL then this line and its text is part of link */
   link?: string
   /** If this line has formula then this line and its text is part of formula */
   formula?: string
   /** If this line has title then this line and its text is part of title */
   title?: DescriptionLine[]
}

export interface CellContent {
   /** Text in this part of the cell \<span> */
   text?: string
   /** this will be moved from hare when converting description */
   classNames?: (string | undefined)[]
   /** If this part of cell \<span> has URL then this part of the cell \<span> and its text is part of link */
   link?: string
   /** If this part of cell \<span> has formula then this part of the cell \<span> and its text is part of formula */
   formula?: string
   /** If this part of cell \<span> has title then this part of the cell \<span> and its text is part of title */
   title?: DescriptionLine[]
   /** this will be moved from hare when converting description */
   colSpan?: number
   /** this will be moved from hare when converting description */
   rowSpan?: number
   /** this will be moved from hare when converting description */
   cellClassNames?: (string | undefined)[]
}

/** Contents of table row \<tr> aka array of cells */
export interface RowContent {
   /** Contents of cell \<td> aka array of spans \<span> */
   cellContent: CellContent[]
   /** Number of cell to span horizontally */
   colSpan?: number
   /** Number of cell to span vertically */
   rowSpan?: number
   /** this will be moved from hare when converting description */ //todo fix explanation
   classNames?: (string | undefined)[]
}

export interface TableLine {
   /** Contents of table row \<tr> aka array of cells */
   rowContent?: RowContent[]
   /** row \<tr> classNames */
   classNames?: (string | undefined)[]
}

export interface DescriptionLine {
   /** Lines \<div> class names */
   classNames?: (string | undefined)[]
   /** Contents of line \<span> */
   linesContent?: LinesContent[]
   /** Is table content only formulas */
   isFormula?: boolean | undefined
   /** Contents of table \<table> */
   table?: TableLine[]
   /** If this exists that means this line only applies to some specific weapon types */
   weaponTypes?: (string | undefined)[]
}
