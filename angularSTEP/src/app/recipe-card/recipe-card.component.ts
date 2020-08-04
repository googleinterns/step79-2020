import { Component, OnInit, Input } from '@angular/core';

interface recipeData{
  recipeName: string,
  description: string,
  difficulty: string,
  tags: string[],
  images: string[],
  ratings: {}
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
  averageRating: number = 0;
  recipeDescription: string = '';
  showDescription: boolean = false;
  
  ngOnInit(): void {
    //these values are temporary
    if(Object.keys(this.recipe.ratings).length > 0){
      this.noRatings = false;
      this.getAverageRating();
    }
    this.tags = this.recipe.tags;
    this.recipeName = this.recipe.recipeName;
    this.recipeDescription = this.recipe.description;
    this.shortenRecipeName();
    
  }

  getAverageRating() {
    let sum = 0;
    for(let key of Object.keys(this.recipe.ratings)){
      sum += this.recipe.ratings[key];
    }
    this.averageRating = Math.round((sum / Object.keys(this.recipe.ratings).length)*2)/2;
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

