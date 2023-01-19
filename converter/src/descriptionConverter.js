"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descriptionConverter = void 0;
const doMath_1 = require("./converterFunctions/doMath");
const extractTitles_1 = require("./converterFunctions/extractTitles");
const loadExports_1 = require("./converterFunctions/loadExports");
const loadVariables_1 = require("./converterFunctions/loadVariables");
const removePerkSpecificText_1 = require("./converterFunctions/removePerkSpecificText");
const removeUnusedText_1 = require("./converterFunctions/removeUnusedText");
const separateTableWeaponType_1 = require("./converterFunctions/separateTableWeaponType");
const prepareDescription = (descriptionData) => {
    const { language, hash, database } = descriptionData;
    let description = (0, loadExports_1.loadExports)(descriptionData);
    // removes enhanced/exotic perks and catalysts if perk is not enhanced/exotic perk or catalyst
    description = (0, removePerkSpecificText_1.removePerkSpecificText)(description, database[hash].type);
    description = (0, loadVariables_1.loadVariables)({ ...descriptionData, descriptionString: description });
    description = (0, doMath_1.doMath)(description);
    return {
        preparedDescription: (0, removeUnusedText_1.removeUnusedText)(description.trim()),
        titles: {
            ...(0, extractTitles_1.extractTitles)((0, removeUnusedText_1.removeUnusedText)(description, false)),
            ...(0, extractTitles_1.extractTitles)(database[3].editor[language]?.main),
            ...(0, extractTitles_1.extractTitles)(database[3].editor[language]?.secondary)
        }
    };
};
const descriptionConverter = (descriptionData) => {
    const { preparedDescription, titles } = prepareDescription(descriptionData);
    const convertedTitles = Object.entries(titles || {}).reduce((acc, [titleName, titleContent]) => {
        const { preparedDescription } = prepareDescription({ ...descriptionData, descriptionString: titleContent });
        const convertedTitles = (0, separateTableWeaponType_1.separateTableWeaponType)(preparedDescription, {});
        if (convertedTitles)
            acc[titleName] = convertedTitles;
        return acc;
    }, {});
    return (0, separateTableWeaponType_1.separateTableWeaponType)(preparedDescription, convertedTitles);
};
exports.descriptionConverter = descriptionConverter;
