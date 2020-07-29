"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
let RecipesComponent = class RecipesComponent {
    constructor(db, router) {
        this.db = db;
        this.router = router;
        this.id = '';
        this.recipesCollection = this.db.collection('recipes');
        this.recipes = this.recipesCollection.snapshotChanges().pipe(operators_1.map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return Object.assign({ id }, data);
        })));
    }
    goToRecipe(id) {
        this.router.navigate(['/recipes', id]);
    }
};
RecipesComponent = __decorate([
    core_1.Component({
        selector: 'app-recipes',
        templateUrl: './recipes.component.html',
        styleUrls: ['./recipes.component.scss'],
    })
], RecipesComponent);
exports.RecipesComponent = RecipesComponent;
//# sourceMappingURL=recipes.component.js.map