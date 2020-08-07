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

export class Recipe {
  constructor(
    public recipeName: string,
    public uploaderUid: string,
    public difficulty: string,
    public description: string,
    public ingredients: string[],
    public tools: string[],
    public images: string[],
    public instructions: string[],
    public extraInfo: string,
    public timestamp: number,
    public ratings: Object,
    public tags: string[],
    public baseRecipeId: string | undefined,
    public baseUploaderUid: string, 
    public averageRating: number,
  ) {
    this.recipeName = recipeName;
    this.uploaderUid = uploaderUid;
    this.difficulty = difficulty;
    this.description = description;
    this.ingredients = ingredients;
    this.tools = tools;
    this.images = images;
    this.instructions = instructions;
    this.extraInfo = extraInfo;
    this.timestamp = timestamp;
    this.ratings = ratings;
    this.tags = tags;
    this.baseRecipeId = baseRecipeId;
    this.baseUploaderUid = baseUploaderUid;
    this.averageRating = averageRating;
  }
}
