"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTitles = void 0;
const extractTitles = (description) => {
    if (!description)
        return {};
    const titles = description.match(/^title [A-z0-9 ]+ \([^]*?\n\)$/gm);
    if (titles === null)
        return {};
    return titles.reduce((acc, titleText) => {
        const lines = titleText.split('\n');
        const titleName = lines[0].replace(/title|\(.*/gi, '').trim();
        lines.splice(0, 1);
        lines.splice(-1, 1);
        acc[titleName] = lines.join('\n');
        return acc;
    }, {});
};
exports.extractTitles = extractTitles;
