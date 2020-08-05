export declare class Recipe {
    recipeName: string;
    uploaderUid: string;
    difficulty: string;
    description: string;
    ingredients: string[];
    tools: string[];
    instructions: string[];
    extraInfo: string;
    timestamp: number;
    ratings: number[];
    tags: string[];
    constructor(recipeName: string, uploaderUid: string, difficulty: string, description: string, ingredients: string[], tools: string[], instructions: string[], extraInfo: string, timestamp: number, ratings: number[], tags: string[]);
}
