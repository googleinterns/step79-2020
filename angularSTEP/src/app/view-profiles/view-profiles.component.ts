import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Component, OnInit, NgZone} from '@angular/core';

import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../user';

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
    private afs: AngularFirestore,
    private zone: NgZone
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
    this.zone.run(() => {
      this.router.navigate(['users/', username]);
    })
  }

  ngOnInit() {}
}
