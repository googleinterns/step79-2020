import {QueryDocumentSnapshot, SnapshotOptions} from '@angular/fire/firestore';

import {Recipe} from './recipe';

export class RecipeConverter {
  public recipeConverter = {
    toFirestore: function (recipe: Recipe) {
      return {
        recipeName: recipe.recipeName,
        uploaderUid: recipe.uploaderUid,
        difficulty: recipe.difficulty,
        description: recipe.description,
        ingredients: recipe.ingredients,
        tools: recipe.tools,
        images: recipe.images,
        instructions: recipe.instructions,
        extraInfo: recipe.extraInfo,
        timestamp: recipe.timestamp,
        ratings: recipe.ratings,
        tags: recipe.tags,
      };
    },
    fromFirestore: function (
      snapshot: QueryDocumentSnapshot<Recipe>,
      options: SnapshotOptions,
    ) {
      const data = snapshot.data(options);
      return new Recipe(
        data.recipeName,
        data.uploaderUid,
        data.difficulty,
        data.description,
        data.ingredients,
        data.tools,
        data.images,
        data.instructions,
        data.extraInfo,
        data.timestamp,
        data.ratings,
        data.tags,
      );
    },
  };
}