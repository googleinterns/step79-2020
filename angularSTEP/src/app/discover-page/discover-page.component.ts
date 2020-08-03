import {Component, OnInit, ViewChild, NgZone} from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';
import {environment} from '../../environments/environment';
import {MatExpansionPanel} from '@angular/material/expansion';

import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

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
  @ViewChild('tagPanel') tagPanel: MatExpansionPanel;

  tagSearch: FormGroup;

  typesOfSearch = ['Recipes', 'Users'];
  typesOfRecipeSorts = ['Time Created', 'Number of Ingredients', 'Rating'];
  typesOfUserSorts = ['Time Created', 'Number of Recipes', 'Name'];

  tagQuery = '';

  showResults = false;
  isChecked = false;

  searchOption: string[] = ['Recipes'];
  recipeOption: string[] = ['Time Created'];
  userOption: string[] = ['Time Created'];

  constructor(
    private router: Router,
    private zone: NgZone,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.tagSearch = this.fb.group({
      query: [''],
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const type = params.get('type');
      if (type === 'recipes') {
        this.searchOption = ['Recipes'];
      } else if (type === 'users') {
        this.searchOption = ['Users'];
      }
    });
  }

  onSearchChanged(event) {
    this.showResults = false;
    this.router.navigate(['discover/' + this.searchOption[0].toLowerCase()]);
    this.tagQuery = '';
    this.tagSearch.controls.query.setValue('');
  }

  onRecipeSortChanged(event) {
    this.tagQuery = '';
    this.tagSearch.controls.query.setValue('');
  }

  onUserSortChanged(event) {
    this.tagQuery = '';
    this.tagSearch.controls.query.setValue('');
  }

  goToUser(username: string) {
    console.log(username);
    this.router.navigate(['discover/users/' + username]);
  }

  goToRecipe(id: string) {
    this.tagQuery = '';
    this.tagSearch.controls.query.setValue('');
    this.router.navigate(['/recipes', id]);
  }

  displayResults(noQuery: boolean) {
    if (!noQuery) {
      this.sortPanel.close();
      this.tagPanel.close();
    }
    this.showResults = !noQuery;
  }

  checkEmpty(){
    if(this.tagSearch.controls.query.value === ''){
      this.tagQuery = '';
    }
  }

  getTags() {
    this.tagQuery = this.tagSearch.controls.query.value;
  }
}
