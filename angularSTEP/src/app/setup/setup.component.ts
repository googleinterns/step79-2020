import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Converter} from '../converter';
import {Router} from '@angular/router';
import {User, Username} from '../user';

//this component gets called when signing into a google account. Changes the "display name"
//to the username
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit {
  error = '';
  usernameForm: FormGroup;
  hide = true;
  picUrl = '';

  constructor(
    private fAuth: AngularFireAuth,
    private router: Router,
    private fb: FormBuilder,
    private afs: AngularFirestore
  ) {
    this.usernameForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
    });
  }

  //creates a reactive form for username input
  ngOnInit() {}

  //creates and adds a user to Firestore
  addUser(dName: string, email: string, uid: string) {
    return this.afs
          .collection('users')
          .doc(uid)
          .ref.withConverter(new Converter().userConverter)
          .set(
            new User(
              this.usernameForm.value.username,
              uid,
              dName,
              email,
              this.picUrl,
              [],
              Date.now(),
              [],
              [],
              new Object(),
              ""
            )
          )
          .then(() => {
            this.afs
            .collection('usernames')
            .doc(this.usernameForm.value.username)
            .ref.withConverter(new Converter().usernameConverter)
            .set(new Username(this.usernameForm.value.username, uid))
            .then(() => {
              this.router.navigate(['/home']);
          });
      });
  }

  //when form is submitted, if it is valid, checks if the username exists in Firestore. Then, if not,
  //creates a user and updates the "displayName" of the user authentication to the username
  onSubmit() {
    if (!this.usernameForm.valid) {
      this.error = 'Please make sure the form is filled out correctly';
    } else {
      this.afs
        .doc('/usernames/' + this.usernameForm.value.username + '/')
        .ref.get()
        .then(doc => {
          if (doc.exists) {
            this.error =
              'Username ' +
              this.usernameForm.value.username +
              ' already taken.';
          } else {
            this.fAuth.currentUser.then(user => {
              if (user === null) {
                this.error = 'Could not create user. Please try again.';
              } else {
                const dName = user.displayName !== null ? user.displayName : '';
                const email = user.email !== null ? user.email : '';
                this.picUrl = user.photoURL !== null ? user.photoURL : '';
                user;
                this.addUser(dName, email, user.uid);
              }
            });
          }
        })
        .catch(() => {
          this.error = 'Could not create user. Please try again.';
          this.fAuth.currentUser.then(user => {
            if (user !== null) {
              user.delete();
            }
          });
        });
    }
  }
}
