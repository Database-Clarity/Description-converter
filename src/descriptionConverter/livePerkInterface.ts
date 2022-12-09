// If you see "Optional" then it is optional and probably not included by default
// If something is not clear just ask if you think you can improve explanation make PR

/**
 ** Perk types are not same as Bungie's
 */
type PerkTypes =
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
 ** Stats names are not same as Bungie's
 */
type StatNames =
   | 'Range'
   | 'Reload'
   | 'Handling'
   | 'Stability'
   | 'Zoom'
   | 'Aim Assist'
   | 'Charge Draw'
   | 'RPM'
   | 'Ready'
   | 'Stow'
   | 'Damage'
   | 'Airborne'

/**
 ** Weapon types are not same as Bungie's
 */
type WeaponTypes =
   | 'AR'
   | 'Bow'
   | 'Fusion'
   | 'Glaive'
   | 'GL'
   | 'HC'
   | 'Heavy GL'
   | 'LFR'
   | 'LMG'
   | 'Pulse'
   | 'Rocket'
   | 'Scout'
   | 'Shotgun'
   | 'Sidearm'
   | 'Sniper'
   | 'SMG'
   | 'Sword'
   | 'Trace'
   // ---------
   | 'Super'
   | 'Grenade'
   | 'Melee'

/**
 ** Languages are same as Bungie's
 */
type Languages =
   /** English - English */
   | 'en'
   /** German - Deutsch */
   | 'de'
   /** French - Français */
   | 'fr'
   /** Italian - Italiano */
   | 'it'
   /** Polish - Polski */
   | 'pl'
   /** Russian - Русский */
   | 'ru'
   /** Spanish (Spain) - Español (España) */
   | 'es'
   /** Spanish (Mexico) - Español (México) */
   | 'es-mx'
   /** Korean - 한국어 */
   | 'ko'
   /** Portuguese (Brazil) - Português (Brasil) */
   | 'pt-rb'
   /** Japanese - 日本語 */
   | 'ja'
   /** Chinese (Traditional) - 繁體中文 */
   | 'zh-cht'
   /** Chinese (Simplified) - 简体中文 */
   | 'zh-chs'

interface Stat {
   /**
    ** Types of weapons these stat applies to
    ** This is not bungie weapon types
    ** Optional
    */
   weaponTypes?: WeaponTypes[]

   /**
    ** Stats active with some condition like kill
    */
   active?: {
      /**
       ** Array index is key for formulas in perk descriptions
       ** Calculated stat * multiplier
       */
      multiplier?: number[]

      /**
       ** Array index is key for formulas in perk descriptions
       ** Bungie stat + stat
       */
      stat?: number[]
   }

   /**
    ** Stats active all the time this dose not include investment stats from bungie
    */
   passive?: {
      /**
       ** Array index is key for formulas in perk descriptions
       ** Calculated stat * multiplier
       */
      multiplier?: number[]

      /**
       ** Array index is key for formulas in perk descriptions
       ** Bungie stat + stat
       */
      stat?: number[]
   }
}

type Stats = {
   /**
    ** Stats names are not same as Bungie's
    */
   [key in StatNames]?: Stat[]
}

interface LinesContent {
   /**
    ** Text in this part of the line
    */
   text?: string

   /**
    ** Class names for this parts of the line
    */
   classNames?: string[]

   /**
    ** If this line has link then this line and its text is part of link
    */
   link?: string

   /**
    ** If this line has formula then this line and its text is part of formula
    */
   formula?: string

   /**
    ** If this line has title then this line and its text is part of title
    */
   title?: DescriptionLine[]
}

interface CellContent {
   /**
    ** Text in this part of the cell (\<span>)
    */
   text?: string

   /**
    ** This will be moved from hare when converting description // todo will i remove this?
    */
   classNames?: string[]

   /**
    ** If this part of cell (\<span>) has link then this part of the cell (\<span>) and its text is part of link
    */
   link?: string

   /**
    * If this part of cell (\<span>) has formula then this part of the cell (\<span>) and its text is part of formula
    */
   formula?: string

   /**
    ** If this part of cell (\<span>) has title then this part of the cell (\<span>) and its text is part of title
    */
   title?: DescriptionLine[]

   /**
    ** this will be moved from hare when converting description // todo will i remove this?
    */
   colSpan?: number

   /**
    * this will be moved from hare when converting description // todo will i remove this?
    */
   rowSpan?: number

   /**
    ** this will be moved from hare when converting description // todo will i remove this?
    */
   cellClassNames?: string[]
}

/**
 ** Contents of table row (\<tr>) aka array of cells
 */
interface RowContent {
   /**
    ** Contents of cell (\<td>) aka array of spans (\<span>)
    */
   cellContent: CellContent[]

   /**
    ** Number of cell to span horizontally
    */
   colSpan?: number

   /**
    ** Number of cell to span vertically
    */
   rowSpan?: number
}

interface TableLine {
   /**
    ** Contents of table row (\<tr>)
    */
   rowContent?: RowContent[]

   /**
    ** row (\<tr>) classNames
    */
   classNames?: string[]
}

interface DescriptionLine {
   /**
    ** Lines (\<div>) class names
    */
   classNames?: string[]

   /**
    ** Contents of line (\<span>)
    */
   linesContent?: LinesContent[]

   /**
    ** Is table content only formulas
    */
   isFormula?: boolean

   /**
    * Contents of table (\<table>)
    */
   table?: TableLine[]

   /**
    ** If this exists that means this line only applies to some specific weapon types
    */
   weaponTypes?: (string | undefined)[]
}

export interface LivePerk {
   /**
    ** Perk, Mod, ect. hash
    ** Inventory item hash
    */
   hash: number

   /**
    ** Perk, Mod, ect. name
    ** Inventory item display properties name
    */
   name: string

   /**
    ** Hash of item perk belongs to
    ** Inventory item hash
    */
   itemHash?: number

   /**
    ** Name of item perk belongs to // exotic weapon or armor
    ** Inventory item display properties name
    */
   itemName?: string

   /**
    ** Nickname of person who uploaded this perk
    ** Optional
    */
   uploadedBy: string

   /**
    ** Type of the perk
    ** Optional
    */
   type: PerkTypes

   /**
    ** Date in ms then it was changed
    ** Optional
    */
   updateTracker: {
      /**
       ** Date in ms then stats changed
       ** Optional
       ** Stats have to be enabled for this to show up
       ** Shows up on all perks regardless if they have stats or don't
       */
      stats: {
         /**
          ** Date in ms then stats changed
          */
         lastUpdate: number

         /**
          ** Name of person who updated stats
          */
         updatedBy: string
      }
      descriptions: {
         /**
          ** Languages are same as bungie's
          */
         [key in Languages]?: {
            /**
             ** Date in ms then description changed
             */
            lastUpdate: number

            /**
             ** Name of person who updated description
             */
            updatedBy: string
         }
      }
   }
   descriptions: {
      /**
       ** Descriptions can be converted to custom string // code for that is already made
       ** Or it can be converted to something custom
       ** Languages are same as bungie's
       */
      [key in Languages]?: DescriptionLine | String
   }

   /**
    ** This dose not include investment stats from bungie
    ** Optional
    */
   stats?: Stats
}
