"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineClasses = void 0;
const getLineClasses = (line, classNamesArray) => {
    const classNames = classNamesArray.flatMap((className) => {
        const updatedClassName = `<${className}/>`;
        if (line.match(new RegExp(updatedClassName)) === null)
            return [];
        return className;
    });
    const cleanLine = classNames.reduce((acc, className) => {
        acc = acc.replace(new RegExp(`<${className}/>`), '');
        return acc;
    }, line);
    return {
        classNames,
        cleanLine
    };
};
exports.getLineClasses = getLineClasses;
