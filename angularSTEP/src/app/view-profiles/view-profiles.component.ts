import {Component, OnInit} from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';
import {environment} from '../../environments/environment'

import {Router} from '@angular/router';

const searchClient = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);

@Component({
  selector: 'app-view-profiles',
  templateUrl: './view-profiles.component.html',
  styleUrls: ['./view-profiles.component.scss'],
})
export class ViewProfilesComponent implements OnInit {

  config = {
    indexName: 'user_search',
    searchClient
  };

  constructor(private router: Router) {}

  goToUser(username: string) {
    this.router.navigate(['users/' + username]);
  }

  ngOnInit() {}
}
