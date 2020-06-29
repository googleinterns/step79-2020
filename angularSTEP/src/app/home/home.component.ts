// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection } from  "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//basic home page
interface User {
  username: string;
  displayName: string;
  email: string;
  photo: string;
  following: Array<string>;
  recipes: Array<string>;
  wishlist: Array<string>;
  shoppinglist: Array<string>;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name: any;
  obj: any;
  intA: any;
  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(public fAuth: AngularFireAuth, private router: Router, private http: HttpClient, private afs: AngularFirestore) { 
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.name = auth.displayName;
      }
      if (!auth) {
        this.router.navigate(['/login']);
      }
    })
  }

  logout() {
    this.fAuth.signOut();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.userCollection = this.afs.collection('users');
    this.users = this.userCollection.valueChanges(); 
  }
}
