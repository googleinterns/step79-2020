// Copyright 2020 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
  query: string = '';

  configUsers: object;
  configRecipes: object;

  @ViewChild('recipePanel') sortPanel: MatExpansionPanel;
  @ViewChild('tagPanel') tagPanel: MatExpansionPanel;

  tagSearch: FormGroup;

  typesOfSearch = ['Recipes', 'Users'];
  typesOfRecipeSorts = ['Time Created', 'Rating', 'Name'];
  typesOfUserSorts = ['Time Created', 'Name'];

  tagQuery = '';

  showResults: boolean = false;
  isChecked: boolean = false;

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
        const sort = this.activatedRoute.snapshot.queryParamMap.get("sort");
        console.log(sort);
        if (sort === 'rating') {
          this.recipeOption = ['Rating'];
        } else if (sort === 'timestamp') {
          this.recipeOption = ['Time Created'];
        } else if (sort === 'name') {
          this.recipeOption = ['Name'];
        } 
      } else if (type === 'users') {
        this.searchOption = ['Users'];
        const sort = this.activatedRoute.snapshot.queryParamMap.get("sort");
        if (sort === 'timestamp') {
          this.recipeOption = ['Time Created'];
        } else if (sort === 'name') {
          this.recipeOption = ['Name'];
        } 
      }
    })
    this.activatedRoute.queryParams.subscribe(params => {
      this.query = params['q'] ? params['q'] : '';
      this.configUsers = {
        indexName: 'user_search',
        searchClient
      };
      if(this.query){
        this.searchOption = ['Recipes'];
        this.configRecipes = {
          indexName: 'recipe_search',
          searchClient,
          searchParameters: {
            query: this.query
          }
        };
        this.showResults = true;
      } else {
        this.configRecipes = {
          indexName: 'recipe_search',
          searchClient
        };
        this.showResults = false;
      }
    })
  }

  onSearchChanged(event: any) {
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
    if (!noQuery && this.sortPanel) {
      this.sortPanel.close();
      if(this.searchOption === ['Recipes']){
        this.tagPanel.close();
      }
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
