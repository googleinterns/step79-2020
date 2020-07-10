import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Component, OnInit} from '@angular/core';

import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
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

  constructor(public fAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.userCollection = this.afs.collection('users');
    this.users = this.userCollection.valueChanges();
  }

  logout() {
    this.fAuth.signOut();
  }

  ngOnInit() {}
}
