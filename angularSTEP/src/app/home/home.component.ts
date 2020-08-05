import {Component, OnInit, NgZone} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {User} from '../user'
import {Converter} from '../converter'
import {Recipe} from '../recipe'
import {RecipeConverter} from '../recipe-converter'
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  recipeCollection: AngularFirestoreCollection<Recipe> = this.afs.collection('recipes');
  userCollection: AngularFirestoreCollection<User> = this.afs.collection('users');
  newUsers!: firebase.firestore.QueryDocumentSnapshot<User>[];
  topRecipes!: firebase.firestore.QueryDocumentSnapshot<Recipe>[];
  newRecipes!: firebase.firestore.QueryDocumentSnapshot<Recipe>[];

  constructor(private afs: AngularFirestore, private zone: NgZone, private router: Router) {
    
    this.userCollection.ref.orderBy("time", "desc").limit(4).withConverter(new Converter().userConverter).get().
        then((user) => {
          this.newUsers = user.docs;
        });
    //timestamp for now. In future - change to 'ratings'
    this.recipeCollection.ref.orderBy("images", "asc").limit(4).withConverter(new RecipeConverter().recipeConverter).get().
        then((recipe) => {
          this.topRecipes = recipe.docs;
        });
    this.recipeCollection.ref.orderBy("timestamp", "desc").limit(4).withConverter(new RecipeConverter().recipeConverter).get().
        then((recipe) => {
          this.newRecipes = recipe.docs;
        });
  }

  ngOnInit() {}

  goToUser(username: string) {
    this.zone.run(() => {
      this.router.navigate(['users/', username]);
    })
  }
}
