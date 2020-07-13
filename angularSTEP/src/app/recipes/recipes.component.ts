import { Component , OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute , ParamMap} from '@angular/router';
import { map } from  'rxjs/operators';
import { Observable } from 'rxjs';
 
interface Recipe {
  recipeName: string;
  difficulty: string;
  extraInfo: string;
  ingredients: Array<string>;
  instructions: Array<string>;
  tools:Array<string>;
}

interface RecipeId extends Recipe {
  id: string;
}

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.scss'],
  })
  
export class RecipesComponent {
  recipesCollection: AngularFirestoreCollection<Recipe>;
  recipes: Observable<RecipeId[]>;
  id: string = '';

  constructor(private db: AngularFirestore,
              private router: Router,) {
                this.recipesCollection = this.db.collection<Recipe>('recipes');
                this.recipes = this.recipesCollection.snapshotChanges().pipe(
                  map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Recipe;
                    const id = a.payload.doc.id;
                    return { id, ...data};
                  }))
                );   ef6c834cb3c7f703a16902cad38db9766642a81d
  }
  
  goToRecipe(id: string) {
    this.router.navigate(['/recipe', id]);
  }
}
