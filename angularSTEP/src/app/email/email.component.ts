import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFirestore } from  "@angular/fire/firestore";
import { Router } from  "@angular/router";

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  error: any;
  hide: boolean;
  logInForm: FormGroup;

  constructor(public fAuth: AngularFireAuth,
              private router: Router,
              private fb: FormBuilder,
              private afs: AngularFirestore) { 
    this.hide = true; 
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.router.navigate(['/home']);
      }
    })
  }

  //set up reactive form
  ngOnInit() {
    this.logInForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  //sign in to account with email and password
  onSubmit() {
      this.fAuth.signInWithEmailAndPassword(this.logInForm.value.email, 
      this.logInForm.value.password).then((success) => {
        this.router.navigate(['/home']);
      }).catch((err) => {
        this.error = "Email and/or password may be invalid.";
      })
    }

  goBack() {
    this.router.navigate(['/login']);
  }
}
