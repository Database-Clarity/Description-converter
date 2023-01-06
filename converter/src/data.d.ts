import { Languages, StatNames, WeaponTypes } from './livePerkInterface';
export declare const statNames: StatNames[];
export declare const weaponTypes: WeaponTypes[];
export declare const languages: [Languages, string][];
export declare const languageKeys: Languages[];
export declare const classNameList: {
    line: ("green" | "blue" | "purple" | "yellow" | "center" | "bold" | "pve" | "pvp" | "background" | "breakSpaces")[];
    withText: ("green" | "blue" | "purple" | "yellow" | "center" | "bold" | "pve" | "pvp" | "background")[];
    empty: ("stasis" | "arc" | "solar" | "void" | "primary" | "special" | "heavy" | "barrier" | "overload" | "unstoppable" | "warlock" | "hunter" | "titan")[];
    withExtraFunctionality: ("formula" | "link" | "title")[];
    extra: ("enhancedArrow" | "spacer")[];
    table: ("wide" | "centerTable" | "background_1" | "background_2" | "formula")[];
};
export declare const allClassNames: ("green" | "blue" | "purple" | "yellow" | "center" | "bold" | "pve" | "pvp" | "stasis" | "arc" | "solar" | "void" | "primary" | "special" | "heavy" | "barrier" | "overload" | "unstoppable" | "warlock" | "hunter" | "titan" | "wide" | "centerTable" | "background_1" | "background_2" | "formula" | "background" | "breakSpaces" | "link" | "title" | "enhancedArrow" | "spacer")[];
export declare const bungieStatNames: {
    [key: string]: string;
};
