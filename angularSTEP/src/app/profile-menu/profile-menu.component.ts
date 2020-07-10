import {Component, Input, OnInit} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import {AngularFireAuth} from '@angular/fire/auth';
import {Router, NavigationStart, NavigationEnd} from '@angular/router';
import { User } from '../user';
import {Converter} from '../converter';
import { HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';


@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent implements OnInit {
  user!: User;
  username = '';
  displayName = '';
  picUrl = 'assets/images/blank-profile.png';
  loggedIn = false;

  constructor(public fAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore) {
    //checks if Authentication has changed, if user signs in through email
    //it should update menu. If user signs in through google sign-in and is a new
    //user, it won't sign them in until they make a username.
    this.fAuth.onAuthStateChanged(auth => {
        if (auth && (this.router.url !== '/username-setup' && this.router.url !== '/login')) {
          this.loggedIn = false;
          this.username = auth.displayName !== null ? auth.displayName : '';
          this.setUserData();
        } else {
          this.lookForRouterChange();
          this.loggedIn = false;
          this.username = '';
          this.picUrl = 'assets/images/blank-profile.png';
        }
      })
   
  }

  ngOnInit(): void {
  }

  //detects route change if router has changed from setting up username.
  //If it has, and the user is not signed it, it will update the menu component 
  lookForRouterChange(){
    if (this.router.url == '/login' || this.router.url == '/username-setup'){
      console.log("hi");
      this.router.events.forEach((event) => {
        if(event instanceof NavigationEnd){
          if(this.router.url !== '/username-setup' && this.router.url !== '/login'){
            this.fAuth.currentUser.then(user => {
              if(user){
                  this.loggedIn = false;
                  this.username = user.displayName !== null ? user.displayName : '';
                  this.setUserData();
                  this.loggedIn = false;
              }
            })
          }
        }
      })
    }
  }


  logout() {
    this.loggedIn = false;
    this.username = '';
    this.displayName = '';
    this.picUrl = 'assets/images/blank-profile.png';
    this.fAuth.signOut();
  }

  signIn() {
    this.router.navigate(['/login']);
  }

  //this method sets the users data and then injects it
  //into the profile menu dropdown. It waits until all of the
  //information is set and then displays the menu.
  async setUserData() {
    const postUser = await this.afs
      .doc('/users/' + this.username + '/')
      .ref.withConverter(new Converter().converter)
      .get();
    if (postUser.data()) {
      this.user = postUser.data()!;
      this.displayName = this.user.displayName !== null ? this.user.displayName : '';
      this.picUrl =
        this.user.picUrl !== null && this.user.picUrl !== ''
          ? this.user.picUrl
          : 'assets/images/blank-profile.png';
      this.loggedIn = true;
    } else{
      this.fAuth.currentUser.then(user => {
        if(user){
          user.delete();
        }
      })
    }
  }
}
