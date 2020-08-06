// Copyright 2020 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
        baseRecipeId: recipe.baseRecipeId,
        baseUploaderUid: recipe.baseUploaderUid,
        averageRating: recipe.averageRating,
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
        data.baseRecipeId,
        data.baseUploaderUid,
        data.averageRating,
      );
    },
  };
}