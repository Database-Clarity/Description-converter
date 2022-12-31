export const statNames = [
   'Range' as const,
   'Reload' as const,
   'Handling' as const,
   'Stability' as const,
   'Zoom' as const,
   'Aim Assist' as const,
   'Charge Draw' as const,
   'RPM' as const,
   'Ready' as const,
   'Stow' as const,
   'Damage' as const,
   'Airborne' as const
]

export const weaponTypes = [
   'AR' as const,
   'Bow' as const,
   'Fusion' as const,
   'Glaive' as const,
   'GL' as const,
   'HC' as const,
   'Heavy GL' as const,
   'LFR' as const,
   'LMG' as const,
   'Pulse' as const,
   'Rocket' as const,
   'Scout' as const,
   'Shotgun' as const,
   'Sidearm' as const,
   'Sniper' as const,
   'SMG' as const,
   'Sword' as const,
   'Trace' as const,
   // ---------
   'Super' as const,
   'Grenade' as const,
   'Melee' as const
]

export const languages = [
   ['en', 'English'] as const,
   ['de', 'German - Deutsch'] as const,
   ['fr', 'French - Français'] as const,
   ['it', 'Italian - Italiano'] as const,
   ['pl', 'Polish - Polski'] as const,
   ['ru', 'Russian - Русский'] as const,
   ['es', 'Spanish (Spain) - Español (España)'] as const,
   ['es-mx', 'Spanish (Mexico) - Español (México)'] as const,
   ['ko', 'Korean - 한국어'] as const,
   ['pt-rb', 'Portuguese (Brazil) - Português (Brasil)'] as const,
   ['ja', 'Japanese - 日本語'] as const,
   ['zh-cht', 'Chinese (Traditional) - 繁體中文'] as const,
   ['zh-chs', 'Chinese (Simplified) - 简体中文'] as const
]

export const languageKeys = languages.map((languageKey) => languageKey[0])

const textColoring = [
   'green' as const,
   'blue' as const,
   'purple' as const,
   'yellow' as const,
   'center' as const,
   'bold' as const,
   'pve' as const,
   'pvp' as const
]

const images = [
   'stasis' as const,
   'arc' as const,
   'solar' as const,
   'void' as const,

   'primary' as const,
   'special' as const,
   'heavy' as const,

   'barrier' as const,
   'overload' as const,
   'unstoppable' as const,

   'warlock' as const,
   'hunter' as const,
   'titan' as const
]

const table = [
   'wide' as const,
   'centerTable' as const,
   'background_1' as const,
   'background_2' as const,
   'formula' as const
]

export const classNameList = {
   line: [...textColoring, 'background' as const, 'breakSpaces' as const],
   withText: [...textColoring, 'background' as const],
   empty: [...images],
   withExtraFunctionality: ['link' as const, 'title' as const, 'formula' as const],
   extra: ['enhancedArrow' as const, 'spacer' as const],
   table
}

export const allClassNames = Object.values(classNameList).flat()

export const bungieStatNames = {
   4284893193: 'Rounds Per Minute',
   447667954: 'Draw Time',
   2961396640: 'Charge Time',
   2837207746: 'Swing Speed',
   4043523819: 'Impact',
   3614673599: 'Blast Radius',
   1591432999: 'Accuracy',
   2523465841: 'Velocity',
   2762071195: 'Guard Efficiency',
   209426660: 'Guard Resistance',
   1240592695: 'Range',
   1842278586: 'Shield Duration',
   155624089: 'Stability',
   943549884: 'Handling',
   4188031367: 'Reload Speed',
   1345609583: 'Aim Assistance',
   3555269338: 'Zoom',
   2715839340: 'Recoil Direction',
   3022301683: 'Charge Rate',
   3736848092: 'Guard Endurance',
   3871231066: 'Magazine',
   1931675084: 'Inventory Size',
   925767036: 'Ammo Capacity',
   2714457168: 'Airborne Effectiveness'
} as { [key: string]: string }
