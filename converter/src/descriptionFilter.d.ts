import { DescriptionLine } from './interfaces';
export declare const cleanDescription: <T>(obj: T, converterType: string) => T;
export declare const descriptionFilter: (description: DescriptionLine[] | undefined, converterType: string) => string | DescriptionLine[] | undefined;
