"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.separateTableWeaponType = void 0;
const data_1 = require("../data");
const extractClassesFromLine_1 = require("./extractClassesFromLine");
const lineConverter_1 = require("./lineConverter");
const splitTable_1 = require("./splitTable");
/*
   (
      < table [^]+?\n<\$>\n?
      |
      < weapon type [^]+?\n<\$\$>\n?
   )
   |
   (
      .+\n?
      |
      \n
   )
*/
const separateTableWeaponType = (description, titles) => {
    const splittedDescription = description
        .match(/(< table [^]+?\n<\$>\n?|< weapon type [^]+?\n<\$\$>\n?)|(.+\n?|\n)/g)
        ?.map((l) => l.trimEnd());
    if (!splittedDescription)
        return;
    return splittedDescription.reduce((acc, description) => {
        if (description.startsWith('< table ')) {
            const tableLines = description.split('\n');
            if (tableLines.length < 3)
                return acc;
            // remove first and last lines this mutates original array
            tableLines.splice(-1);
            const firstLine = tableLines.splice(0, 1);
            const tableClasses = data_1.classNameList.table;
            const tableClassNames = firstLine[0]
                .replace(/< table | >/g, '')
                .match(/(\w+)/g)
                ?.filter((string) => tableClasses.includes(string));
            acc.push({
                table: tableLines.flatMap((line) => (0, splitTable_1.splitTable)(line, titles)),
                classNames: [...(tableClassNames || []), 'table'],
                isFormula: tableClassNames?.includes('formula')
            });
            return acc;
        }
        if (description.startsWith('< weapon type ')) {
            const weaponTypeLines = description.match(/(< (weapon type )?\([^]+?\) >\n[^]*?)(?=(< \(|<\$\$>))/g);
            let notSelectedWeaponTypes = [...data_1.weaponTypes];
            weaponTypeLines?.forEach((weaponLine) => {
                const weaponLines = weaponLine.split('\n');
                const firstLine = weaponLines.splice(0, 1);
                const currentWeaponTypes = firstLine[0]
                    .replace(/< (weapon type )?\(| \) >/g, '')
                    .split(',')
                    .map((s) => s.trim())
                    ?.filter((string) => [...data_1.weaponTypes, 'other'].includes(string));
                notSelectedWeaponTypes = notSelectedWeaponTypes.filter((type) => !currentWeaponTypes.includes(type));
                (0, exports.separateTableWeaponType)(weaponLines.join('\n'), titles)?.forEach((line) => {
                    acc.push({
                        weaponTypes: currentWeaponTypes.includes('other')
                            ? notSelectedWeaponTypes
                            : currentWeaponTypes,
                        ...line
                    });
                });
            });
            return acc;
        }
        if (description.trim() === '') {
            acc.push({
                classNames: ['spacer']
            });
            return acc;
        }
        const { classNames, cleanLine } = (0, extractClassesFromLine_1.getLineClasses)(description, data_1.classNameList.line);
        const breakSpaces = description.includes('<breakSpaces/>');
        acc.push({
            classNames,
            linesContent: (0, lineConverter_1.convertLinesContent)(breakSpaces ? cleanLine.trimEnd() : cleanLine.trim(), titles)
        });
        return acc;
    }, []);
};
exports.separateTableWeaponType = separateTableWeaponType;
