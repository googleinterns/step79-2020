import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) {}
  
  public handleChange($event: KeyboardEvent) {
    if($event.key === 'Enter'){
      this.router.navigate(['/discover/recipes'], { queryParams: { q : ($event.target as HTMLInputElement).value}});
      ($event.target as HTMLInputElement).value= '';
    }
  }
  
  ngOnInit() {}
}
