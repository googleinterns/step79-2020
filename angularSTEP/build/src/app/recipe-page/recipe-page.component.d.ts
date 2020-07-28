import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
interface Recipe {
    recipeName: string;
    difficulty: string;
    extraInfo: string;
    ingredients: Array<string>;
    instructions: Array<string>;
    tools: Array<string>;
}
interface RecipeId extends Recipe {
    id: string;
}
export declare class RecipePageComponent {
    private db;
    private route;
    recipesCollection: AngularFirestoreCollection<Recipe>;
    recipes: Observable<RecipeId[]>;
    id: string | null;
    pageRecipe: RecipeId | undefined;
    constructor(db: AngularFirestore, route: ActivatedRoute);
}
export {};
