import {Component} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';
import {User} from '../user';
import {Converter} from '../converter';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AddItemDialogComponent} from '../add-item-dialog/add-item-dialog.component';

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
    public dialog: MatDialog,
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

  xah_obj_to_map(obj: any): Map<string, number> {
    const mp = new Map;
    Object.keys ( obj ). forEach (k => { mp.set(k, obj[k]) });
    return mp;
  }


  addItem(item: string) {
    // console.log(this.xah_obj_to_map(this.user.shoppingList));
    // var currentShoppingList: Map<string, number> = this.xah_obj_to_map(this.user.shoppingList);
    // // var currentShoppingList: Map<string, number> = this.user.shoppingList;
    // // console.log(this.user.shoppingList);
    // // console.log(currentShoppingList);
    // if (currentShoppingList.has(item)) {
    //   var currentValue = currentShoppingList.get(item);
    //   if (currentValue) {
    //     currentShoppingList.set(item, (currentValue + 1));
    //   }
    // } else {
    //   currentShoppingList.set(item, 1);
    // }

    let testTuple: [number, string, string, number] = [1, 'unit', 'item', 1];
    let testMap: Map<string, [number, string, string, number]> = new Map([
      ['item', testTuple],
    ]);
    
    console.log(testMap);

    let obj = Array.from(testMap).reduce((obj, [key, value]) => (
      Object.assign(obj, { [key]: value }) 
    ), {});

    console.log(obj);
    this.db.collection('users')
    .doc(this.user!.uid)
    .ref.withConverter(new Converter().userConverter)
    .update({shoppingList: obj});
    // console.log(this.user.shoppingList);



    // let obj = Array.from(currentShoppingList).reduce((obj, [key, value]) => (
    //   Object.assign(obj, { [key]: value }) 
    // ), {});

    // // for (let [key, value] of currentShoppingList) {
    // //   obj[key] = value;
    // // }   

    // // currentShoppingList.forEach((value, key) => (obj[key] = value));
    // // const obj = Object.fromEntries(currentShoppingList);

    // var objectCurrentShoppingList = obj;

    // // Object.fromEntries(currentShoppingList);
    // // console.log(objectCurrentShoppingList);

    // this.db.collection('users')
    // .doc(this.user!.uid)
    // .ref.withConverter(new Converter().userConverter)
    // .update({shoppingList: objectCurrentShoppingList});
    // // console.log(this.user.shoppingList);
    
    // this.fAuth.currentUser.then(user => {
    //   if (user) {
    //     this.setUserData(user.uid);
    //   }
    // });
    // console.log(this.user.shoppingList);


    // const dialogRef = this.dialog.open(AddItemDialogComponent, {
    //   data: {addedItem: item},
    //   height: '400px',
    //   width: '600px',
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // this is where i add the result of the dialog to the this.user.shoppingList map 
    // });

    // console.log(this.user);
    // console.log(item);
    // probably pass in a string consisting of the item? idk how rn but yeah
    // a pop-up of sorts? saying to enter a quantity? or no quantity too?
    // pop up would also be good to learn to eventually change the confirm t
    // this is what should execute on button click
    // user.shoppingList.set(item, quantity) <= more or less the end result
  }
}