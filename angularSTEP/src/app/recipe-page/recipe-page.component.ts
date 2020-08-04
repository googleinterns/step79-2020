import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';
import {User} from '../user';
import {Converter} from '../converter';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss']
})

export class RecipePageComponent {
  id: string | null = this.route.snapshot.paramMap.get('id');
  pageRecipe!: Recipe;
  signedIn: boolean = false;
  currentRating: number = 0;
  currentRatings: object = {};

  constructor(private db: AngularFirestore,
              private route: ActivatedRoute, private fAuth: AngularFireAuth) {}

  ngOnInit() {
    this.setRecipeData();
  }

  async setRecipeData() {
    const postRecipe = await this.db.doc('/recipes/' + this.id + '/').ref.withConverter(new RecipeConverter().recipeConverter).get();
    const recipeClassData = postRecipe.data();
    if (recipeClassData) {
      this.pageRecipe = recipeClassData;
      if(this.pageRecipe.ratings){
        this.currentRatings = this.pageRecipe.ratings;
      }
    }
    this.fAuth.onAuthStateChanged(async user => {
      if(user) {
        this.signedIn = true;
        if(this.currentRatings && this.currentRatings.hasOwnProperty(user.uid)){
          this.currentRating = this.currentRatings[user.uid];
        } else {
          this.currentRating = 0;
        }
      } else {
        this.signedIn = false;
      }
    })
  } 

  updateRating(rating: number){
    this.fAuth.currentUser.then(user => {
      if(this.signedIn && user) {
        this.currentRatings[user.uid] = rating;
        this.db
            .collection('recipes')
            .doc(this.id)
            .ref.withConverter(new RecipeConverter().recipeConverter)
            .update({ratings: this.currentRatings})
      }
    })
  }
}