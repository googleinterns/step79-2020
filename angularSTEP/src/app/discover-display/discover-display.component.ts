import {Component, OnInit, Input, SimpleChanges} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {User} from '../user';
import {Converter} from '../converter';

@Component({
  selector: 'app-discover-display',
  templateUrl: './discover-display.component.html',
  styleUrls: ['./discover-display.component.scss'],
})
export class DiscoverDisplayComponent implements OnInit {
  userCollection: AngularFirestoreCollection<User> = this.afs.collection(
    'users'
  );
  users: firebase.firestore.QueryDocumentSnapshot<User>[];
  @Input() sortType: string;
  @Input() contentType: string;
  @Input() direction: string;

  constructor(private afs: AngularFirestore) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.sortType) {
      this.sortType = changes.sortType.currentValue;
    }
    if (changes && changes.contentType) {
      this.contentType = changes.contentType.currentValue;
    }
    if (changes && changes.direction) {
      this.direction = changes.direction.currentValue;
    }
    this.getCollectionData();
  }

  ngOnInit() {}

  getCollectionData() {
    if (this.sortType && this.contentType && this.direction !== undefined) {
      switch (this.contentType) {
        case 'Recipes': {
          this.getRecipes();
          break;
        }
        case 'Users': {
          this.getUsers();
          break;
        }
        default: {
          this.getRecipes();
        }
      }
    }
  }

  getRecipes() {}

  getUsers() {
    switch (this.sortType) {
      case 'Time Created': {
        if (this.direction) {
          this.userCollection.ref
            .orderBy('timestamp', 'asc')
            .withConverter(new Converter().userConverter)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        } else {
          this.userCollection.ref
            .orderBy('timestamp', 'desc')
            .withConverter(new Converter().userConverter)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        }
        break;
      }
      case 'Number of Recipes': {
        //temporary until num of recipes are actually added
        if (this.direction) {
          this.userCollection.ref
            .orderBy('displayName', 'desc')
            .withConverter(new Converter().userConverter)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        } else {
          this.userCollection.ref
            .orderBy('displayName', 'asc')
            .withConverter(new Converter().userConverter)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        }
        break;
      }
      case 'Name': {
        if (this.direction) {
          this.userCollection.ref
            .orderBy('displayName', 'desc')
            .withConverter(new Converter().userConverter)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        } else {
          this.userCollection.ref
            .orderBy('displayName', 'asc')
            .withConverter(new Converter().userConverter)
            .get()
            .then(users => {
              this.users = users.docs;
            });
        }
        break;
      }
    }
  }
}
