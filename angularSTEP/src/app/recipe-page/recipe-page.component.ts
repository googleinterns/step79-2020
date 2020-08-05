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
  id: string | null = this.route.snapshot.paramMap.get('id');
  pageRecipe!: Recipe;
  user!: User;
  loggedIn = false;
  inWishlist = false;

  uploader: User | null;
  signedIn: boolean = false;
  currentRating: number = 0;
  currentRatings: object = {};


  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private fAuth: AngularFireAuth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {
    this.setRecipeData();
    this.fAuth.currentUser.then(user => {
      if (user) {
        this.loggedIn = true;
        this.setUserData(user.uid);
      }
      else{
        this.loggedIn = false;
      }
    });
  }

  async setRecipeData() {
    const postRecipe = await this.db
      .doc('/recipes/' + this.id + '/')
      .ref.withConverter(new RecipeConverter().recipeConverter)
      .get();
    if (postRecipe && postRecipe.data()) {
      this.pageRecipe = postRecipe.data();
      if(this.pageRecipe.ratings){
        this.currentRatings = this.pageRecipe.ratings;
      }
      const postUploader = await this.db
        .collection('users')
        .doc(this.pageRecipe.uploaderUid)
        .ref.withConverter(new Converter().userConverter)
        .get();
      if (postUploader && postUploader.data()) {
        this.uploader = postUploader.data();
      }
    }
    this.fAuth.onAuthStateChanged(async user => {
      if(user) {
        this.signedIn = true;
        if(this.currentRatings && this.currentRatings.hasOwnProperty(user.uid)){
          this.currentRating = this.currentRatings[user.uid];
        } else {
          this.currentRating = 0;
        }
      } else {
        this.signedIn = false;
      }
    });
  } 
  
  updateRating(rating: number){
    this.fAuth.currentUser.then(user => {
      if(this.signedIn && user) {
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
    if (postUser.data()) {
      this.user = postUser.data()!;
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
      this.user.shoppingList
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
            this.db
              .collection('users')
              .doc(this.user.uid)
              .ref.withConverter(new Converter().userConverter)
              .update({shoppingList: objectCurrentShoppingList})
              .then(() => {
                this.setUserData(user.uid);
                const snackBarRef = this.snackBar.open(
                  'Item Added!',
                  undefined,
                  {
                    duration: 1500,
                  }
                );
              })
              .catch(error => {
                const snackBarRef = this.snackBar.open(
                  'Something went wrong:' + error,
                  undefined,
                  {
                    duration: 1500,
                  }
                );
              });
          }
        });
      }
    });
  }

  isRecipeInWishlist() {
    if (this.user && this.loggedIn && this.id) {
      return this.user.wishlist.indexOf(this.id) > -1;
    }
    return false;
  }

  setWishlist(addItem: boolean){
    if(this.loggedIn){
      if(addItem){
        this.user.wishlist.push(this.id);
      }
      else{
        const index = this.user.wishlist.indexOf(this.id);
        if(index > -1){
          this.user.wishlist.splice(index,1);
        }
      }
      this.fAuth.currentUser.then(user => {
        if (user) {
          this.db
            .collection('users')
            .doc(user.uid)
            .ref.withConverter(new Converter().userConverter)
            .update({wishlist: this.user.wishlist})
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

}

