/**
 ** Perk types are not the same as Bungie's
 */
type PerkTypes = 'Armor Perk Exotic' | 'Weapon Perk Exotic' | 'Weapon Frame Exotic' | 'Weapon Catalyst Exotic' | 'Weapon Perk' | 'Weapon Perk Enhanced' | 'Weapon Origin Trait' | 'Weapon Frame' | 'Subclass Fragment' | 'Subclass Aspect' | 'Subclass Super' | 'Subclass Grenade' | 'Subclass Melee' | 'Subclass Class' | 'Subclass Movement' | 'Armor Mod General' | 'Armor Mod Combat' | 'Armor Mod Activity' | 'Armor Mod Seasonal' | 'Weapon Mod' | 'Ghost Mod';
/**
 ** Stats names are not the same as Bungie's
 */
type StatNames = 'Range' | 'Reload' | 'Handling' | 'Stability' | 'Zoom' | 'Aim Assist' | 'Charge Draw' | 'RPM' | 'Ready' | 'Stow' | 'Damage' | 'Airborne';
/**
 ** Weapon types are not the same as Bungie's
 */
type WeaponTypes = 'AR' | 'Bow' | 'Fusion' | 'Glaive' | 'GL' | 'HC' | 'Heavy GL' | 'LFR' | 'LMG' | 'Pulse' | 'Rocket' | 'Scout' | 'Shotgun' | 'Sidearm' | 'Sniper' | 'SMG' | 'Sword' | 'Trace'
/** Ability "WeaponTypes" are generally used for ability damage increases from mods/exotics */
 | 'Super' | 'Grenade' | 'Melee';
/**
 ** Languages are the same as Bungie's
 ** We do not guarantee the accuracy of the localized perk definitions as very few people are willing to commit to such a time sink.
 ** Therefore, we have no way of validating the accuracy of the translation and are working purely on a good faith system with 0 tolerance for griefing.
 ** Please report any inaccuracies/issues to us directly.
 */
type Languages = 
/** English - English */
'en'
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
 | 'zh-chs';
interface Stat {
    /**
     ** Types of weapons these stats apply to
     ** These are our custom weapon type names
     ** Optional
     */
    weaponTypes?: WeaponTypes[];
    /**
     ** Stats that have activation conditions like a weapon kill
     */
    active?: {
        /**
         ** Array index is key for formulas in perk descriptions
         ** Calculated stat * multiplier
         */
        multiplier?: number[];
        /**
         ** Array index is key for formulas in perk descriptions
         ** Bungie stat + stat
         */
        stat?: number[];
    };
    /**
     ** Stats that are passively active but aren't included in Bungie's investment stats
     */
    passive?: {
        /**
         ** Array index is key for formulas in perk descriptions
         ** Calculated stat * multiplier
         */
        multiplier?: number[];
        /**
         ** Array index is key for formulas in perk descriptions
         ** Bungie stat + stat
         */
        stat?: number[];
    };
}
type Stats = {
    [key in StatNames]?: Stat[];
};
interface LinesContent {
    /**
     ** Text in this part of the line
     */
    text?: string;
    /**
     ** Class names for this part of the line
     */
    classNames?: string[];
    /**
     ** If this line has a link then this line and its text are part of the link
     */
    link?: string;
    /**
     ** If this line has a formula then this line and its text are part of the formula
     */
    formula?: string;
    /**
     ** If this line has a title then this line and its text are part of the title
     */
    title?: DescriptionLine[];
}
interface CellContent {
    /**
     ** Text in this part of the cell (\<span>)
     */
    text?: string;
    /**
     ** This will be moved from here when converting description
     */
    classNames?: string[];
    /**
     ** If this part of cell (\<span>) has link then this part of the cell (\<span>) and its text are part of the link
     */
    link?: string;
    /**
     * If this part of cell (\<span>) has formula then this part of the cell (\<span>) and its text are part of the formula
     */
    formula?: string;
    /**
     ** If this part of cell (\<span>) has title then this part of the cell (\<span>) and its text are part of the title
     */
    title?: DescriptionLine[];
}
/**
 ** Contents of a row in tables (\<tr>) - array of cells
 */
interface RowContent {
    /**
     ** Contents of cell (\<td>) - array of spans (\<span>)
     */
    cellContent: CellContent[];
    /**
     ** Number of cells to span horizontally (Cell Width - integer)
     */
    colSpan?: number;
    /**
     ** Number of cells to span vertically (Cell Height - integer)
     */
    rowSpan?: number;
    /**
     ** This will be moved from here when converting description
     */
    classNames?: string[];
}
interface TableLine {
    /**
     ** Contents of table row (\<tr>)
     */
    rowContent?: RowContent[];
    /**
     ** Table row (\<tr>) class names
     */
    classNames?: string[];
}
interface DescriptionLine {
    /**
     ** Line (\<div>) class names
     */
    classNames?: string[];
    /**
     ** Contents of line (\<span>)
     */
    linesContent?: LinesContent[];
    /**
     ** Is table content only formulas (aka leaving it out doesn't take away any important information from the perk definition)
     */
    isFormula?: boolean;
    /**
     * Contents of table (\<table>)
     */
    table?: TableLine[];
    /**
     ** If this exists that means this line only applies to some of the weapon types defined at the top
     */
    weaponTypes?: (string | undefined)[];
}
export interface LivePerk {
    /**
     ** Perk, Mod, etc. hash
     ** InventoryItem hash
     */
    hash: number;
    /**
     ** Perk, Mod, etc. name
     ** InventoryItem displayProperties name
     */
    name: string;
    /**
     ** Hash of item perk belongs to (Exotic Weapon/Armor)
     ** InventoryItem hash
     */
    itemHash?: number;
    /**
     ** Name of item perk belongs to (Exotic Weapon/Armor)
     ** InventoryItem displayProperties name
     */
    itemName?: string;
    /**
     ** Nickname of person who uploaded this perk to the database
     ** Optional, only for tracking purposes
     */
    uploadedBy: string;
    /**
     ** Type of the perk as defined at the top
     ** Optional, only for organization purposes
     */
    type: PerkTypes;
    /**
     ** Date in ms when the perk was last updated by us
     ** Optional
     */
    updateTracker: {
        /**
         ** Stats have to be enabled for this to show up
         ** Shows up on all perks regardless if they have stats or don't
         */
        stats: {
            /**
             ** Date in ms when stats were last changed
             */
            lastUpdate: number;
            /**
             ** Name of the person who last updated the stats
             */
            updatedBy: string;
        };
        descriptions: {
            [key in Languages]?: {
                /**
                 ** Date in ms when the perk was last updated by us
                 */
                lastUpdate: number;
                /**
                 ** Name of the person who last updated the perk definition
                 */
                updatedBy: string;
            };
        };
    };
    descriptions: {
        [key in Languages]?: DescriptionLine | String;
    };
    /**
     ** This does not include investment stats from Bungie
     ** Optional
     */
    stats?: Stats;
}
export {};
