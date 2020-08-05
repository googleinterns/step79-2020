import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) {}

  public searchParameters = {
    query: ''
  };

  public setQuery({ query }: { query: string }) {
    this.searchParameters.query = query;
    this.router.navigate(['/discover/recipes'], { queryParams: { q: this.searchParameters.query } })
  }
  
  ngOnInit() {}
}
