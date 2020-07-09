import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Converter} from '../converter';
import {Router} from '@angular/router';
import {User} from '../user';

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
    public fAuth: AngularFireAuth,
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
  addUser(dName: string, email: string) {
    this.afs
      .collection('users')
      .doc(this.usernameForm.value.username)
      .ref.withConverter(new Converter().converter)
      .set(
        new User(
          this.usernameForm.value.username,
          dName,
          email,
          this.picUrl,
          [],
          Date.now(),
          [],
          [],
          new Object()
        )
      );
    this.router.navigate(['/home']);
  }

  //when form is submitted, if it is valid, checks if the username exists in Firestore. Then, if not,
  //creates a user and updates the "displayName" of the user authentication to the username
  onSubmit() {
    if (!this.usernameForm.valid) {
      this.error = 'Please make sure the form is filled out correctly';
    } else {
      this.afs
        .doc('/users/' + this.usernameForm.value.username + '/')
        .ref.get()
        .then(doc => {
          if (doc.exists) {
            this.error =
              'Username ' +
              this.usernameForm.value.username +
              ' already taken.';
          } else {
            this.fAuth.currentUser
              .then(user => {
                if (user === null) {
                  this.error = 'Could not create user. Please try again.';
                } else {
                  const dName =
                    user.displayName !== null ? user.displayName : '';
                  const email = user.email !== null ? user.email : '';
                  this.picUrl = user.photoURL !== null ? user.photoURL : '';
                  user
                    .updateProfile({
                      displayName: this.usernameForm.value.username,
                    })
                    .then(success => {
                      if (dName !== '' && email !== '') {
                        this.addUser(dName, email);
                      } else {
                        this.error = 'Could not create user. Please try again.';
                        this.fAuth.currentUser.then(user => {
                          if (user !== null) {
                            user.delete();
                          }
                        });
                      }
                    })
                    .catch(err => {
                      this.error = 'Could not add user. Please try again.';
                    });
                }
              })
              .catch(error => {
                this.error = 'Could not create user. Please try again.';
                this.fAuth.currentUser.then(user => {
                  if (user !== null) {
                    user.delete();
                  }
                });
              });
          }
        });
    }
  }
}
