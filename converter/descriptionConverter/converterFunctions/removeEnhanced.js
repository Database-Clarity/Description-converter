"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEnhanced = void 0;
/**
 ** removes
 **
 ** enhanced (
 **    text for enhanced perk
 ** )
 */
const removeEnhanced = (description) => {
    const enhancedExports = description.match(/^enhanced \([\s\S]*?\n\)$/gm);
    if (enhancedExports) {
        enhancedExports.forEach((enhancedExport) => {
            description = description.replace(enhancedExport, '');
        });
    }
    description = description.replaceAll('#e', '');
    return description;
};
exports.removeEnhanced = removeEnhanced;
