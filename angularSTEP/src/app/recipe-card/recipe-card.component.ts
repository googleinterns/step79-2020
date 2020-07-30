import { Component, OnInit, Input } from '@angular/core';

interface recipeData{
  recipeName: string,
  description: string,
  difficulty: string,
  tags: string[],
  images: string[],
  ratings: number[]
}

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit{
  @Input() recipe!: recipeData;
  recipeName: string = '';
  
  ngOnInit(): void {
    this.recipeName = this.recipe.recipeName;
    this.shortenRecipeName();
  }

  shortenRecipeName(){
    if(this.recipeName.length > 16){
      this.recipeName = this.recipeName.substring(0, 13) + '...';
    }
  }
}

