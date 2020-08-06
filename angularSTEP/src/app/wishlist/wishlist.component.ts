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

import {AngularFirestore} from '@angular/fire/firestore';
import {Component, OnInit, Input, NgZone} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../user';
import {Converter} from '../converter';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';
import {Router} from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  @Input() userData!: User;
  myRecipes: Recipe[] = [];

  constructor(private afs: AngularFirestore, 
              private fAuth: AngularFireAuth, 
              private zone: NgZone, 
              private router: Router) { }

  ngOnInit() {
    this.getWishlist();
  }

  async getWishlist(){
    if(this.userData && this.userData.wishlist){
      for(let i = 0; i < this.userData.wishlist.length; i++){
        const recipe = await this.afs
              .collection('recipes')
              .doc(this.userData.wishlist[i])
              .ref.withConverter(new RecipeConverter().recipeConverter).get();
        if(recipe && recipe.data()){
          this.myRecipes.push(recipe.data()!);
        }
      }
    }
  }

  goToRecipe(username: string) {
    this.zone.run(() => {
      this.router.navigate(['discover/recipes', username]);
    })
  }

}
