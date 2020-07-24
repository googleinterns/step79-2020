import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss']
})

export class RecipePageComponent {
  id: string | null = this.route.snapshot.paramMap.get('id');
  pageRecipe!: Recipe;

  constructor(private db: AngularFirestore,
              private route: ActivatedRoute,) {
                this.setRecipeData();
  }

  async setRecipeData() {
    const postRecipe = await this.db.doc('/recipes/' + this.id + '/').ref.withConverter(new RecipeConverter().recipeConverter).get();
    const recipeClassData = postRecipe.data();
    if (recipeClassData) {
      this.pageRecipe = recipeClassData;
    }
  } 
}