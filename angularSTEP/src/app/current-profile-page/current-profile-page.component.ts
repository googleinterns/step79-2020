import {AngularFirestore} from '@angular/fire/firestore';
import {Component, OnInit, NgZone } from '@angular/core';
import {FormControl} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router, ActivatedRoute} from '@angular/router';
import {User} from '../user';
import {Converter} from '../converter';

@Component({
  selector: 'app-current-profile-page',
  templateUrl: './current-profile-page.component.html',
  styleUrls: ['./current-profile-page.component.scss'],
})
export class CurrentProfilePageComponent implements OnInit {
  selected = 0;
  uid = '';
  stillLoading = true;
  user: User | null = null;
  displayNameForm: FormControl | null = null;

  constructor(
    public fAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private _ngZone: NgZone
  ) {
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.setUserData();
      } else {
        this._ngZone.run(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  ngOnInit() {}

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
          this.user = postUser.data()!;
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
        this.displayNameForm.value !== this.user!.aboutme
      ) {
        this.afs
          .collection('users')
          .doc(this.user!.uid)
          .ref.withConverter(new Converter().userConverter)
          .update({displayName: this.displayNameForm.value})
          .then(() => {
            this.displayNameForm = null;
          });
      }
    });
  }
}
