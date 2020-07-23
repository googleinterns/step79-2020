import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';
import {environment} from '../../environments/environment';
import {MatExpansionPanel} from '@angular/material/expansion';

import {Router, ActivatedRoute} from '@angular/router';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);
@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrls: ['./discover-page.component.scss'],
})
export class DiscoverPageComponent implements OnInit {
  query: string = '';

  config: object;

  

  @ViewChild('recipePanel') sortPanel: MatExpansionPanel;

  typesOfSearch = ['Recipes', 'Users'];
  typesOfRecipeSorts = ['Time Created', 'Number of Ingredients', 'Rating'];
  typesOfUserSorts = ['Time Created', 'Number of Recipes', 'Name'];

  showResults = false;
  isChecked: boolean = false;

  searchOption: string[] = ['Recipes'];
  recipeOption: string[] = ['Time Created'];
  userOption: string[] = ['Time Created'];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'];
    })
  }

  onSearchChanged(event) {}

  onRecipeSortChanged(event) {}

  onUserSortChanged(event) {}

  goToUser(username: string) {
    this.router.navigate(['users/' + username]);
  }

  displayResults(noQuery: boolean) {
    this.showResults = !noQuery;
  }

  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      this.query = params['q'];
    })
    this.config = {
      indexName: 'user_search',
      searchClient,
      searchParameters: {
        query: this.query
      }
    };
  }

  ngAfterViewInit(): void {
    if (this.showResults) {
      this.sortPanel.close();
    }
    
  }
}
