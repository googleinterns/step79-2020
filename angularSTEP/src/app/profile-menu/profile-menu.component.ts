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

import {Component, OnInit, NgZone} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router, NavigationEnd} from '@angular/router';
import {User} from '../user';
import {Converter} from '../converter';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent implements OnInit {
  user!: User;
  username = '';
  displayName = '';
  picUrl = 'assets/images/blank-profile.png';
  loggedIn = false;
  routerCheck!: Subscription;

  constructor(
    private fAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    private zone: NgZone
  ) {
    //checks if Authentication has changed, if user signs in through email
    //it should update menu. If user signs in through google sign-in and is a new
    //user, it won't sign them in until they make a username.
    this.fAuth.onAuthStateChanged(auth => {
      if (
        auth &&
        this.router.url !== '/login' &&
        this.router.url !== '/signup'
      ) {
        this.loggedIn = false;
        this.setUserData(auth.uid);
      } else {
        this.lookForRouterChange();
        this.loggedIn = false;
        this.username = '';
        this.picUrl = 'assets/images/blank-profile.png';
      }
    });
  }

  ngOnInit(): void {}

  //detects route change if router has changed from setting up account.
  //If it has, and the user is not signed it, it will update the menu component
  lookForRouterChange() {
    if (this.router.url === '/login' || this.router.url === '/signup') {
      this.routerCheck = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.router.url !== '/login' && this.router.url !== '/signup') {
            this.fAuth.currentUser.then(user => {
              if (user) {
                this.loggedIn = false;
                this.setUserData(user.uid);
                this.loggedIn = false;
              }
            });
          }
        }
      });
    }
  }

  logout() {
    this.loggedIn = false;
    this.username = '';
    this.displayName = '';
    this.picUrl = 'assets/images/blank-profile.png';
    this.fAuth.signOut();
  }

  myProfile(index: string) {
    if (index !== 'myprofile') {
      this.router.navigate(['/myprofile'], {queryParams: {tab: index}});
    } else {
      this.router.navigate(['/myprofile']);
    }
  }

  signIn() {
    this.router.navigate(['/login']);
  }

  //this method sets the users data and then injects it
  //into the profile menu dropdown. It waits until all of the
  //information is set and then displays the menu.
  //Also actively listens for data change, and then reloads the user.
  async setUserData(uid: string) {
    this.afs.firestore.collection('users')
      .doc(uid).withConverter(new Converter().userConverter).onSnapshot(doc => {
        if (doc.data()) {
          this.user = doc.data()!;
          this.username = this.user.username !== null ? this.user.username : '';
          this.displayName =
            this.user.displayName !== null ? this.user.displayName : '';
          this.picUrl =
            this.user.picUrl !== null && this.user.picUrl !== ''
              ? this.user.picUrl
              : 'assets/images/blank-profile.png';
          this.zone.run(()=>{
            this.loggedIn = true;
          })
          if (this.routerCheck) {
            this.routerCheck.unsubscribe();
          }
        } else {
          this.fAuth.currentUser.then(user => {
            if (
              user &&
              this.router.url !== '/login' &&
              this.router.url !== '/signup'
            ) {
              this.routerCheck.unsubscribe();
              user.delete();
            }
          });
        }
      })
  }
}
