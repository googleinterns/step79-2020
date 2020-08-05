import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Recipe } from './recipe';
export declare class RecipeConverter {
    recipeConverter: {
        toFirestore: (recipe: Recipe) => {
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
        };
        fromFirestore: (snapshot: QueryDocumentSnapshot<Recipe>, options: import("firebase").firestore.SnapshotOptions) => Recipe;
    };
}
