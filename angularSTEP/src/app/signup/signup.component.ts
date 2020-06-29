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
  displayName: string;
  email: string;
  photo: string;
  following: Array<string>;
  recipes: Array<string>;
  wishlist: Array<string>;
  shoppinglist: Array<string>;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  error: any;
  signUpForm: FormGroup;
  hide = true;
  user: Observable<User>;
  picUrl: string;

  constructor(public fAuth: AngularFireAuth,
              private router: Router,
              private fb: FormBuilder,
              private afs: AngularFirestore) { }

  //initializes the reactive form with Validators
  ngOnInit() {
    this.signUpForm = this.fb.group({
      displayName: [null, [Validators.required]],
      username: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    })
  }
  
  // when form is submitted, if it is valid, checks if the username exists in Firestore. Then, if not, 
  // creates a user and updates the "displayName" of the user authentication to the username (this is for the future
  //  to make it easy to find user info since the doc Id is the username).
  onSubmit() {
    if (!this.signUpForm.valid) {
      this.error = new Error("Please make sure the form is filled out correctly");
    } else {
      this.afs.doc('/users/'+this.signUpForm.value.username+"/").ref.get().then((doc) => {
        if (doc.exists) {
          this.error = "Username "+this.signUpForm.value.username+" already taken.";
        } else {
          this.fAuth.createUserWithEmailAndPassword(this.signUpForm.value.email, 
          this.signUpForm.value.password).then((success) => {
            this.picUrl = success.user.photoURL;
            success.user.updateProfile({
              displayName: this.signUpForm.value.username
            }).then((success)=>{
              this.addUser();
              this.fAuth.currentUser.then((user)=>{this.router.navigate(['/home']);});
            }).catch((error) =>{
              this.error = "Could not create user.";
            })
          }).catch((err) => {
            this.error = "Email address may not be valid or an account may already be using this email address.";
          })
        }
      })
    }
  }

  //creates the user and adds it to Firestore
  addUser(){
    this.afs.collection('users').doc(this.signUpForm.value.username).set({
      displayName: this.signUpForm.value.displayName,
      username: this.signUpForm.value.username,
      photoUrl: this.picUrl,
      timestamp: Date.now(),
      recipes: [],
      wishlist: [],
      shoppinglist: new Object(),
      following: []
    }).catch((err) => {
        this.fAuth.currentUser.then((user)=>user.delete());
        this.error = "Please try again.";
    })
  }
  

  goBack(){
    this.router.navigate(['/login'])
  }
}

