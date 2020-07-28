import {Component, Input} from '@angular/core';

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
export class RecipeCardComponent {

  @Input() recipe!: recipeData;

}

