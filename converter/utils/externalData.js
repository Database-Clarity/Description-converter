"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryItems = exports.database = void 0;
const fs_1 = require("fs");
const sync_fetch_1 = __importDefault(require("sync-fetch"));
let database_placeholder = null;
if (database_placeholder === null) {
    database_placeholder = JSON.parse((0, fs_1.readFileSync)('./intermediateDatabase.json', 'utf8'));
}
exports.database = database_placeholder;
const justFetch = (link, retries = 0) => {
    const resp = (0, sync_fetch_1.default)(link);
    if (resp.status === 200)
        return resp.json();
    if (retries > 5)
        return;
    return justFetch(link, retries + 1);
};
let inventoryItems_placeHolder = null;
if (inventoryItems_placeHolder === null) {
    const manifest = justFetch('https://www.bungie.net/Platform/Destiny2/Manifest/');
    if (manifest === undefined)
        throw new Error('failed getting manifest');
    const inventoryItemUrl = `https://www.bungie.net${manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition}`;
    const inventoryItemsData = justFetch(inventoryItemUrl);
    if (inventoryItemsData === undefined)
        throw new Error('Failed getting inventory items');
    inventoryItems_placeHolder = inventoryItemsData;
}
exports.inventoryItems = inventoryItems_placeHolder;
