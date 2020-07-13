import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {auth} from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  error = '';
  userSetup = false;
  aboutToSetup = false;
  redirected = false;

  //checks if user is already signed in. If user is signed in
  //and there is no user in the database linked to the account
  //it will delete the user (in case user refreshes page before
  //setting a username but after signing in with Google
  constructor(public fAuth: AngularFireAuth, public router: Router) {}

  //checks if google user is new, if so, calls setup component to
  //allow the user to create a username, if not new, redirects to home page
  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    this.aboutToSetup = true;
    this.fAuth
      .signInWithPopup(provider)
      .then(success => {
        const userInfo = success.additionalUserInfo;
        if (success !== null && userInfo) {
          if (userInfo.isNewUser) {
            this.userSetup = true;
          } else {
            this.router.navigate(['/home']);
          }
        }
      })
      .catch(() => {
        this.error = 'Could not create user. Please try again.';
      });
  }

  ngOnInit(): void {}
}
