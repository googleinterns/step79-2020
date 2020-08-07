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

//User class that resembles the documents
//in the Users collection on Firestore
export class User {
  constructor(
    public username: string,
    public uid: string,
    public displayName: string,
    public email: string,
    public picUrl: string,
    public following: Array<string>,
    public time: number,
    public recipes: Array<string>,
    public wishlist: Array<string | null>,
    public shoppingList: Object,
    public aboutme: string
  ) {
    this.username = username;
    this.uid = uid;
    this.displayName = displayName;
    this.email = email;
    this.picUrl = picUrl;
    this.following = following;
    this.time = time;
    this.recipes = recipes;
    this.wishlist = wishlist;
    this.shoppingList = shoppingList;
    this.aboutme = aboutme;
  }
}

export class Username {
  constructor(
    public username: string,
    public uid: string){
      this.username = username;
      this.uid = uid;
    }
}
