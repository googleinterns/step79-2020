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
  averageRating: number = 0;
  
  ngOnInit(): void {
    this.recipe.ratings = [2, 3, 4, 5, 5, 5, 5, 2, 4, 1];
    this.recipe.tags = ["Vegetarian", "Lowfat", "Easytomake"]
    this.recipeName = this.recipe.recipeName;
    this.shortenRecipeName();
    this.getAverageRating();
  }

  getAverageRating() {
    let sum = 0;
    for(let i = 0; i < this.recipe.ratings.length; i++){
      sum += this.recipe.ratings[i];
    }
    this.averageRating = Math.round((sum / this.recipe.ratings.length)*2)/2;
  }

  shortenRecipeName() {
    if(this.recipeName.length > 14){
      this.recipeName = this.recipeName.substring(0, 13) + '...';
    }
  }
}

