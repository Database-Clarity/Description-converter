"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descriptionConverter = void 0;
const externalData_1 = require("../utils/externalData");
const doMath_1 = require("./converterFunctions/doMath");
const extractTitles_1 = require("./converterFunctions/extractTitles");
const loadExports_1 = require("./converterFunctions/loadExports");
const loadVariables_1 = require("./converterFunctions/loadVariables");
const removeEnhanced_1 = require("./converterFunctions/removeEnhanced");
const removeUnusedText_1 = require("./converterFunctions/removeUnusedText");
const separateTableWeaponType_1 = require("./converterFunctions/separateTableWeaponType");
const prepareDescription = (description, editorType, language, hash) => {
    description = (0, loadExports_1.loadExports)(description, editorType, language, hash);
    if (externalData_1.database[hash].type !== 'Weapon Perk Enhanced') {
        description = (0, removeEnhanced_1.removeEnhanced)(description);
    }
    description = (0, loadVariables_1.loadVariables)(description, language);
    description = (0, doMath_1.doMath)(description);
    return {
        preparedDescription: (0, removeUnusedText_1.removeUnusedText)(description.trim()),
        titles: {
            ...(0, extractTitles_1.extractTitles)((0, removeUnusedText_1.removeUnusedText)(description, false)),
            ...(0, extractTitles_1.extractTitles)(externalData_1.database[3].editor[language]?.main),
            ...(0, extractTitles_1.extractTitles)(externalData_1.database[3].editor[language]?.secondary)
        }
    };
};
const descriptionConverter = (description, editorType, language, hash) => {
    const { preparedDescription, titles } = prepareDescription(description, editorType, language, hash);
    const convertedTitles = Object.entries(titles || {}).reduce((acc, [titleName, titleContent]) => {
        const { preparedDescription } = prepareDescription(titleContent, editorType, language, hash);
        const convertedTitles = (0, separateTableWeaponType_1.separateTableWeaponType)(preparedDescription, {});
        if (convertedTitles)
            acc[titleName] = convertedTitles;
        return acc;
    }, {});
    return (0, separateTableWeaponType_1.separateTableWeaponType)(preparedDescription, convertedTitles);
};
exports.descriptionConverter = descriptionConverter;
