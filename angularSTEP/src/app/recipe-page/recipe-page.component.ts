import { Component } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute , ParamMap} from '@angular/router';
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
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss']
})
export class RecipePageComponent {
  recipesCollection: AngularFirestoreCollection<Recipe>;
  recipes: Observable<RecipeId[]>;
  id: string | null = this.route.snapshot.paramMap.get('id');

  pageRecipe: RecipeId | undefined;

  constructor(private db: AngularFirestore,
              private route: ActivatedRoute,) {
                this.recipesCollection = this.db.collection<Recipe>('recipes');
                this.recipes = this.recipesCollection.snapshotChanges().pipe(
                  map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Recipe;
                    const id = a.payload.doc.id;
                    return { id, ...data};
                  }))
                );
                this.recipes.subscribe(val => console.log(val));
                this.recipes.subscribe(
                  value => {
                    this.pageRecipe = value.find(element => element.id === this.id);
                  }
                );
  }
}