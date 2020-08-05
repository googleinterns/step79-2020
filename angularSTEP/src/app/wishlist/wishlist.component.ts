import {AngularFirestore} from '@angular/fire/firestore';
import {Component, OnInit, Input, NgZone} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../user';
import {Converter} from '../converter';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';
import {Router} from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  @Input() userData!: User;
  myRecipes: Recipe[] = [];

  constructor(private afs: AngularFirestore, 
              private fAuth: AngularFireAuth, 
              private zone: NgZone, 
              private router: Router) { }

  ngOnInit() {
    this.getWishlist();
  }

  async getWishlist(){
    if(this.userData && this.userData.wishlist){
      for(let i = 0; i < this.userData.wishlist.length; i++){
        const recipe = await this.afs
              .collection('recipes')
              .doc(this.userData.wishlist[i])
              .ref.withConverter(new RecipeConverter().recipeConverter).get();
        if(recipe && recipe.data()){
          this.myRecipes.push(recipe.data()!);
        }
      }
    }
  }

  goToRecipe(username: string) {
    this.zone.run(() => {
      this.router.navigate(['discover/recipes', username]);
    })
  }

}
