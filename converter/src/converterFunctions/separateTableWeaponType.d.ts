import { DescriptionLine } from '../interfaces';
export declare const separateTableWeaponType: (description: string, titles: {
    [key: string]: DescriptionLine[];
}) => DescriptionLine[] | undefined;
