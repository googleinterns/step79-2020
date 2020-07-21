import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Converter} from '../converter';
import {Router} from '@angular/router';
import {User, Username} from '../user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  error = '';
  signUpForm: FormGroup;
  hide = true;
  picUrl = '';

  constructor(
    public fAuth: AngularFireAuth,
    private router: Router,
    private fb: FormBuilder,
    private afs: AngularFirestore
  ) {
    this.signUpForm = this.fb.group({
      displayName: [null, [Validators.required]],
      username: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  //initializes the reactive form with Validators
  ngOnInit() {}

  //when form is submitted, if it is valid, checks if the username exists in Firestore. Then, if not,
  //creates a user and updates the "displayName" of the user authentication to the username (this is for the future
  //to make it easy to find user info since the doc Id is the username).
  onSubmit() {
    if (!this.signUpForm.valid) {
      this.error = 'Please make sure the form is filled out correctly';
    } else {
      this.afs
        .doc('/usernames/' + this.signUpForm.value.username + '/')
        .ref.get()
        .then(doc => {
          if (doc.exists) {
            this.error =
              'Username ' + this.signUpForm.value.username + ' already taken.';
          } else {
            this.fAuth
              .createUserWithEmailAndPassword(
                this.signUpForm.value.email,
                this.signUpForm.value.password
              )
              .then(success => {
                if (success.user !== null) {
                  this.picUrl =
                    success.user.photoURL !== null
                      ? success.user.photoURL
                      : 'assets/images/blank-profile.png';
                  this.addUser(success.user.uid);
                }
              })
              .catch(() => {
                this.fAuth.currentUser.then(user => {
                  if (user !== null) {
                    user.delete();
                  }
                  this.error = 'User not created. Please try again.';
                });
              });
          }
        });
    }
  }

  //creates the user and adds it to Firestore
  addUser(uid: string) {
    return this.afs
      .collection('usernames')
      .doc(this.signUpForm.value.username)
      .ref.withConverter(new Converter().usernameConverter)
      .set(new Username(this.signUpForm.value.username, uid))
      .then(() => {
        this.afs
          .collection('users')
          .doc(uid)
          .ref.withConverter(new Converter().userConverter)
          .set(
            new User(
              this.signUpForm.value.username,
              uid,
              this.signUpForm.value.displayName,
              this.signUpForm.value.email,
              this.picUrl,
              [],
              Date.now(),
              [],
              [],
              new Object()
            )
          )
          .then(() => {
            this.router.navigate(['/home']);
          });
      });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
