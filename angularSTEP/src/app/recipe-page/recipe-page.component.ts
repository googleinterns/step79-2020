import {Component} from '@angular/core';
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
  styleUrls: ['./recipe-page.component.scss']
})

export class RecipePageComponent {
  id: string | null = this.route.snapshot.paramMap.get('id');
  pageRecipe!: Recipe;
  user!: User;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private fAuth: AngularFireAuth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.setRecipeData();
    this.fAuth.currentUser.then(user => {
      if (user) {
        this.setUserData(user.uid);
      }
    });
  }

  async setRecipeData() {
    const postRecipe = await this.db.doc('/recipes/' + this.id + '/')
      .ref.withConverter(new RecipeConverter().recipeConverter).get();
    const recipeClassData = postRecipe.data();
    if (recipeClassData) {
      this.pageRecipe = recipeClassData;
    }
  } 

  async setUserData(uid: string) {
    const postUser = await this.db.doc('/users/' + uid + '/')
      .ref.withConverter(new Converter().userConverter).get();
    if (postUser.data()) {
      this.user = postUser.data()!;
    } 
  }

  objToMap(obj: any): Map<string, number> {
    const mp = new Map();
    Object.keys(obj).forEach(k => {mp.set(k, obj[k])});
    return mp;
  }


  addItem(item: string) {
    var currentShoppingList: Map<string, number> = this.objToMap(this.user.shoppingList);

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
          var currentValue = currentShoppingList.get(item);
          if (currentValue) {
            currentShoppingList.set(item, (currentValue + result));
          }
        } else {
          currentShoppingList.set(item, result);
        }  

        let objectCurrentShoppingList = Array.from(currentShoppingList).reduce((objectCurrentShoppingList, [key, value]) => (
          Object.assign(objectCurrentShoppingList, { [key]: value }) 
        ), {});
    
        this.fAuth.currentUser.then(user => {
          if (user) {
            this.db.collection('users')
            .doc(this.user.uid)
            .ref.withConverter(new Converter().userConverter)
            .update({shoppingList: objectCurrentShoppingList})
            .then(() => {
              this.setUserData(user.uid);
              let snackBarRef = this.snackBar.open('Item Added!', undefined, {
                duration: 1500,
              });
            })
            .catch((error) => {
              let snackBarRef = this.snackBar.open('Something went wrong:' + error, undefined, {
                duration: 1500,
              });
            })
          }
        });  
      }
    });
  }
}