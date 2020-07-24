import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {
  error = '';
  hide: boolean;
  logInForm: FormGroup;

  constructor(
    private fAuth: AngularFireAuth,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.hide = true;
    this.logInForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.router.navigate(['/home']);
      }
    });
  }

  //set up reactive form
  ngOnInit() {}

  //sign in to account with email and password
  onSubmit() {
    this.fAuth
      .signInWithEmailAndPassword(
        this.logInForm.value.email,
        this.logInForm.value.password
      )
      .then(success => {
        this.router.navigate(['/home']);
      })
      .catch(err => {
        this.error = 'Email and/or password may be invalid.';
      });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
