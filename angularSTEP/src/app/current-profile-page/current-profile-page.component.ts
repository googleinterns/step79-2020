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

import {AngularFirestore} from '@angular/fire/firestore';
import {Component, OnInit, Inject, NgZone, ChangeDetectorRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router, ActivatedRoute} from '@angular/router';
import {User} from '../user';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Converter} from '../converter';
import {ChangeProfileImgComponent} from '../change-profile-img/change-profile-img.component'

@Component({
  selector: 'app-current-profile-page',
  templateUrl: './current-profile-page.component.html',
  styleUrls: ['./current-profile-page.component.scss'],
})
export class CurrentProfilePageComponent implements OnInit {
  selected = 0;
  uid = '';
  stillLoading = true;
  changeImage = false;
  user: User | null = null;
  displayNameForm: FormControl | null = null;

  constructor(
    private fAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private zone: NgZone,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.uid = auth.uid;
          this.setUserData();
      } else {
        this.zone.run(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  //gets the current users information and stores it
  async setUserData() {
    //actively listens for data change, and then reloads the user.
    this.afs.firestore
      .doc('/users/' + this.uid + '/')
      .withConverter(new Converter().userConverter)
      .onSnapshot(postUser => {
        if (postUser !== null && postUser.data() !== undefined) {
          this.route.queryParams.subscribe(params => {
            const tab = params['tab'];
            switch (tab) {
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
          this.zone.run(() => {
            this.user = postUser.data()!;
          })
        } else {
          this.router.navigate(['/login']);
        }
    });
  }

  editValue(form: string) {
    switch (form) {
      case 'displayName': {
        this.displayNameForm = new FormControl(this.user!.displayName);
        break;
      }
    }
  }

  cancelForm(form: string) {
    switch (form) {
      case 'displayName': {
        this.displayNameForm = null;
        break;
      }
    }
  }

  onSubmit() {
    this.fAuth.currentUser.then(user => {
      if (
        user &&
        this.displayNameForm &&
        this.displayNameForm.valid &&
        this.displayNameForm.value !== this.user!.displayName
      ) {
        this.afs
          .collection('users')
          .doc(this.user!.uid)
          .ref.withConverter(new Converter().userConverter)
          .update({displayName: this.displayNameForm.value})
          .then(() => {
            this.displayNameForm = null;
          });
      } else if (
        this.displayNameForm &&
        this.displayNameForm.valid &&
        this.displayNameForm.value === this.user!.displayName
      ) {
        this.displayNameForm = null;
      }
    });
  }

  closeImgChanger(close: boolean) {
    this.changeImage = !close;
  }

  changeProfileImage() {
    const dialogRef = this.dialog.open(ChangeProfileImgComponent, {
      width: '300px'
    });
  }
}
