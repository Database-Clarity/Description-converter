import { DescriptionFilter } from '../converterSettings';
import { IntermediatePerk } from '../interfaces';
export declare const getDataFromPerk: (perk: IntermediatePerk, filters: DescriptionFilter['getFromPerk']) => {
    editor: Partial<import("../interfaces").Editor>;
    updateTracker: {
        descriptions: Partial<{
            en?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            de?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            fr?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            it?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            pl?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            ru?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            es?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            "es-mx"?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            ko?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            "pt-rb"?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            ja?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            "zh-cht"?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
            "zh-chs"?: {
                lastUpdate: number;
                updatedBy: string;
            } | undefined;
        }>;
        stats: {
            lastUpdate: number;
            updatedBy: string;
        } | undefined;
    } | undefined;
    hash?: number | undefined;
    name?: string | undefined;
    itemHash?: number | undefined;
    itemName?: string | undefined;
    uploadedBy?: string | undefined;
    type?: import("../livePerkInterface").LivePerkTypes | "none" | undefined;
    importStatsFrom?: number | undefined;
    linking?: {
        weaponPerkExotic?: number | undefined;
        weaponFrameExotic?: number | undefined;
        weaponCatalystExotic?: number | undefined;
        weaponPerkEnhanced?: number | undefined;
    } | undefined;
    stats?: import("../interfaces").Stats | undefined;
    lastUpload?: number | undefined;
    inLiveDatabase?: boolean | undefined;
    optional?: boolean | undefined;
    hidden?: boolean | undefined;
    uploadToLive?: boolean | undefined;
};
