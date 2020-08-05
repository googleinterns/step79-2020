"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recipe_1 = require("./recipe");
class RecipeConverter {
    constructor() {
        this.recipeConverter = {
            toFirestore: function (recipe) {
                return {
                    recipeName: recipe.recipeName,
                    uploaderUid: recipe.uploaderUid,
                    difficulty: recipe.difficulty,
                    description: recipe.description,
                    ingredients: recipe.ingredients,
                    tools: recipe.tools,
                    instructions: recipe.instructions,
                    extraInfo: recipe.extraInfo,
                    timestamp: recipe.timestamp,
                    ratings: recipe.ratings,
                    tags: recipe.tags,
                };
            },
            fromFirestore: function (snapshot, options) {
                const data = snapshot.data(options);
                return new recipe_1.Recipe(data.recipeName, data.uploaderUid, data.difficulty, data.description, data.ingredients, data.tools, data.instructions, data.extraInfo, data.timestamp, data.ratings, data.tags);
            },
        };
    }
}
exports.RecipeConverter = RecipeConverter;
//# sourceMappingURL=recipe-converter.js.map