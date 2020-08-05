import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe';
import { User } from '../user';
import { MatDialog } from "@angular/material/dialog";
export declare class RecipePageComponent {
    private db;
    private route;
    private fAuth;
    private dialog;
    id: string | null;
    pageRecipe: Recipe;
    user: User;
    constructor(db: AngularFirestore, route: ActivatedRoute, fAuth: AngularFireAuth, dialog: MatDialog);
    setRecipeData(): Promise<void>;
    setUserData(uid: string): Promise<void>;
    objToMap(obj: any): Map<string, number>;
    addItem(item: string): void;
}
