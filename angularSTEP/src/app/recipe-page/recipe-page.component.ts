import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';
import {User} from '../user';
import {Converter} from '../converter';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
})
export class RecipePageComponent {
  id: string | null = this.route.snapshot.paramMap.get('id');
  recipe!: Recipe;
  uploader: User | null;

  constructor(private db: AngularFirestore, private route: ActivatedRoute) {
    this.setRecipeData();
  }

  async setRecipeData() {
    const postRecipe = await this.db
      .collection('recipes')
      .doc(this.id)
      .ref.withConverter(new RecipeConverter().recipeConverter)
      .get();
    if (postRecipe && postRecipe.data()) {
      this.recipe = postRecipe.data();
      const postUser = await this.db
        .collection('users')
        .doc(this.recipe.uploaderUid)
        .ref.withConverter(new Converter().userConverter)
        .get();
      if (postUser && postUser.data()) {
        this.uploader = postUser.data();
      }
    }
  }
}
