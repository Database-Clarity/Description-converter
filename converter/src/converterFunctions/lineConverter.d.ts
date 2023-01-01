import { CellContent, DescriptionLine, LinesContent } from '../interfaces';
export declare const convertLinesContent: (line: string, tiles: {
    [key: string]: DescriptionLine[];
}) => CellContent[] | LinesContent[];
