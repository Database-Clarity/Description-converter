"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFromPerk = void 0;
const lodash_1 = __importDefault(require("lodash"));
const getDataFromPerk = (perk, filters) => {
    const getFromPerk = ['hash', 'name', 'itemHash', 'itemName', 'editor'];
    Object.entries(filters).forEach(([filterName, value]) => {
        if (value && typeof value === 'boolean') {
            getFromPerk.push(filterName);
        }
    });
    const newPerk = lodash_1.default.pick(perk, getFromPerk);
    // get selected languages
    const filteredDescriptionLanguages = lodash_1.default.pick(newPerk.editor, filters.languages || []);
    const filteredUpdateTrackerLanguages = lodash_1.default.pick(newPerk.updateTracker?.descriptions, filters.languages || []);
    const updateTracker = {
        descriptions: filteredUpdateTrackerLanguages,
        stats: filters.stats ? newPerk.updateTracker?.stats : undefined
    };
    return {
        ...newPerk,
        editor: filteredDescriptionLanguages,
        updateTracker: filters.updateTracker ? updateTracker : undefined
    };
};
exports.getDataFromPerk = getDataFromPerk;
