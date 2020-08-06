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

import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Recipe} from '../recipe'

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit{
  @Input() recipe!: Recipe;
  @Input() recipeId!: string;
  noRatings: boolean = true;
  recipeName: string = '';
  tags!: string[];
  recipeDescription: string = '';
  showDescription: boolean = false;
  @Output() clicked = new EventEmitter<string>();
  
  ngOnInit(): void {
    //these values are temporary
    if(this.recipe.averageRating && this.recipe.averageRating !== 0){
      this.noRatings = false;
    }
    this.tags = this.recipe.tags;
    this.recipeName = this.recipe.recipeName;
    this.recipeDescription = this.recipe.description;
    this.shortenRecipeName();
  }

  shortenRecipeName() {
    if(this.recipeName.length > 13){
      this.recipeName = this.recipeName.substring(0, 12) + '...';
    }
  }

  shortenDescription() {
    if(this.recipeName.length > 100){
      this.recipeDescription = this.recipeName.substring(0, 97) + '...';
    }
  }

  cardClicked() {
    this.clicked.emit(this.recipeId);
  }
}

