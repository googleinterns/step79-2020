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
    private fAuth: AngularFireAuth,
    private router: Router,
    private fb: FormBuilder,
    private afs: AngularFirestore
  ) {
    this.signUpForm = this.fb.group({
      displayName: [null, [Validators.required, Validators.maxLength(50)]],
      username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  //initializes the reactive form with Validators
  ngOnInit() {}

  //when form is submitted, if it is valid, checks if the username exists in Firestore. Then, if not,
  //creates a user and updates the "displayName" of the user authentication to the username (this is for the future
  //to make it easy to find user info since the doc Id is the username).
  async onSubmit() {
    if (!this.signUpForm.valid) {
      this.error = 'Please make sure the form is filled out correctly';
    } else {
      await this.afs
        .doc('/usernames/' + this.signUpForm.value.username + '/')
        .ref.get()
        .then(async doc => {
          if (doc.exists) {
            this.error = 'Username ' + this.signUpForm.value.username + ' already taken.';
          } else {
            await this.fAuth
              .createUserWithEmailAndPassword(
                this.signUpForm.value.email,
                this.signUpForm.value.password
              )
              .then(async success => {
                if (success.user !== null) {
                  this.picUrl =
                    success.user.photoURL !== null
                      ? success.user.photoURL
                      : 'assets/images/blank-profile.png';
                  this.addUser(success.user.uid);
                } else {
                  this.fAuth.currentUser.then(user => {
                    if (user !== null) {
                      user.delete();
                    }
                  })
                  this.error = 'User not created. Please try again.';
                }
              })
              .catch(async () => {
                await this.fAuth.currentUser.then(user => {
                  if (user !== null) {
                    user.delete();
                  }
                })
                this.error = 'User not created. Please try again.';
              });
          }
        }).catch(() => {
          this.error = "Could not create user";
        })
    }
  }

  //creates the user and adds it to Firestore
  async addUser(uid: string) {
    await this.afs
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
              new Object(),
              ""
            )
          )
          .then(() => {
            this.afs
            .collection('usernames')
            .doc(this.signUpForm.value.username)
            .ref.withConverter(new Converter().usernameConverter)
            .set(new Username(this.signUpForm.value.username, uid))
            .then(() => {
              this.router.navigate(['/home']);
            }).catch(() => {
              this.fAuth.currentUser.then(user => {
                if (user !== null) {
                  user.delete();
                }
              })
              this.error = 'User not created. Please try again.';
            });
      }).catch(() => {
        this.fAuth.currentUser.then(user => {
          if (user !== null) {
            user.delete();
          }
        })
        this.error = 'User not created. Please try again.';
      });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
