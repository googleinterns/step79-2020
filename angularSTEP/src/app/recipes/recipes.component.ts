import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Recipe} from '../recipe';
 
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
  
export class RecipesComponent {
  recipes: Observable<Recipe[]>;

  constructor(private db: AngularFirestore,
              private router: Router,) {
                this.recipes = this.db.collection<Recipe>('recipes').valueChanges({idField: 'id'});
  }
  
  goToRecipe(id: string) {
    this.router.navigate(['/recipes', id]);
  }
}
