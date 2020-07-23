import {Component, OnInit} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {User} from '../user'
import {Converter} from '../converter'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  userCollection: AngularFirestoreCollection<User> = this.afs.collection('users');
  newUsers: firebase.firestore.QueryDocumentSnapshot<User>[];
  topRecipes: firebase.firestore.QueryDocumentSnapshot<User>[];
  newRecipes: firebase.firestore.QueryDocumentSnapshot<User>[];

  constructor(private afs: AngularFirestore) {
    this.userCollection.ref.orderBy("timestamp", "desc").limit(4).withConverter(new Converter().userConverter).get().
        then((users) => {
          this.newUsers = users.docs;
        });
    //temporary until recipe card gets made.
    this.userCollection.ref.orderBy("timestamp", "asc").limit(4).withConverter(new Converter().userConverter).get().
        then((users) => {
          this.topRecipes = users.docs;
        });
    this.userCollection.ref.orderBy("username", "desc").limit(4).withConverter(new Converter().userConverter).get().
        then((users) => {
          this.newRecipes = users.docs;
        });
  }

  ngOnInit() {}
}
