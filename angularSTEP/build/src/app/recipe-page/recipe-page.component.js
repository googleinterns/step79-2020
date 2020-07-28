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
let RecipePageComponent = class RecipePageComponent {
    constructor(db, route) {
        this.db = db;
        this.route = route;
        this.id = this.route.snapshot.paramMap.get('id');
        this.recipesCollection = this.db.collection('recipes');
        this.recipes = this.recipesCollection.snapshotChanges().pipe(operators_1.map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return Object.assign({ id }, data);
        })));
        this.recipes.subscribe(value => {
            this.pageRecipe = value.find(element => element.id === this.id);
        });
    }
};
RecipePageComponent = __decorate([
    core_1.Component({
        selector: 'app-recipe-page',
        templateUrl: './recipe-page.component.html',
        styleUrls: ['./recipe-page.component.scss']
    })
], RecipePageComponent);
exports.RecipePageComponent = RecipePageComponent;
//# sourceMappingURL=recipe-page.component.js.map