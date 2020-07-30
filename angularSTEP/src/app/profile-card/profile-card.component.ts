import {Component, Input, OnInit} from '@angular/core';

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
  displayName: string;
  constructor() {}

  ngOnInit(): void {
    this.displayName = this.user.displayName;
    this.shortenDisplayName();
  }

  shortenDisplayName(){
    if(this.displayName.length > 16){
      this.displayName = this.displayName.substring(0, 13) + '...';
    }
  }
}
