import { Component, OnInit, Input } from '@angular/core';

interface recipeData{
  recipeName: string,
  description: string,
  difficulty: string
}

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit{

  @Input() recipe!: recipeData;
  recipeName!: string;
  description!: string;
  difficulty!: string;

  ngOnInit(): void {
    this.recipeName = this.recipe.recipeName;
    this.description = this.recipe.description;
    this.difficulty = this.recipe.difficulty;
  }

}

