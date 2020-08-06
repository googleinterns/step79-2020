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

import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Recipe} from '../recipe';
 
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
  
export class RecipesComponent {
  recipes: Observable<Recipe[]>;

  constructor(
    private db: AngularFirestore,
    private router: Router,
  ) {
    this.recipes = this.db.collection<Recipe>('recipes').valueChanges({idField: 'id'});
  }
  
  goToRecipe(id: string) {
    this.router.navigate(['/recipes', id]);
  }
}
