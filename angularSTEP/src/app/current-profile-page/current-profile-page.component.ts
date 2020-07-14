import {
  AngularFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import {Component, Input, OnInit} from '@angular/core';

import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

class User {
  displayName: string;
  email: string;
  picUrl: string;
  following: Array<string>;
  recipes: Array<string>;
  wishlist: Array<string>;
  shoppinglist: Array<string>;
  constructor(
    displayName: string,
    email: string,
    picUrl: string,
    following: Array<string>,
    recipes: Array<string>,
    wishlist: Array<string>,
    shoppinglist: Array<string>
  ) {
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
  selector: 'app-current-profile-page',
  templateUrl: './current-profile-page.component.html',
  styleUrls: ['./current-profile-page.component.scss'],
})
export class CurrentProfilePageComponent implements OnInit {
  @Input() selected = 0;
  username = '';
  displayName = '';
  picUrl = 'assets/images/blank-profile.png';

  // Firestore data converter
  userConverter = {
    toFirestore: function (user: User) {
      return {displayName: user.displayName};
    },
    fromFirestore: function (
      snapshot: QueryDocumentSnapshot<any>,
      options: SnapshotOptions
    ) {
      const data = snapshot.data(options);
      return new User(
        data.displayName,
        data.email,
        data.photoUrl,
        data.following,
        data.recipes,
        data.wishlist,
        data.shoppingList
      );
    },
  };

  constructor(
    public fAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.username = auth.displayName !== null ? auth.displayName : '';
        this.setUserData();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {}

  //gets the current users information and stores it
  async setUserData() {
    const postUser = await this.afs
      .doc('/users/' + this.username + '/')
      .ref.withConverter(this.userConverter)
      .get();
    if (postUser !== null && postUser.data() !== undefined) {
      const user: User = postUser.data()!;
      this.displayName = user.displayName !== null ? user.displayName : '';
      this.picUrl =
        user.picUrl !== null && user.picUrl !== ''
          ? user.picUrl
          : 'assets/images/blank-profile.png';
    } else {
      this.router.navigate(['/login']);
    }
  }
}
