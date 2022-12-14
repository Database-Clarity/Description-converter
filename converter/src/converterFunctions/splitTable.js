"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitTable = void 0;
const data_1 = require("../data");
const extractClassesFromLine_1 = require("./extractClassesFromLine");
const lineConverter_1 = require("./lineConverter");
const splitTable = (line, title) => {
    const { classNames, cleanLine } = (0, extractClassesFromLine_1.getLineClasses)(line, data_1.classNameList.empty);
    // line splitted on |
    const splittedLine = cleanLine.match(/\|.*?((?=\|)|$)/g) || [];
    return {
        classNames,
        rowContent: splittedLine.map((tableCell) => {
            const cellSpan = tableCell.match(/\|([bchr\d-]+)?/)?.[0]?.match(/-\d|\d/g);
            const colSpan = cellSpan?.filter((number) => Number(number) > 0)[0];
            const rowSpan = cellSpan?.filter((number) => Number(number) < 0)[0];
            const inCellClasses = {
                b: 'bold',
                c: 'center',
                h: 'background',
                r: 'right'
            };
            const cellClassNames = tableCell
                .match(/\|[bchr\d-]+/)?.[0]
                .split('')
                .filter((char) => inCellClasses[char] !== undefined)
                .map((c) => inCellClasses[c]);
            tableCell = tableCell.replace(/\|[bchr\d-]+|\|/, '').trim();
            const convertCellContent = (0, lineConverter_1.convertLinesContent)(tableCell, title);
            const cleanedCell = convertCellContent.flatMap((span) => {
                if ((span.text === undefined || span.text.trim() === '') &&
                    (span.classNames === undefined || !span.classNames?.some((className) => typeof className === 'string')))
                    return [];
                return {
                    text: span.text,
                    classNames: span.classNames,
                    formula: span.formula,
                    title: span.title
                };
            });
            return {
                colSpan: colSpan ? Number(colSpan) : undefined,
                rowSpan: rowSpan ? Number(rowSpan) * -1 : undefined,
                classNames: cellClassNames,
                cellContent: cleanedCell
            };
        })
    };
};
exports.splitTable = splitTable;
