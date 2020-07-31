import {Component, OnInit, ViewChild, NgZone} from '@angular/core';
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
  configUsers = {
    indexName: 'user_search',
    searchClient,
  };

  configRecipes = {
    indexName: 'recipe_search',
    searchClient,
  };

  @ViewChild('recipePanel') sortPanel: MatExpansionPanel;

  typesOfSearch = ['Recipes', 'Users'];
  typesOfRecipeSorts = ['Time Created', 'Number of Ingredients', 'Rating'];
  typesOfUserSorts = ['Time Created', 'Number of Recipes', 'Name'];

  showResults = false;
  isChecked: boolean = false;

  searchOption: string[] = ['Recipes'];
  recipeOption: string[] = ['Time Created'];
  userOption: string[] = ['Time Created'];

  constructor(private router: Router, private zone: NgZone, private activatedRoute: ActivatedRoute) {}
  
  ngOnInit(){
    this.activatedRoute.paramMap.subscribe(params => {
      const type = params.get('type')
      if(type == 'recipes'){
        this.searchOption = ['Recipes'];
      } else if (type == 'users') {
        this.searchOption = ['Users'];
      }
    })
    
  }

  onSearchChanged(event) {
    this.showResults = false;
    this.router.navigate(['discover/' + this.searchOption[0].toLowerCase()]);
  }

  onRecipeSortChanged(event) {}

  onUserSortChanged(event) {}

  goToUser(username: string) {
    console.log(username)
    this.router.navigate(['discover/users/' + username]);
  }

  goToRecipe(id: string) {
    this.router.navigate(['/recipes', id]);
  }

  displayResults(noQuery: boolean) {
    if (!noQuery) {
      this.sortPanel.close();
    }
    this.showResults = !noQuery;
  }
}
