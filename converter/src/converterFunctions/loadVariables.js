"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadVariables = exports.getVariables = void 0;
const getVariables = (description) => {
    const variables = description.match(/^var [A-z0-9]+ = .+$/gm);
    if (variables === null)
        return;
    return variables.reduce((acc, variableText) => {
        const varName = variableText.match(/(?<=var )[A-z0-9]+(?= = )/)?.[0].trim();
        const varValue = variableText.match(/(?<=var [A-z0-9]+ = ).+/)?.[0].trim();
        if (!varName || !varValue)
            return acc;
        if (varValue === 'empty') {
            acc[varName] = '';
            return acc;
        }
        acc[varName] = varValue;
        return acc;
    }, {});
};
exports.getVariables = getVariables;
const loadVariables = (descriptionData) => {
    const { language, descriptionString, database } = descriptionData;
    let description = descriptionString;
    const getVariablesNames = (description) => {
        return description.match(/#[A-z0-9]+/g) || [];
    };
    const replaceVariables = (variablesInDescription) => {
        variablesInDescription.forEach((variableName) => {
            const cleanVariableName = variableName.replace('#', '');
            const variables = {
                ...(0, exports.getVariables)(description),
                ...(0, exports.getVariables)(database[2].editor[language]?.main || ''),
                ...(0, exports.getVariables)(database[2].editor[language]?.secondary || '')
            };
            if (variables[cleanVariableName] === undefined)
                return;
            description = description.replaceAll(variableName, variables[cleanVariableName]);
        });
    };
    replaceVariables(getVariablesNames(description));
    return description;
};
exports.loadVariables = loadVariables;
