import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Recipe } from '../recipe';
export declare class RecipesComponent {
    private db;
    private router;
    recipes: Observable<Recipe[]>;
    constructor(db: AngularFirestore, router: Router);
    goToRecipe(id: string): void;
}
