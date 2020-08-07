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

import {Component, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';
import {User} from '../user';
import {Converter} from '../converter';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from '@angular/material/snack-bar';
import {ItemDialogComponent} from '../item-dialog/item-dialog.component';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
})

export class RecipePageComponent {
  id: string | null = this.route.snapshot.paramMap.get('recipeid');
  pageRecipe!: Recipe;
  baseRecipe!: Recipe;
  currentUser!: User; // used to be called user
  baseUser!: User; //used to be called uploader
  uploader!: User; //used to be called uploader
  loggedIn: boolean = false; //might also be called signedIn

  inWishlist = false;
  currentRating: number = 0;
  currentRatings: object = {};

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private fAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private zone: NgZone,
  ) {
    this.setPageData();
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.setPageData();
        this.setUserData(auth.uid);
        this.loggedIn = true;
      } else {
        this.setPageData();
        this.loggedIn = false;
      }
    });
  }

  async setPageData() {
    const postRecipe = await this.db.doc('/recipes/' + this.id + '/')
      .ref.withConverter(new RecipeConverter().recipeConverter).get();
    const recipeClassData = postRecipe.data();

    if (recipeClassData) {
      if (recipeClassData.baseUploaderUid) {
        const postBaseUser = await this.db.doc('/users/' + recipeClassData.baseUploaderUid + '/')
          .ref.withConverter(new Converter().userConverter).get();
        const baseUserData = postBaseUser.data();
      
        if (postBaseUser && baseUserData) {
          this.baseUser = baseUserData; // sets the base users data

          const postBaseRecipe = await this.db.doc('/recipes/' + recipeClassData.baseRecipeId + '/')
            .ref.withConverter(new RecipeConverter().recipeConverter).get();
          const baseRecipeData = postBaseRecipe.data();

          if (baseRecipeData) {
            this.baseRecipe = baseRecipeData; // sets the base recipes data
          }
        }
      }
      if (recipeClassData.uploaderUid) {
        const uploaderUser = await this.db.doc('/users/' + recipeClassData.uploaderUid + '/')
          .ref.withConverter(new Converter().userConverter).get();
        const uploaderData = uploaderUser.data();
      
        if (uploaderUser && uploaderData) {
          this.uploader = uploaderData; // sets the uploader data
        }
      }

      this.pageRecipe = recipeClassData;  // sets the page recipe's data
      if(this.pageRecipe.ratings){
        this.currentRatings = this.pageRecipe.ratings;
        if(this.currentRatings && this.currentRatings.hasOwnProperty(this.currentUser.uid)){
          this.currentRating = this.currentRatings[this.currentUser.uid];
        } else {
          this.currentRating = 0;
        }
      }

    }
  }
  
  updateRating(rating: number){
    this.fAuth.currentUser.then(user => {
      if(this.loggedIn && user) {
        this.currentRatings[user.uid] = rating;
        this.db
            .collection('recipes')
            .doc(this.id)
            .ref.withConverter(new RecipeConverter().recipeConverter)
            .update({ratings: this.currentRatings, averageRating: this.getAverageRating()})
      }
    });
  }
  
  getAverageRating() {
    let sum = 0;
    for(let key of Object.keys(this.currentRatings)){
      sum += this.currentRatings[key];
    }
    // round to the nearest half star just to give a little more different variation in the ratings
    this.pageRecipe.averageRating = Math.round((sum / Object.keys(this.currentRatings).length)*2)/2;
    return this.pageRecipe.averageRating;
  }
  
  async setUserData(uid: string) {
    const postUser = await this.db
      .doc('/users/' + uid + '/')
      .ref.withConverter(new Converter().userConverter)
      .get();

    if (postUser && postUser.data()) {
      this.currentUser = postUser.data()!;
      this.inWishlist = this.isRecipeInWishlist();
    } 
  }

  objToMap(obj: any): Map<string, number> {
    const mp = new Map();
    Object.keys(obj).forEach(k => {
      mp.set(k, obj[k]);
    });
    return mp;
  }

  addItem(item: string) {

    const currentShoppingList: Map<string, number> = this.objToMap(
      this.currentUser.shoppingList
    );

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'auto';
    dialogConfig.width = 'auto';
    dialogConfig.data = {
      selectedItem: item,
      add: true,
      remove: false,
      max: 0,
    };

    const dialogRef = this.dialog.open(ItemDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (currentShoppingList.has(item)) {
          const currentValue = currentShoppingList.get(item);
          if (currentValue) {
            currentShoppingList.set(item, currentValue + result);
          }
        } else {
          currentShoppingList.set(item, result);
        }

        const objectCurrentShoppingList = Array.from(
          currentShoppingList
        ).reduce(
          (objectCurrentShoppingList, [key, value]) =>
            Object.assign(objectCurrentShoppingList, {[key]: value}),
          {}
        );

        this.fAuth.currentUser.then(user => {
          if (user) {
            this.db.collection('users')
            .doc(this.currentUser!.uid)
            .ref.withConverter(new Converter().userConverter)
            .update({shoppingList: objectCurrentShoppingList})
            .then(() => {
                this.snackBar.open(
                  'Item Added!',
                  undefined,
                  {
                    duration: 2000,
                  }
                );
              })
              .catch(error => {
                this.snackBar.open(
                  'Something went wrong:' + error,
                  undefined,
                  {
                    duration: 2000,
                  }
                );
              });

          }
        });
      }
    });
  }

  branchRecipe() {
    this.router.navigate(['/branch-recipe', this.id]);
  }

  toUser() {
    this.router.navigate(['/users', this.baseUser.username]);
  }

  isRecipeInWishlist() {
    if (this.currentUser && this.loggedIn && this.id) {
      return this.currentUser.wishlist.indexOf(this.id) > -1;
    }
    return false;
  }

  setWishlist(addItem: boolean){
    if(this.loggedIn){
      if(addItem){
        this.currentUser.wishlist.push(this.id);
      }
      else{
        const index = this.currentUser.wishlist.indexOf(this.id);
        if(index > -1){
          this.currentUser.wishlist.splice(index,1);
        }
      }
      this.fAuth.currentUser.then(user => {
        if (user) {
          this.db
            .collection('users')
            .doc(user.uid)
            .ref.withConverter(new Converter().userConverter)
            .update({wishlist: this.currentUser.wishlist})
            .then(() => {
                this.inWishlist = addItem;
            });
        }
      });

    }
  }

  addToWishlist(){
    this.zone.run(() => {
      this.setWishlist(true);
    })
  }

  subtractFromWishlist(){
    this.zone.run(() => {
      this.setWishlist(false);
    })
  }

  goToUser(username: string) {
    this.zone.run(() => {
      this.router.navigate(['discover/users/', username]);
    })
  }

}
