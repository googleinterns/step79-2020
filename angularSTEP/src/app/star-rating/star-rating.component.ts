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

import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  maxRating: number = 5;
  ratingsArray: boolean[] = Array(this.maxRating).fill(false);
  @Input() currentRating: number;
  @Output() newRating = new EventEmitter<number>();

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if(!this.currentRating){
      this.currentRating = 0;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.currentRating){
      this.currentRating = changes.currentRating.currentValue;
      this.changeRating(this.currentRating - 1);
    }
  }

  changeRating(rating: number) {
    const newRating = Math.round(rating) + 1;
    if(newRating !== this.currentRating){
      this.newRating.emit(newRating);
      this.openSnackBar(newRating);
    }
    this.currentRating = newRating;
    for(let i = 0; i < newRating; i++){
      this.ratingsArray[i] = true;
    }
    for(let i = newRating; i < this.ratingsArray.length; i++){
      this.ratingsArray[i] = false;
    }
    
  }

  openSnackBar(rating: number) {
    this._snackBar.open('You rated ' + rating + " / 5", "", {
      duration: 2000,
      panelClass: 'simple-snack-bar'
    });
  }
}
