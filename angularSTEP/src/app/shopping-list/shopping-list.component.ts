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

import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../user';
import {Converter} from '../converter';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from '@angular/material/snack-bar';
import {ItemDialogComponent} from '../item-dialog/item-dialog.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})

export class ShoppingListComponent implements OnInit {
  user!: User;
  shoppingListMap: Map<string, number> = new Map();
  shoppingListMapKeys!: string[];

  constructor(
    private db: AngularFirestore,
    private fAuth: AngularFireAuth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.fAuth.currentUser.then(user => {
      if (user) {
        this.setUserData(user.uid);
      }
    });
  }

  ngOnInit(): void {
  }

  async setUserData(uid: string) {
    const postUser = await this.db.doc('/users/' + uid + '/')
      .ref.withConverter(new Converter().userConverter).get();
    if (postUser.data()) {
      this.user = postUser.data()!;
      this.shoppingListMap = this.objToMap(this.user.shoppingList);
      if (!this.shoppingListMapKeys) {
        this.shoppingListMapKeys = Array.from(this.shoppingListMap.keys());
      }
    } 
  }

  objToMap(obj: any): Map<string, number> {
    const mp = new Map;
    Object.keys(obj).forEach(k => {mp.set(k, obj[k])});
    return mp;
  }

  removeMultiple(key: string) {
    const currentValue: number | undefined = this.shoppingListMap.get(key);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'auto';
    dialogConfig.width = 'auto';
    dialogConfig.data = {
      selectedItem: key,
      max: currentValue,
      add: false,
      remove: true,
    };

    const dialogRef = this.dialog.open(ItemDialogComponent, dialogConfig);

    
    dialogRef.afterClosed().subscribe(result => {
      if (result && currentValue) {
        let difference: number = currentValue - result;
        
        if (difference === 0) {
          this.shoppingListMap.delete(key);
          let index = this.shoppingListMapKeys.indexOf(key);
          this.shoppingListMapKeys.splice(index, 1);
        } else {
          if (currentValue) {
            this.shoppingListMap.set(key, (currentValue - result));
          }
        }
    
        let objectUpdatedShoppingList = Array.from(this.shoppingListMap).reduce((objectUpdatedShoppingList, [key, value]) => (
          Object.assign(objectUpdatedShoppingList, {[key]: value}) 
        ), {});
    
        this.fAuth.currentUser.then(user => {
          if (user) {
            this.db.collection('users')
            .doc(this.user.uid)
            .ref.withConverter(new Converter().userConverter)
            .update({shoppingList: objectUpdatedShoppingList})
            .then(() => {
              this.setUserData(user.uid);
            })
            .catch(() => {
              this.snackBar.open('There was a problem updating your Shopping List', undefined, {
                duration: 3000,
              });
            });
          }
        });    
      }
    });

  }

  removeItem(key: string) {
    if (this.shoppingListMap.get(key) === 1) {
      this.shoppingListMap.delete(key);
      let index = this.shoppingListMapKeys.indexOf(key);
      this.shoppingListMapKeys.splice(index, 1);
    } else {
      let currentValue = this.shoppingListMap.get(key);
      if (currentValue) {
        this.shoppingListMap.set(key, (currentValue - 1));
      }
    }

    let objectUpdatedShoppingList = Array.from(this.shoppingListMap).reduce((objectUpdatedShoppingList, [key, value]) => (
      Object.assign(objectUpdatedShoppingList, {[key]: value}) 
    ), {});

    this.fAuth.currentUser.then(user => {
      if (user) {
        this.db.collection('users')
        .doc(this.user!.uid)
        .ref.withConverter(new Converter().userConverter)
        .update({shoppingList: objectUpdatedShoppingList})
        .then(() => {
          this.setUserData(user.uid);
        })
        .catch(() => {
          this.snackBar.open('There was a problem updating your Shopping List', undefined, {
            duration: 3000,
          });
        });
      }
    });    
  }
}