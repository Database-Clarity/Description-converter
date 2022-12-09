"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bungieStatNames = exports.allClassNames = exports.classNameList = exports.languageKeys = exports.languages = exports.weaponTypes = exports.statNames = void 0;
exports.statNames = [
    'Range',
    'Reload',
    'Handling',
    'Stability',
    'Zoom',
    'Aim Assist',
    'Charge Draw',
    'RPM',
    'Ready',
    'Stow',
    'Damage',
    'Airborne'
];
exports.weaponTypes = [
    'AR',
    'Bow',
    'Fusion',
    'Glaive',
    'GL',
    'HC',
    'Heavy GL',
    'LFR',
    'LMG',
    'Pulse',
    'Rocket',
    'Scout',
    'Shotgun',
    'Sidearm',
    'Sniper',
    'SMG',
    'Sword',
    'Trace',
    // ---------
    'Super',
    'Grenade',
    'Melee'
];
exports.languages = [
    ['en', 'English'],
    ['de', 'German - Deutsch'],
    ['fr', 'French - Français'],
    ['it', 'Italian - Italiano'],
    ['pl', 'Polish - Polski'],
    ['ru', 'Russian - Русский'],
    ['es', 'Spanish (Spain) - Español (España)'],
    ['es-mx', 'Spanish (Mexico) - Español (México)'],
    ['ko', 'Korean - 한국어'],
    ['pt-rb', 'Portuguese (Brazil) - Português (Brasil)'],
    ['ja', 'Japanese - 日本語'],
    ['zh-cht', 'Chinese (Traditional) - 繁體中文'],
    ['zh-chs', 'Chinese (Simplified) - 简体中文']
];
exports.languageKeys = exports.languages.map(languageKey => languageKey[0]);
const textColoring = [
    'green',
    'blue',
    'purple',
    'yellow',
    'center',
    'bold',
    'pve',
    'pvp'
];
const images = [
    'stasis',
    'arc',
    'solar',
    'void',
    'primary',
    'special',
    'heavy',
    'barrier',
    'overload',
    'unstoppable',
    'warlock',
    'hunter',
    'titan'
];
exports.classNameList = {
    line: [...textColoring, 'background', 'breakSpaces'],
    withText: [...textColoring, 'background'],
    empty: [...images],
    withExtraFunctionality: ['link', 'title', 'formula'],
    extra: ['enhancedArrow', 'spacer']
};
exports.allClassNames = Object.values(exports.classNameList).flat();
exports.bungieStatNames = {
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
};
