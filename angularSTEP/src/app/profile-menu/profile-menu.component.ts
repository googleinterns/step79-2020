import {Component, Input, OnInit} from '@angular/core';

import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

interface UserData {
  displayName: string;
  username: string;
  picUrl: string;
}

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent implements OnInit {
  @Input() user!: UserData;
  username = '';
  displayName = '';
  picUrl = 'assets/images/blank-profile.png';
  loggedIn = true;

  constructor(public fAuth: AngularFireAuth, public router: Router) {
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }

  ngOnInit(): void {
    this.displayName = this.user.displayName;
    this.username = this.user.username;
    this.picUrl = this.user.picUrl;
  }

  logout() {
    this.fAuth.signOut();
    this.loggedIn = false;
  }

  signIn() {
    this.router.navigate(['/login']);
  }
}
