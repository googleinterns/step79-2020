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

import {Component, OnInit, Input, SimpleChanges} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Router} from '@angular/router'
import {User} from '../user';
import {Converter} from '../converter';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter'

@Component({
  selector: 'app-discover-display',
  templateUrl: './discover-display.component.html',
  styleUrls: ['./discover-display.component.scss'],
})
export class DiscoverDisplayComponent implements OnInit {
  recipeCollection: AngularFirestoreCollection<Recipe> = this.afs.collection(
    'recipes'
  );
  recipes: firebase.firestore.QueryDocumentSnapshot<Recipe>[];

  userCollection: AngularFirestoreCollection<User> = this.afs.collection(
    'users'
  );
  users: firebase.firestore.QueryDocumentSnapshot<User>[];
  @Input() sortType: string;
  @Input() contentType: string;
  @Input() direction: string;

  constructor(private afs: AngularFirestore, private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.sortType) {
      this.sortType = changes.sortType.currentValue;
    }
    if (changes && changes.contentType) {
      this.contentType = changes.contentType.currentValue;
    }
    if (changes && changes.direction) {
      this.direction = changes.direction.currentValue;
    }
    this.getCollectionData();
  }

  ngOnInit() {}

  getCollectionData() {
    if (this.sortType && this.contentType && this.direction !== undefined) {
      switch (this.contentType) {
        case 'Recipes': {
          this.getRecipes();
          break;
        }
        case 'Users': {
          this.getUsers();
          break;
        }
        default: {
          this.getRecipes();
        }
      }
    }
  }

  getRecipes() {
    switch (this.sortType) {
      case 'Time Created': {
        if (this.direction) {
          this.recipeCollection.ref
            .orderBy('timestamp', 'asc')
            .withConverter(new RecipeConverter().recipeConverter)
            .get()
            .then(recipes => {
              this.recipes = recipes.docs;
            });
        } else {
          this.recipeCollection.ref
            .orderBy('timestamp', 'desc')
            .withConverter(new RecipeConverter().recipeConverter)
            .get()
            .then(recipes => {
              this.recipes = recipes.docs;
            });
        }
        break;
      }
      case 'Number of Ingredients': {
        //temporary until num of recipes are actually added
        if (this.direction) {
          this.recipeCollection.ref
            .orderBy('timestamp', 'asc')
            .withConverter(new RecipeConverter().recipeConverter)
            .get()
            .then(recipes => {
              this.recipes = recipes.docs;
            });
        } else {
          this.recipeCollection.ref
            .orderBy('timestamp', 'desc')
            .withConverter(new RecipeConverter().recipeConverter)
            .get()
            .then(recipes => {
              this.recipes = recipes.docs;
            });
        }
        break;
      }
      case 'Name': {
        if (this.direction) {
          this.recipeCollection.ref
            .orderBy('recipeName', 'desc')
            .withConverter(new RecipeConverter().recipeConverter)
            .get()
            .then(recipes => {
              this.recipes = recipes.docs;
            });
        } else {
          this.recipeCollection.ref
            .orderBy('recipeName', 'asc')
            .withConverter(new RecipeConverter().recipeConverter)
            .get()
            .then(recipes => {
              this.recipes = recipes.docs;
            });
        }
        break;
      }
    }
  }

  getUsers() {
    switch (this.sortType) {
      case 'Time Created': {
        if (this.direction) {
          this.userCollection.ref
            .orderBy('time', 'asc')
            .withConverter(new Converter().userConverter)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        } else {
          this.userCollection.ref
            .orderBy('time', 'desc')
            .withConverter(new Converter().userConverter)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        }
        break;
      }
      case 'Number of Recipes': {
        //temporary until num of recipes are actually added
        if (this.direction) {
          this.userCollection.ref
            .orderBy('displayName', 'desc')
            .withConverter(new Converter().userConverter)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        } else {
          this.userCollection.ref
            .orderBy('displayName', 'asc')
            .withConverter(new Converter().userConverter).limit(10)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        }
        break;
      }
      case 'Name': {
        if (this.direction) {
          this.userCollection.ref
            .orderBy('displayName', 'desc')
            .withConverter(new Converter().userConverter).limit(10)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        } else {
          this.userCollection.ref
            .orderBy('displayName', 'asc')
            .withConverter(new Converter().userConverter).limit(10)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        }
        break;
      }
    }
  }

  goToUser(username: string) {
    this.router.navigate(['discover/users/', username]);
  }

  goToRecipe(id: string) {
    if (id) {
      this.router.navigate(['discover/recipes/', id]);
    }
  }
}
