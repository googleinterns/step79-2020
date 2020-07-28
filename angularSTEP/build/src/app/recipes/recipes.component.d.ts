import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
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
export declare class RecipesComponent {
    private db;
    private router;
    recipesCollection: AngularFirestoreCollection<Recipe>;
    recipes: Observable<RecipeId[]>;
    id: string;
    constructor(db: AngularFirestore, router: Router);
    goToRecipe(id: string): void;
}
export {};
