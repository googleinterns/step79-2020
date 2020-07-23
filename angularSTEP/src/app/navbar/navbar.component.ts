import { Component, OnInit } from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';
import { Router } from '@angular/router';

const searchClient = algoliasearch(
  'V08ADOG4XV',
  'ecb34c8995e01645a76f886db732f9dd'
);

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  config = {
    indexName: 'user_search',
    searchClient
  };

  constructor(private router: Router) {}

  public searchParameters = {
    query: ''
  };

  public setQuery({ query }: { query: string }) {
    console.log(query)
    this.searchParameters.query = query;
    this.router.navigate(['/discover'], { queryParams: { q: this.searchParameters.query } })
  }
  
  ngOnInit() {}
}
