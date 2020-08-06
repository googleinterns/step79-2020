import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

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
      username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(12), noSpaces]],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(255)]],
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
      const username = this.formatUsername(this.signUpForm.value.username);
      this.afs
        .doc('/usernames/' + username + '/')
        .ref.get()
        .then(doc => {
          if (doc.exists) {
            this.error =
              'Username ' + username + ' already taken.';
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
                  this.addUser(success.user.uid, username);
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
  addUser(uid: string, username: string) {
    return this.afs
          .collection('users')
          .doc(uid)
          .ref.withConverter(new Converter().userConverter)
          .set(
            new User(
              username,
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
            .doc(username)
            .ref.withConverter(new Converter().usernameConverter)
            .set(new Username(username, uid))
            .then(() => {
              this.router.navigate(['/home']);
          });
      });
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  // formats the username to take out spaces just in case and
  //makes username lowercase
  formatUsername(username: string) {
    const formattedUsername = username.replace(" ", "");
    if(formattedUsername.length > 12) {
      formattedUsername.slice(0, 12);
    }
    return formattedUsername.toLowerCase();
  }
}

//makes sure there are no spaces in the username
function noSpaces(control: FormControl){
  const username = control.value;
  if (username && username.indexOf(' ') > -1){
    return {spaces: true}
  }
  return null;
}
