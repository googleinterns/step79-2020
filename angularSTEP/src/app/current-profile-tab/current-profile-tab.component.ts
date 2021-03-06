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
  selector: 'app-current-profile-tab',
  templateUrl: './current-profile-tab.component.html',
  styleUrls: ['./current-profile-tab.component.scss'],
})
export class CurrentProfileTabComponent implements OnInit {
  @Input() userData!: User;
  aboutMeForm: FormControl | null = null;
  usersFollowing: User[] = [];
  myRecipes: firebase.firestore.DocumentSnapshot<Recipe>[] = [];

  constructor(private afs: AngularFirestore, private fAuth: AngularFireAuth, private zone: NgZone, private router: Router) {}

  ngOnInit() {
    this.getFollowing();
    this.getRecipes();
  }

  editValue() {
    this.aboutMeForm = new FormControl(this.userData.aboutme);
  }

  cancelForm() {
    this.aboutMeForm = null;
  }

  onSubmit() {
    this.fAuth.currentUser.then(user => {
      if (
        user &&
        this.aboutMeForm &&
        this.aboutMeForm.valid &&
        this.aboutMeForm.value !== this.userData.aboutme
      ) {
        this.afs
          .collection('users')
          .doc(this.userData.uid)
          .ref.withConverter(new Converter().userConverter)
          .update({aboutme: this.aboutMeForm.value})
          .then(() => {
            this.userData.aboutme = this.aboutMeForm!.value;
            this.aboutMeForm = null;
          });
      }
    });
  }

  async getFollowing(){
    if(this.userData && this.userData.following){
      for(let i = 0; i < this.userData.following.length; i++){
        const user = await this.afs
              .collection('users')
              .doc(this.userData.following[i])
              .ref.withConverter(new Converter().userConverter).get();
        if(user && user.data()){
          this.usersFollowing.push(user.data()!);
        }
      }
    }
  }

  async getRecipes(){
    if(this.userData && this.userData.recipes){
      for(let i = 0; i < this.userData.recipes.length; i++){
        const recipe = await this.afs
              .collection('recipes')
              .doc(this.userData.recipes[i])
              .ref.withConverter(new RecipeConverter().recipeConverter).get();
        if(recipe && recipe.data()){
          this.myRecipes.push(recipe);
        }
      }
    }
  }

  goToUser(username: string) {
    this.zone.run(() => {
      this.router.navigate(['discover/users/', username]);
    })
  }

  goToRecipe(id: string) {
    console.log(id);
    if (id) {
      this.router.navigate(['discover/recipes/', id]);
    }
  }
}
