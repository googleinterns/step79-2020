import {ActivatedRoute, Router} from '@angular/router';
import {
  AngularFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import {Component, OnInit} from '@angular/core';

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
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  username = '';
  loggedIn = false;
  displayName = '';
  picUrl = 'assets/images/blank-profile.png';
  profileLoaded = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    const username = this.activatedRoute.snapshot.paramMap.get('username');
    if (username === null) {
      this.router.navigate(['/users']);
    } else {
      this.username = username;
      this.setUserData();
    }
  }

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
        data.username,
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
      this.profileLoaded = true;
    } else {
      this.router.navigate(['/users']);
    }
  }
}
