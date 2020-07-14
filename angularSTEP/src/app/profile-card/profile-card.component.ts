import { Component, Input, OnInit } from '@angular/core';

interface UserData {
  displayName: string;
  username: string;
  picUrl: string;
}

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent implements OnInit {
  @Input() user!: UserData;
  username = '';
  displayName = '';
  picUrl = '';

  constructor() {}

  ngOnInit(): void {
    if (this.user !== null) {
      this.displayName = this.user.displayName;
      this.username = this.user.username;
      this.picUrl = this.user.picUrl;
    }
  }
}
