import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Component, OnInit} from '@angular/core';

import {AngularFireAuth} from '@angular/fire/auth';
import {Converter} from '../converter';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  username = '';
  displayName = '';
  picUrl = 'assets/images/blank-profile.png';
  updateData = false;

  constructor(
    public fAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.userCollection = this.afs.collection('users');
    this.users = this.userCollection.valueChanges();
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.username = auth.displayName !== null ? auth.displayName : '';
        this.setUserData();
      }
      if (!auth) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {}

  logout() {
    this.fAuth.signOut();
    this.router.navigate(['/login']);
  }

  //this method sets the users data and then injects it
  //into the profile menu dropdown. It waits until all of the
  //information is set and then displays the menu.
  async setUserData() {
    const postUser = await this.afs
      .doc('/users/' + this.username + '/')
      .ref.withConverter(new Converter().converter)
      .get();
    if (postUser !== null && postUser.data() !== undefined) {
      const user: User = postUser.data()!;
      this.displayName = user.displayName !== null ? user.displayName : '';
      this.picUrl =
        user.picUrl !== null && user.picUrl !== ''
          ? user.picUrl
          : 'assets/images/blank-profile.png';
      this.updateData = true;
    } else {
      this.fAuth.signOut();
      this.router.navigate(['/login']);
    }
  }
}
