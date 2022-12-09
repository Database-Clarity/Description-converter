"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanObject = void 0;
const lodash_1 = __importDefault(require("lodash"));
const cleanObject = (dirtyObject) => {
    const obj = lodash_1.default.cloneDeep(dirtyObject);
    const remover = (obj) => {
        for (const key in obj) {
            // remove null undefined
            if (obj[key] === undefined)
                delete obj[key];
            if (obj[key] === null)
                delete obj[key];
            if (Number.isNaN(obj[key]))
                delete obj[key];
            // remove empty strings
            // if where is reason to remove empty strings don't remove from object with key 'text'
            // if (typeof obj[key] === 'string' && obj[key].trim() === '') delete obj[key]
            if (!obj[key] || typeof obj[key] !== 'object')
                continue;
            remover(obj[key]);
            if (Object.keys(obj[key]).length === 0)
                delete obj[key];
        }
        return obj;
    };
    const nuke = (key, value) => {
        if (Array.isArray(value)) {
            return lodash_1.default.compact(value);
        }
        return value;
    };
    return JSON.parse(JSON.stringify(remover(obj), nuke));
};
exports.cleanObject = cleanObject;
