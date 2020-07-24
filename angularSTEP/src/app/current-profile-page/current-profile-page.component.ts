import {
  AngularFirestore
} from '@angular/fire/firestore';
import { Component, OnInit, NgZone } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { Converter } from '../converter'

@Component({
  selector: 'app-current-profile-page',
  templateUrl: './current-profile-page.component.html',
  styleUrls: ['./current-profile-page.component.scss'],
})
export class CurrentProfilePageComponent implements OnInit {
  selected = 0;
  uid = '';
  user!: User;

  constructor(
    private fAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private zone: NgZone
  ) {
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.setUserData();
      } else {
        this.zone.run(() => {
          this.router.navigate(["/login"]);
        });
      }
    });
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      switch(tab) {
        case 'wishlist': {
          this.selected = 1;
          break;
        }
        case 'shoppinglist': {
          this.selected = 2;
          break;
        }
        default: {
          this.selected = 0;
        }
      }
  });
  }

  ngOnInit() {}

  //gets the current users information and stores it
  async setUserData() {
    const postUser = await this.afs
      .doc('/users/' + this.uid + '/')
      .ref.withConverter(new Converter().userConverter)
      .get();
    if (postUser !== null && postUser.data() !== undefined) {
      this.zone.run(() => {
        this.user = postUser.data()!;
      })
    } else {
      this.router.navigate(['/login']);
    }
  }
}
