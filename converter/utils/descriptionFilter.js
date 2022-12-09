"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descriptionFilter = exports.cleanDescription = void 0;
const converterSettings_1 = require("../converterSettings");
const cleanObject_1 = require("./cleanObject");
const cleanDescription = (obj, converterType) => {
    const { getFromDescription, enhancedArrowReplacement } = (0, converterSettings_1.getSettings)(converterType);
    const remover = (obj) => {
        for (const key in obj) {
            if (key === 'text') {
                // replace enhanced arrow text
                if (enhancedArrowReplacement !== undefined && obj[key] === '🡅') {
                    obj[key] = enhancedArrowReplacement;
                    continue;
                }
                // replace PVP text
                if (obj[key].className?.includes('pvp') && !getFromDescription.includeClassNames?.includes('pvp')) {
                    const pvpText = obj[key].text.match(/\[[+-]?\d+(\.\d+)?[%?]*?\]/g)?.[0].replace(/\[|\]/g, '');
                    if (pvpText === null)
                        continue;
                    obj[key] = obj[key].text.replace(pvpText, `PVP: ${pvpText}`);
                    continue;
                }
            }
            // filter out classNames
            if (key === 'classNames') {
                obj[key] = obj[key]?.filter((className) => {
                    return getFromDescription.includeClassNames?.includes(className);
                });
                continue;
            }
            // remove link, title, table if settings say so
            if (!getFromDescription.link && key === 'link') {
                delete obj[key];
                continue;
            }
            if (!getFromDescription.title && key === 'title') {
                delete obj[key];
                continue;
            }
            if (!getFromDescription.table && key === 'table') {
                delete obj[key];
                continue;
            }
            // remove formulas
            if (obj[key]?.hasOwnProperty('formula') || obj[key]?.hasOwnProperty('isFormula')) {
                if (!getFromDescription.formula) {
                    delete obj[key];
                    continue;
                }
            }
            // remove weapon types
            if (obj[key]?.hasOwnProperty('weaponTypes')) {
                if (!getFromDescription.weaponTypes) {
                    delete obj[key];
                    continue;
                }
            }
            if (!obj[key] || typeof obj[key] !== 'object')
                continue;
            remover(obj[key]);
        }
        return obj;
    };
    return remover(obj);
};
exports.cleanDescription = cleanDescription;
const descriptionToString = (description, converterType) => {
    const options = (0, converterSettings_1.getSettings)(converterType).toStringConverterOptions;
    return description
        ?.reduce((acc, line) => {
        if (line.classNames?.includes('spacer'))
            return (acc = acc + '\n');
        const newLine = line.linesContent?.reduce((acc, linesContent) => {
            if (linesContent.link && options?.link) {
                const [textStart, textEnd, linkStat, linkEnd] = options.link;
                acc = acc + `${textStart}${linesContent.text}${textEnd}` + `${linkStat}${linesContent.link}${linkEnd}`;
                return acc;
            }
            if (linesContent.classNames && linesContent.classNames?.length !== 0 && options?.classNames) {
                const newText = linesContent.classNames.reduce((acc, className) => {
                    if (className === undefined)
                        return acc;
                    const [classNameStart, classNameEnd] = options.classNames?.[className] || ['', ''];
                    acc = acc + `${classNameStart}${linesContent.text || ''}${classNameEnd}`;
                    return acc;
                }, '');
                acc = acc + newText;
                return acc;
            }
            acc = acc + linesContent.text;
            return acc;
        }, '');
        if (line.classNames && line.classNames?.length !== 0 && options?.classNames) {
            const lineWithClassNames = line.classNames.reduce((acc, className) => {
                if (className === undefined)
                    return acc;
                const [classNameStart, classNameEnd] = options.classNames?.[className] || ['', ''];
                acc = acc + `${classNameStart}${newLine}${classNameEnd}`;
                return acc;
            }, '');
            acc = acc + '\n' + lineWithClassNames;
            return acc;
        }
        acc = acc + '\n' + newLine;
        return acc;
    }, '')
        .trim();
};
const descriptionFilter = (description, converterType) => {
    const { toStringConverterOptions } = (0, converterSettings_1.getSettings)(converterType);
    const newDescription = (0, cleanObject_1.cleanObject)((0, exports.cleanDescription)(description, converterType));
    // remove spacer from end of description
    let removeSpacer = true;
    const finalDescription = newDescription?.reduceRight((acc, line) => {
        if (line.classNames?.includes('spacer') && removeSpacer)
            return acc;
        removeSpacer = false;
        acc.unshift(line);
        return acc;
    }, []);
    if (!toStringConverterOptions)
        return finalDescription;
    return descriptionToString(finalDescription, converterType);
};
exports.descriptionFilter = descriptionFilter;
