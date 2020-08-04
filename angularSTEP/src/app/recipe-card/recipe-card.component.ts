import { Component, OnInit, Input } from '@angular/core';

interface recipeData{
  recipeName: string,
  description: string,
  difficulty: string,
  tags: string[],
  images: string[],
  ratings: {},
  averageRating: number
}

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit{
  @Input() recipe!: recipeData;
  noRatings: boolean = true;
  recipeName: string = '';
  tags!: string[];
  recipeDescription: string = '';
  showDescription: boolean = false;
  
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
}

