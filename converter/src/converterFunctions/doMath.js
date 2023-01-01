"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doMath = void 0;
const lodash_1 = __importDefault(require("lodash"));
const doMath = (description) => {
    /*
    (
       -?\d+       = one or more positive / negative digit
       (\.\d+)?    = .one or more digit
    )
    (
       \s{0,9}     = optional spaces
       [+\-/*]     = one of +, -, *, /
       \s{0,9}     = optional spaces
       (
          -?\d+    = one or more positive / negative digit
          (\.\d+)? = .one or more digit
       )
    )
    {0,99}         = allow last block 0 to 99 times
    */
    const mathRegex = /(-?\d+(\.\d+)?)(\s{0,9}[+\-/*]\s{0,9}(-?\d+(\.\d+)?)){0,99}/;
    // simple math
    if (/\${.+?}/.test(description) && mathRegex.test(description)) {
        const devil = (string) => {
            return new Function('return ' + string)(); // don't do this its fine here because its sanitized
        };
        const mathStuff = description.match(/\${.+?}/g);
        if (!mathStuff)
            return description;
        mathStuff.forEach((math) => {
            const string = math.match(mathRegex)?.[0];
            if (!string)
                return;
            description = description.replace(math, `${lodash_1.default.round(devil(string), 2)}`);
        });
    }
    return description;
};
exports.doMath = doMath;
