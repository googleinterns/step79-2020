import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  maxRating: number = 5;
  ratingsArray: boolean[] = Array(this.maxRating).fill(false);
  currentRating: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  changeRating(rating: number) {
    const newRating = Math.round(rating) + 1;
    this.currentRating = newRating;
    for(let i = 0; i < newRating; i++){
      this.ratingsArray[i] = true;
    }
    for(let i = newRating; i < this.ratingsArray.length; i++){
      this.ratingsArray[i] = false;
    }
  }
}
