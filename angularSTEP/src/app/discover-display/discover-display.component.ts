import {Component, OnInit, Input, SimpleChanges} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Router} from '@angular/router'
import {User} from '../user';
import {Converter} from '../converter';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter'

@Component({
  selector: 'app-discover-display',
  templateUrl: './discover-display.component.html',
  styleUrls: ['./discover-display.component.scss'],
})
export class DiscoverDisplayComponent implements OnInit {
  recipeCollection: AngularFirestoreCollection<Recipe> = this.afs.collection(
    'recipes'
  );
  recipes: firebase.firestore.QueryDocumentSnapshot<Recipe>[];

  userCollection: AngularFirestoreCollection<User> = this.afs.collection(
    'users'
  );
  users: firebase.firestore.QueryDocumentSnapshot<User>[];
  @Input() sortType: string;
  @Input() contentType: string;
  @Input() direction: string;
  @Input() query: string;

  constructor(private afs: AngularFirestore, private router: Router) {}

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

  getRecipes() {
    if(this.query){
      this.recipeCollection.ref
              .where('tags', 'array-contains', this.query)
              .withConverter(new RecipeConverter().recipeConverter)
              .get()
              .then(recipes => {
                this.recipes = recipes.docs;
              });
    } else {
      switch (this.sortType) {
        case 'Time Created': {
          this.getDocs('recipes', 'timestamp', this.direction ? 'asc' : 'desc');
          break;
        }
        case 'Rating': {
          this.getDocs('recipes', 'averageRating', this.direction ? 'desc' : 'asc');
          break;
        }
        case 'Name': {
          this.getDocs('recipes', 'recipeName', this.direction ? 'desc' : 'asc');
          break;
        }
      }
    }
  }

  getUsers() {
    switch (this.sortType) {
      case 'Time Created': {
        this.getDocs('users', 'timestamp', this.direction ? 'asc' : 'desc');
        break;
      }
      case 'Name': {
        this.getDocs('users', 'displayName', this.direction ? 'desc' : 'asc');
        break;
      }
    }
  }

  getDocs(type: string, sort: string, direction: firebase.firestore.OrderByDirection) {
    switch (type) {
      case 'recipes': {
        this.recipeCollection.ref
          .orderBy(sort, direction)
          .withConverter(new RecipeConverter().recipeConverter)
          .get()
          .then(recipes => {
            this.recipes = recipes.docs;
          });
        break;
      }
      case 'users': {
        this.userCollection.ref
          .orderBy(sort, direction)
          .withConverter(new Converter().userConverter)
          .get()
          .then(users => {
            this.users = users.docs;
          });
      }
    }
  }

  goToUser(username: string) {
    console.log(username)
    this.router.navigate(['discover/users/' + username]);
  }

  goToRecipe(id: string) {
    if(id){
      this.router.navigate(['discover/recipes', id]);
    }
  }
}
