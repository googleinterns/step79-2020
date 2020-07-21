import {Component, OnInit} from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';
import {environment} from '../../environments/environment'

import {Router} from '@angular/router';

const searchClient = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);
@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrls: ['./discover-page.component.scss']
})
export class DiscoverPageComponent implements OnInit {

  config = {
    indexName: 'user_search',
    searchClient
  };

  typesOfSearch = ["All", "Recipes", "Tags", "Users"];

  typesOfRecipeSorts = ["Time Created", "Number of Ingredients", "Name"];
  typesOfUserSorts = ["Time Created", "Number of Recipes", "Name"];

  showResults = false;
  searchType: string;
  constructor(private router: Router) { }

  goToUser(username: string) {
    this.router.navigate(['users/' + username]);
  }

  displayResults(noQuery: boolean){
    this.showResults = !noQuery;
  }

  ngOnInit(): void {
  }

}
