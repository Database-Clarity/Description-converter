"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statNames = exports.weaponTypes = exports.converterSettings = exports.getVariables = exports.extractTitles = exports.descriptionFilter = exports.getDataFromPerk = exports.getSettings = exports.descriptionConverter = void 0;
const converterSettings_1 = require("./src/converterSettings");
Object.defineProperty(exports, "converterSettings", { enumerable: true, get: function () { return converterSettings_1.converterSettings; } });
Object.defineProperty(exports, "getSettings", { enumerable: true, get: function () { return converterSettings_1.getSettings; } });
const data_1 = require("./src/data");
Object.defineProperty(exports, "statNames", { enumerable: true, get: function () { return data_1.statNames; } });
Object.defineProperty(exports, "weaponTypes", { enumerable: true, get: function () { return data_1.weaponTypes; } });
const descriptionConverter_1 = require("./src/descriptionConverter");
Object.defineProperty(exports, "descriptionConverter", { enumerable: true, get: function () { return descriptionConverter_1.descriptionConverter; } });
const descriptionFilter_1 = require("./src/descriptionFilter");
Object.defineProperty(exports, "descriptionFilter", { enumerable: true, get: function () { return descriptionFilter_1.descriptionFilter; } });
const extractTitles_1 = require("./src/converterFunctions/extractTitles");
Object.defineProperty(exports, "extractTitles", { enumerable: true, get: function () { return extractTitles_1.extractTitles; } });
const getDataFromPerk_1 = require("./src/converterFunctions/getDataFromPerk");
Object.defineProperty(exports, "getDataFromPerk", { enumerable: true, get: function () { return getDataFromPerk_1.getDataFromPerk; } });
const loadVariables_1 = require("./src/converterFunctions/loadVariables");
Object.defineProperty(exports, "getVariables", { enumerable: true, get: function () { return loadVariables_1.getVariables; } });
