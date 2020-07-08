import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Component, OnInit} from '@angular/core';

import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

class User {
  username: string;
  displayName: string;
  email: string;
  picUrl: string;
  following: Array<string>;
  recipes: Array<string>;
  wishlist: Array<string>;
  shoppinglist: Array<string>;
  constructor(
    username: string,
    displayName: string,
    email: string,
    picUrl: string,
    following: Array<string>,
    recipes: Array<string>,
    wishlist: Array<string>,
    shoppinglist: Array<string>
  ) {
    this.username = username;
    this.displayName = displayName;
    this.email = email;
    this.picUrl = picUrl;
    this.following = following;
    this.recipes = recipes;
    this.wishlist = wishlist;
    this.shoppinglist = shoppinglist;
  }
}

@Component({
  selector: 'app-view-profiles',
  templateUrl: './view-profiles.component.html',
  styleUrls: ['./view-profiles.component.scss'],
})
export class ViewProfilesComponent implements OnInit {
  loggedIn = false;
  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(
    public fAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.userCollection = this.afs.collection('users');
    this.users = this.userCollection.valueChanges();
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.loggedIn = true;
      }
      if (!auth) {
        this.loggedIn = false;
      }
    });
  }

  goToUser(username: string) {
    this.router.navigate(['users/'+username]);
  }

  ngOnInit() {}
}
