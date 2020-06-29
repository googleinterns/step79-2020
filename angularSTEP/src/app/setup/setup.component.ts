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
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

interface User {
  username: string;
  fName: string;
  lName: string;
  email: string;
  photo: string;
  following: Array<string>;
  recipes: Array<string>;
  wishlist: Array<string>;
  shoppinglist: Array<string>;
}

//this component gets called when signing into a google account. Changes the "display name"
//to the username
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  error: any;
  usernameForm: FormGroup;
  hide = true;
  picUrl: string;

  constructor(public fAuth: AngularFireAuth,
              private router: Router,
              private fb: FormBuilder,
              private afs: AngularFirestore) {
              }

  //creates a reactive form for username input
  ngOnInit() {
    this.usernameForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3)]]
    })
  }

  //creates and adds a user to Firestore
  addUser(dName: string, email: string){
    this.afs.collection('users').doc(this.usernameForm.value.username).set({
      displayName: dName,
      username: this.usernameForm.value.username,
      email: email,
      photoUrl: this.picUrl,
      timestamp: Date.now(),
      recipes: [],
      wishlist: [],
      shoppinglist: new Object(),
      following: []
    });
    this.router.navigate(['/home']);
  }

  // when form is submitted, if it is valid, checks if the username exists in Firestore. Then, if not, 
  // creates a user and updates the "displayName" of the user authentication to the username
  onSubmit() {
    if (!this.usernameForm.valid) {
      this.error = new Error("Please make sure the form is filled out correctly");
    } else {
      this.afs.doc('/users/'+this.usernameForm.value.username+"/").ref.get().then((doc) => {
        if (doc.exists) {
          this.error = "Username "+this.usernameForm.value.username+" already taken.";
        } else {
          this.fAuth.currentUser.then((user) => {
            const dName = user.displayName;
            const email = user.email;
            this.picUrl = user.photoURL;
            user.updateProfile({
              displayName: this.usernameForm.value.username
            }).then((success)=>{
              this.addUser(dName, email);
            }).catch((err)=>{
              this.error = "Could not add user. Please try again.";
            })
          }).catch((error) => {
            this.fAuth.currentUser.then((user)=>user.delete());
            this.error = "Could not create user. Please try again.";
          })
        }
      })
    }
  }
}
