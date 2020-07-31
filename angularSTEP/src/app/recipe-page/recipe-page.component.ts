import {Component} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';
import {User} from '../user';
import {Converter} from '../converter';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ItemDialogComponent} from '../item-dialog/item-dialog.component';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss']
})

export class RecipePageComponent {
  id: string | null = this.route.snapshot.paramMap.get('id');
  pageRecipe!: Recipe;
  baseRecipe!: Recipe;
  currentUser!: User;
  baseUser!: User;
  loggedIn: boolean = false;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private fAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router,
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
      
        if (baseUserData) {
          this.baseUser = baseUserData;

          const postBaseRecipe = await this.db.doc('/recipes/' + recipeClassData.baseRecipeId + '/')
            .ref.withConverter(new RecipeConverter().recipeConverter).get();
          const baseRecipeData = postBaseRecipe.data();

          if (baseRecipeData) {
            this.baseRecipe = baseRecipeData;
          }
        }
      }

      this.pageRecipe = recipeClassData;
    }
  }

  async setUserData(uid: string) {
    const postUser = await this.db.doc('/users/' + uid + '/')
      .ref.withConverter(new Converter().userConverter).get();
    if (postUser && postUser.data()) {
      this.currentUser = postUser.data()!;
    }
  }

  objToMap(obj: any): Map<string, number> {
    const mp = new Map();
    Object.keys(obj).forEach(k => {mp.set(k, obj[k])});
    return mp;
  }

  addItem(item: string) {
    var currentShoppingList: Map<string, number> = this.objToMap(this.currentUser.shoppingList);

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
            .doc(this.currentUser!.uid)
            .ref.withConverter(new Converter().userConverter)
            .update({shoppingList: objectCurrentShoppingList})
            .then(() => {
              this.setUserData(user.uid);
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
}