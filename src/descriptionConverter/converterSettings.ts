import { allClassNames, languageKeys } from './data'
import { AllClassNames, Languages } from './interfaces'

export interface DescriptionFilter {
   getFromPerk: {
      /**
       ** Time then perk was uploaded
       */
      lastUpload: boolean

      /**
       ** Non bungie stats about perks
       ** Has no effect on description content
       */
      stats: boolean

      /**
       ** Custom perks type for example "Weapon Perk Exotic", "Armor Mod Seasonal"
       */
      type: boolean

      /**
       ** Nickname of person who uploaded description
       */
      uploadedBy: boolean

      /**
       ** Time then changes where made and nickName of person who made changes
       ** Includes description in all languages separately and stats (stats have to be enabled)
       */
      updateTracker: boolean
      /**
       ** Witch languages to include if undefined includes all languages
       */
      languages: Languages[] | undefined
   }

   getFromDescription: {
      /**
       ** Text snippet for example "range_0" they should be replaced with calculated stats
       ** number in "range_0" represents stat index (stats have to be enabled)
       */
      formula: boolean

      /**
       ** External links pointing to some specific resources
       ** For example Court's Void Sandbox Guide https://docs.google.com/spreadsheets/d/1i1KUwgVkd8qhwYj481gkV9sZNJQCE-C3Q-dpQutPCi4/edit#gid=1079577444
       */
      link: boolean

      /**
       ** Custom title with additional information about some specific thing
       ** For example what "refresh" means (Reload, but does not need animation and doesn't proc on-reload perks.)
       */
      title: boolean

      /**
       ** Just different display format to make things easier to read for users
       */
      table: boolean

      /**
       ** Some parts of description applies only to specific weapon types
       ** If enabled it will add weapon types to lines with weapon types text applies to
       ** If like applies to everything then it won't be included
       */
      weaponTypes: boolean

      /**
       ** List of classNames to include
       ** If undefined includes everything
       */
      includeClassNames: AllClassNames[] | undefined

      /**
       ** List of classNames to remove
       ** If empty array does nothing
       */
      excludeClassNames: AllClassNames[]
   }

   /**
    ** Complicated stuff
    */
   editor: 'main' | 'secondary'

   /**
    ** Are perks with only bungie stats or description should be included
    ** This doesn't mean you will get all bungie descriptions or stats
    ** Maybe I will add bungie stats and descriptions some day
    */
   optional: boolean

   /**
    ** If you want to replace arrow with something else
    ** Provide value to replace it with otherwise undefined
    */
   enhancedArrowReplacement: string | undefined

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
         [key in AllClassNames]?: [string, string]
      }

      /**
       ** First 2 are for beginning and end of string
       ** Last 2 are for beginning and end of content
       */
      title?: [string, string, string, string]

      /**
       ** First 2 are for beginning and end of string
       ** Last 2 are for beginning and end of link
       */
      link?: [string, string, string, string]
   }
}

// things to include perks
export const converterSettings: { [key: string]: DescriptionFilter } = {
   clarity: {
      getFromPerk: {
         lastUpload: true,
         stats: true,
         type: true,
         uploadedBy: true,
         updateTracker: false,
         languages: undefined
      },
      getFromDescription: {
         formula: true,
         link: true,
         title: true,
         table: true,
         weaponTypes: true,
         includeClassNames: undefined,
         excludeClassNames: []
      },
      enhancedArrowReplacement: undefined,
      editor: 'main',
      optional: false
   },
   dim: {
      getFromPerk: {
         lastUpload: false,
         stats: false,
         type: false,
         uploadedBy: false,
         updateTracker: false,
         languages: undefined
      },
      getFromDescription: {
         formula: false,
         link: true,
         title: false,
         table: false,
         weaponTypes: false,
         includeClassNames: ['spacer', 'center', 'bold', 'breakSpaces', 'background', 'enhancedArrow'],
         excludeClassNames: []
      },
      enhancedArrowReplacement: '',
      editor: 'secondary',
      optional: false
   },
   crayon: {
      getFromPerk: {
         lastUpload: true,
         stats: true,
         type: true,
         uploadedBy: true,
         updateTracker: false,
         languages: undefined
      },
      getFromDescription: {
         formula: false,
         link: true,
         title: false,
         table: false,
         weaponTypes: false,
         includeClassNames: [
            'spacer',
            'stasis',
            'arc',
            'solar',
            'void',
            'primary',
            'special',
            'heavy',
            'pve',
            'pvp',
            'background',
            'bold'
         ],
         excludeClassNames: []
      },
      enhancedArrowReplacement: undefined,
      editor: 'secondary',
      optional: true,
      toStringConverterOptions: {
         classNames: {
            stasis: ['<:stasis:915198000727461909>', ''],
            arc: ['<:arc:720178925317128243>', ''],
            solar: ['<:solar:720178909361995786>', ''],
            void: ['<:void:720178940240461864>', ''],
            primary: ['<:primary:968793055677251604>', ''],
            special: ['<:special:968793055631114330>', ''],
            heavy: ['<:heavy:968793055652106320>', ''],

            pve: ['<:pve:922884406073507930>', ''],
            pvp: ['<:pvp:922884468275019856>', ''],

            background: ['**', '**'],
            bold: ['**', '**']
         },
         link: ['[', ']', '(', ')']
      }
   },
   lightGG: {
      getFromPerk: {
         lastUpload: true,
         stats: false,
         type: false,
         uploadedBy: false,
         updateTracker: true,
         languages: undefined
      },
      getFromDescription: {
         formula: false,
         link: true,
         title: false,
         table: false,
         weaponTypes: false,
         includeClassNames: ['spacer', 'center', 'bold', 'breakSpaces', 'background', 'enhancedArrow'],
         excludeClassNames: []
      },
      enhancedArrowReplacement: undefined,
      editor: 'secondary',
      optional: false
   }
}
export const getSettings = (name: string): DescriptionFilter => {
   const settings = converterSettings[name]
   const includedClassNames = settings.getFromDescription.includeClassNames || allClassNames

   return {
      ...settings,
      getFromPerk: {
         ...settings.getFromPerk,
         languages: settings.getFromPerk.languages === undefined ? languageKeys : settings.getFromPerk.languages
      },
      getFromDescription: {
         ...settings.getFromDescription,
         includeClassNames: includedClassNames.filter(
            (className) => !settings.getFromDescription.excludeClassNames.includes(className)
         )
      }
   }
}
