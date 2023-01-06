import { AllClassNames } from './interfaces';
import { Languages } from './livePerkInterface';
export interface DescriptionFilter {
    getFromPerk: {
        /**
         ** Time then perk was uploaded
         */
        lastUpload: boolean;
        /**
         ** Non bungie stats about perks
         ** Has no effect on description content
         */
        stats: boolean;
        /**
         ** Custom perks type for example "Weapon Perk Exotic", "Armor Mod Seasonal"
         */
        type: boolean;
        /**
         ** Nickname of person who uploaded description
         */
        uploadedBy: boolean;
        /**
         ** Time then changes where made and nickName of person who made changes
         ** Includes description in all languages separately and stats (stats have to be enabled)
         */
        updateTracker: boolean;
        /**
         ** Witch languages to include if undefined includes all languages
         */
        languages: Languages[] | undefined;
    };
    getFromDescription: {
        /**
         ** Text snippet for example "range_0" they should be replaced with calculated stats
         ** number in "range_0" represents stat index (stats have to be enabled)
         */
        formula: boolean;
        /**
         ** External links pointing to some specific resources
         ** For example Court's Void Sandbox Guide https://docs.google.com/spreadsheets/d/1i1KUwgVkd8qhwYj481gkV9sZNJQCE-C3Q-dpQutPCi4/edit#gid=1079577444
         */
        link: boolean;
        /**
         ** Custom title with additional information about some specific thing
         ** For example what "refresh" means (Reload, but does not need animation and doesn't proc on-reload perks.)
         */
        title: boolean;
        /**
         ** Just different display format to make things easier to read for users
         */
        table: boolean;
        /**
         ** Some parts of description applies only to specific weapon types
         ** If enabled it will add weapon types to lines with weapon types text applies to
         ** If like applies to everything then it won't be included
         */
        weaponTypes: boolean;
        /**
         ** List of classNames to include
         ** If undefined includes everything
         */
        includeClassNames: AllClassNames[] | undefined;
        /**
         ** List of classNames to remove
         ** If empty array does nothing
         */
        excludeClassNames: AllClassNames[];
    };
    /**
     ** Complicated stuff
     */
    editor: 'main' | 'secondary';
    /**
     ** Are perks with only bungie stats or description should be included
     ** This doesn't mean you will get all bungie descriptions or stats
     ** Maybe I will add bungie stats and descriptions some day
     */
    optional: boolean;
    /**
     ** If you want to replace arrow with something else
     ** Provide value to replace it with otherwise undefined
     */
    enhancedArrowReplacement: string | undefined;
    /**
     ** Very basic converter allows converting description to simple string
     ** Can be used to make markdown or similar formats
     ** Look in to Crayon's configuration for example
     */
    toStringConverterOptions?: {
        /**
         ** Adds text to beginning of string and end of string
         */
        classNames?: {
            [key in AllClassNames]?: [string, string];
        };
        /**
         ** First 2 are for beginning and end of string
         ** Last 2 are for beginning and end of content
         */
        title?: [string, string, string, string];
        /**
         ** First 2 are for beginning and end of string
         ** Last 2 are for beginning and end of link
         */
        link?: [string, string, string, string];
    };
}
export declare const converterSettings: {
    [key: string]: DescriptionFilter;
};
export declare const getSettings: (name: string) => DescriptionFilter;
