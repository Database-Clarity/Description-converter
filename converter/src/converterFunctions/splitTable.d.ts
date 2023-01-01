import { DescriptionLine } from '../interfaces';
export declare const splitTable: (line: string, title: {
    [key: string]: DescriptionLine[];
}) => {
    classNames: string[];
    rowContent: {
        colSpan: number | undefined;
        rowSpan: number | undefined;
        classNames: string[] | undefined;
        cellContent: {
            text: string | undefined;
            classNames: (string | undefined)[] | undefined;
            formula: string | undefined;
            title: DescriptionLine[] | undefined;
        }[];
    }[];
};
