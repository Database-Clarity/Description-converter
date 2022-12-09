"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConverter = void 0;
const fs_1 = require("fs");
const lodash_1 = __importDefault(require("lodash"));
const converterSettings_1 = require("./converterSettings");
const descriptionConverter_1 = require("./descriptionConverter/descriptionConverter");
const cleanObject_1 = require("./utils/cleanObject");
const descriptionFilter_1 = require("./utils/descriptionFilter");
const externalData_1 = require("./utils/externalData");
const getDataFromPerk_1 = require("./utils/getDataFromPerk");
const databaseConverter = (converterType) => {
    const settings = (0, converterSettings_1.getSettings)(converterType);
    const newDatabase = lodash_1.default.transform(externalData_1.database, (acc, perk, hash) => {
        // first 50 are reserved for internal use only
        if (Number(hash) < 50)
            return;
        const editorDescription = perk.editor.en?.main.trim();
        // remove perks with out description
        if (editorDescription === '')
            return;
        // remove optional perks
        if (!settings.optional && perk.optional)
            return;
        // remove perks with bungie description
        if (!settings.optional && editorDescription === externalData_1.inventoryItems[hash]?.displayProperties?.description)
            return;
        const cleanPerk = (0, getDataFromPerk_1.getDataFromPerk)(perk, settings.getFromPerk);
        const descriptions = Object.entries(cleanPerk.editor).reduce((acc, [language, descriptions]) => {
            const convertedDescription = (0, descriptionConverter_1.descriptionConverter)(descriptions[settings.editor], settings.editor, language, cleanPerk.hash);
            if (convertedDescription) {
                acc[language] = (0, descriptionFilter_1.descriptionFilter)(convertedDescription, converterType);
            }
            return acc;
        }, {});
        acc[hash] = {
            ...lodash_1.default.omit(cleanPerk, 'editor'),
            descriptions
        };
    });
    return (0, cleanObject_1.cleanObject)(newDatabase);
};
exports.databaseConverter = databaseConverter;
if (!(0, fs_1.existsSync)('./descriptions')) {
    (0, fs_1.mkdirSync)('./descriptions');
}
for (const key in converterSettings_1.converterSettings) {
    (0, fs_1.writeFileSync)(`./descriptions/${key}.json`, JSON.stringify((0, exports.databaseConverter)(key), undefined, 1));
}
console.log('Completed');
