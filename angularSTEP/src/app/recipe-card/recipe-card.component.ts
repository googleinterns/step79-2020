import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Input() recipeId!: string;
  recipeName: string = '';
  tags!: string[];
  averageRating: number = 0;
  recipeDescription: string = '';
  showDescription: boolean = false;
  @Output() clicked = new EventEmitter<string>();
  
  ngOnInit(): void {
    //these values are temporary
    this.recipe.ratings = [2, 3, 4, 5, 5, 5, 5, 2, 4, 1];
    this.tags = ["Vegetarian", "Lowfat", "Easy"]
    this.recipeName = this.recipe.recipeName;
    this.recipeDescription = this.recipe.description;
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

