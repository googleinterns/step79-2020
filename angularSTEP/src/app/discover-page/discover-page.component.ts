import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';
import {environment} from '../../environments/environment'
import {MatExpansionPanel} from '@angular/material/expansion';

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

  @ViewChild("recipePanel") sortPanel: MatExpansionPanel;

  typesOfSearch = ["Recipes", "Users"]
  typesOfRecipeSorts = ["Time Created", "Number of Ingredients", "Rating"];
  typesOfUserSorts = ["Time Created", "Number of Recipes", "Name"];

  showResults = false;
  isChecked: boolean;
  
  searchOption: string[] = ["Recipes"];
  recipeOption: string[] = ["Time Created"];
  userOption: string[] = ["Time Created"];

  constructor(private router: Router) {

  }

  onSearchChanged(event){
    console.log(this.searchOption);
  }

  onRecipeSortChanged(event){
    console.log(event[0]);
  }

  onUserSortChanged(event){
    console.log(event[0]);
  }

  goToUser(username: string) {
    this.router.navigate(['users/' + username]);
  }

  displayResults(noQuery: boolean){
    if(!noQuery){
      this.sortPanel.close();
    }
    this.showResults = !noQuery;
  }

  ngOnInit(): void {
    
  }

}
