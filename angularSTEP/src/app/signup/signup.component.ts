import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';

interface User {
  username: string;
  displayName: string;
  email: string;
  photo: string;
  following: Array<string>;
  recipes: Array<string>;
  wishlist: Array<string>;
  shoppinglist: Array<string>;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  error: string = '';
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

  // when form is submitted, if it is valid, checks if the username exists in Firestore. Then, if not,
  // creates a user and updates the "displayName" of the user authentication to the username (this is for the future
  //  to make it easy to find user info since the doc Id is the username).
  onSubmit() {
    if (!this.signUpForm.valid) {
      this.error = 'Please make sure the form is filled out correctly';
    } else {
      this.afs
        .doc('/users/' + this.signUpForm.value.username + '/')
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
                    success.user.photoURL !== null ? success.user.photoURL : '';
                  success.user
                    .updateProfile({
                      displayName: this.signUpForm.value.username,
                    })
                    .then(success => {
                      this.addUser();
                      this.fAuth.currentUser.then(user => {
                        this.router.navigate(['/home']);
                      });
                    })
                    .catch(error => {
                      this.error = 'Could not create user.';
                    });
                }
              })
              .catch(err => {
                this.error =
                  'Email address may not be valid or an account may already be using this email address.';
              });
          }
        });
    }
  }

  //creates the user and adds it to Firestore
  addUser() {
    this.afs
      .collection('users')
      .doc(this.signUpForm.value.username)
      .set({
        displayName: this.signUpForm.value.displayName,
        username: this.signUpForm.value.username,
        photoUrl: this.picUrl,
        timestamp: Date.now(),
        recipes: [],
        wishlist: [],
        shoppinglist: new Object(),
        following: [],
      })
      .catch(err => {
        this.fAuth.currentUser.then(user => {
          if (user !== null) {
            user.delete();
          }
          this.error = 'Please try again.';
        });
      });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
