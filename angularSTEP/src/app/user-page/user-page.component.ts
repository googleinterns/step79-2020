import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  username: string = '';
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const username = this.activatedRoute.snapshot.paramMap.get('username');
    if(username == null){
      this.router.navigate(['/users']);
    } else {
      this.username = username;
    }
  }

}
