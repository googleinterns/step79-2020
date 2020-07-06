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

import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from  "@angular/router";
import { auth } from 'firebase';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFirestore } from  "@angular/fire/firestore";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error: any;
  userSetup = false;
  aboutToSetup = false;

  //checks if user is already signed in. If user is signed in
  // and there is no user in the database linked to the account
  //it will delete the user (in case user refreshes page before 
  //setting a username but after signing in with Google
  constructor(public  fAuth:  AngularFireAuth,
              public  router:  Router,
              private afs: AngularFirestore) { 
    this.fAuth.onAuthStateChanged(auth => {
      if (auth && auth.displayName != null && !this.aboutToSetup) {
        this.afs.doc('/users/'+auth.displayName+"/").ref.get().then((doc) => {
          if (!doc.exists) {
            this.fAuth.currentUser.then((user)=>user.delete());
          } else {
            this.router.navigate(['/home']);
          }
        });
      }
    })
  }

  //checks if google user is new, if so, calls setup component to
  //allow the user to create a username, if not new, redirects to home page
  googleLogin() {
    var provider = new auth.GoogleAuthProvider;
    this.aboutToSetup = true;
    this.fAuth.signInWithPopup(provider).then((success) => {
      if (success.additionalUserInfo.isNewUser) {
        this.router.navigate(['/username-setup'])
      } else {
        this.router.navigate(['/home'])
      }
    }).catch((err) => {
      this.error = "Could not create user. Please try again.";
    })
  }

  ngOnInit(): void {
  }
}
