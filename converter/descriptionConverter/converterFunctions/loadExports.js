"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadExports = void 0;
const externalData_1 = require("../../utils/externalData");
const getExports = (description) => {
    const exported = description.match(/^export [A-z0-9 ]+ \([\s\S]*?\n\)$/gm);
    if (exported === null)
        return;
    return exported.reduce((acc, exportText) => {
        const lines = exportText.split('\n');
        const exportName = lines[0].replace(/export|hidden|\(.*/gi, '').trim();
        lines.splice(0, 1);
        lines.splice(-1, 1);
        acc[exportName] = lines.join('\n');
        return acc;
    }, {});
};
const loadExports = (description, editor, language, hash) => {
    const getImports = (descriptionString) => {
        if (!descriptionString.includes('import'))
            return null;
        const imports = [
            ...(descriptionString.match(/^import [A-z0-9 ]+? from (\d+|global) *?$/gm) || []),
            ...(descriptionString.match(/^import self *?$/gm) || [])
        ];
        return imports.flatMap((importLine) => {
            const importSelf = importLine.includes('import self');
            if (importSelf) {
                return {
                    line: importLine,
                    name: 'self',
                    from: ''
                };
            }
            const name = importLine.match(/(?<=import) .+ (?=from)/)?.[0].trim();
            const from = importLine.match(/(?<=from) (\d+|global)/)?.[0].trim();
            if (name === undefined || from === undefined)
                return [];
            return {
                line: importLine,
                name: importLine.match(/(?<=import) .+ (?=from)/)?.[0].trim() || '',
                from: importLine.match(/(?<=from) (\d+|global)/)?.[0].trim() || ''
            };
        });
    };
    const replaceImports = (importsInDescription) => {
        importsInDescription.forEach(({ line, name, from }) => {
            const editorToImportFrom = editor === 'main' ? 'secondary' : 'main';
            if (name === 'self') {
                description = description.replace(line, externalData_1.database[hash].editor[language]?.[editorToImportFrom].trim() || '');
                return;
            }
            if (name === 'main' || name === 'secondary') {
                description = description.replace(line, () => externalData_1.database[from]?.editor[language]?.[name] || '');
                return;
            }
            if (from === 'global') {
                const globalExports = {
                    ...getExports(externalData_1.database[1]?.editor[language]?.main || ''),
                    ...getExports(externalData_1.database[1]?.editor[language]?.secondary || '')
                };
                description = description.replace(line, globalExports[name] || '');
                return;
            }
            const exports = {
                ...getExports(externalData_1.database[from]?.editor[language]?.[editorToImportFrom] || '')
            };
            description = description.replace(line, exports[name] || '');
        });
    };
    // just to be safe limiting to 5 times
    for (let i = 0; i < 5; i++) {
        const importsFound = getImports(description);
        if (importsFound === null)
            break;
        replaceImports(importsFound);
    }
    return description;
};
exports.loadExports = loadExports;
