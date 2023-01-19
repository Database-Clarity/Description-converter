"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = exports.converterSettings = void 0;
const data_1 = require("./data");
// things to include perks
exports.converterSettings = {
    clarity: {
        getFromPerk: {
            lastUpload: true,
            stats: true,
            type: true,
            uploadedBy: true,
            updateTracker: false,
            languages: undefined
        },
        getFromDescription: {
            formula: true,
            link: true,
            title: true,
            table: true,
            weaponTypes: true,
            includeClassNames: undefined,
            excludeClassNames: []
        },
        enhancedArrowReplacement: undefined,
        editor: 'main',
        optional: false
    },
    dim: {
        getFromPerk: {
            lastUpload: false,
            stats: false,
            type: false,
            uploadedBy: false,
            updateTracker: false,
            languages: undefined
        },
        getFromDescription: {
            formula: false,
            link: true,
            title: false,
            table: false,
            weaponTypes: false,
            includeClassNames: ['spacer', 'center', 'bold', 'breakSpaces', 'background', 'enhancedArrow'],
            excludeClassNames: []
        },
        enhancedArrowReplacement: '',
        editor: 'secondary',
        optional: false
    },
    crayon: {
        getFromPerk: {
            lastUpload: true,
            stats: true,
            type: true,
            uploadedBy: true,
            updateTracker: false,
            languages: undefined
        },
        getFromDescription: {
            formula: false,
            link: true,
            title: false,
            table: false,
            weaponTypes: false,
            includeClassNames: [
                'spacer',
                'stasis',
                'arc',
                'solar',
                'void',
                'primary',
                'special',
                'heavy',
                'pve',
                'pvp',
                'background',
                'bold'
            ],
            excludeClassNames: []
        },
        enhancedArrowReplacement: undefined,
        editor: 'secondary',
        optional: true,
        toStringConverterOptions: {
            classNames: {
                stasis: ['<:stasis:915198000727461909>', ''],
                arc: ['<:arc:720178925317128243>', ''],
                solar: ['<:solar:720178909361995786>', ''],
                void: ['<:void:720178940240461864>', ''],
                primary: ['<:primary:968793055677251604>', ''],
                special: ['<:special:968793055631114330>', ''],
                heavy: ['<:heavy:968793055652106320>', ''],
                pve: ['<:pve:922884406073507930>', ''],
                pvp: ['<:pvp:922884468275019856>', ''],
                background: ['**', '**'],
                bold: ['**', '**']
            },
            link: ['[', ']', '(', ')']
        }
    },
    lightGG: {
        getFromPerk: {
            lastUpload: true,
            stats: false,
            type: false,
            uploadedBy: false,
            updateTracker: true,
            languages: undefined
        },
        getFromDescription: {
            formula: false,
            link: true,
            title: false,
            table: false,
            weaponTypes: false,
            includeClassNames: ['spacer', 'center', 'bold', 'breakSpaces', 'background', 'enhancedArrow'],
            excludeClassNames: []
        },
        enhancedArrowReplacement: undefined,
        editor: 'secondary',
        optional: false
    }
};
const getSettings = (name) => {
    const settings = exports.converterSettings[name];
    const includedClassNames = settings.getFromDescription.includeClassNames || data_1.allClassNames;
    return {
        ...settings,
        getFromPerk: {
            ...settings.getFromPerk,
            languages: settings.getFromPerk.languages === undefined ? data_1.languageKeys : settings.getFromPerk.languages
        },
        getFromDescription: {
            ...settings.getFromDescription,
            includeClassNames: includedClassNames.filter((className) => !settings.getFromDescription.excludeClassNames.includes(className))
        }
    };
};
exports.getSettings = getSettings;
