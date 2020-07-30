import {Component, OnInit, NgZone} from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';
import {environment} from '../../environments/environment'
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
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

  constructor(private router: Router, private zone: NgZone) {}

  goToUser(username: string) {
    this.zone.run(() => {
      this.router.navigate(['users/', username]);
    })
  }

  ngOnInit() {}
}
