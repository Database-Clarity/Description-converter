import { DescriptionData } from '../interfaces';
export declare const getVariables: (description: string) => {
    [key: string]: string;
} | undefined;
export declare const loadVariables: (descriptionData: DescriptionData) => string;
