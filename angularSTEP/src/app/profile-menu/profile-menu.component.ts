import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent implements OnInit {

  @Input() user: any;
  username: string;
  displayName: string;
  picUrl: string;
  //fixed value for now - implement input to show if user is actually signed in
  loggedIn: boolean;

  constructor() {}

  ngOnInit(): void {
    this.displayName = this.user.displayName;
    this.username = this.user.username;
    this.picUrl = this.user.picUrl;
    this.loggedIn = this.user.loggedIn;
  }

  //temporary logout and signin functions
  logout(){
    this.loggedIn = !this.loggedIn;
  }

  signIn(){
    this.loggedIn = !this.loggedIn;
  }

}
