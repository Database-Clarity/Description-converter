"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertLinesContent = void 0;
const data_1 = require("../data");
const convertLinesContent = (line, tiles) => {
    const splittedLine = line.split(/(<.+?\/>|🡅)/g).filter((line) => line !== '');
    return splittedLine.reduce((acc, text) => {
        if (text === '🡅') {
            acc.push({
                text: '🡅',
                classNames: ['enhancedArrow']
            });
            return acc;
        }
        const wrappersName = text.match(/<\w+/)?.[0].replace('<', '');
        // if there are no special stuff return text
        if (wrappersName === undefined) {
            acc.push({
                text
            });
            return acc;
        }
        const { empty, withText } = data_1.classNameList;
        // wrapper with text inside
        if (withText.includes(wrappersName)) {
            acc.push({
                text: text.replace(new RegExp(`<${wrappersName} | \/>`, 'g'), ''),
                classNames: [wrappersName]
            });
            return acc;
        }
        // wrapper with out text inside
        if (empty.includes(wrappersName)) {
            acc.push({
                classNames: [wrappersName]
            });
            return acc;
        }
        const wrapperContent = text.match(/\[.+\]/)?.[0].replace(/\[|\]/g, '');
        const wrapperText = text.replace(/ \[.+\] \/>/g, '');
        if (!wrapperContent || !wrapperText)
            return acc;
        if (wrappersName === 'link') {
            acc.push({
                text: wrapperText.replace('<link ', ''),
                link: wrapperContent,
                classNames: ['link']
            });
            return acc;
        }
        if (wrappersName === 'formula') {
            acc.push({
                text: wrapperText.replace(/<formula ?/, ''),
                formula: wrapperContent,
                classNames: ['formula']
            });
            return acc;
        }
        if (wrappersName === 'title') {
            acc.push({
                text: wrapperText.replace('<title ', ''),
                title: tiles[wrapperContent],
                classNames: ['title']
            });
            return acc;
        }
        return acc;
    }, []);
};
exports.convertLinesContent = convertLinesContent;
