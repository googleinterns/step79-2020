import { Component, OnInit, Input } from '@angular/core';

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
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {

  @Input() user: any;
  username: string;
  displayName: string;
  picUrl: string;

  constructor() {}

  ngOnInit(): void {
    this.displayName = this.user.displayName;
    this.username = this.user.username;
    this.picUrl = this.user.photo;
  }
}
