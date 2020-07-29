"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let RecipeCardComponent = class RecipeCardComponent {
    ngOnInit() {
        this.recipeName = this.recipe.recipeName;
        this.description = this.recipe.description;
        this.difficulty = this.recipe.difficulty;
    }
};
__decorate([
    core_1.Input()
], RecipeCardComponent.prototype, "recipe", void 0);
RecipeCardComponent = __decorate([
    core_1.Component({
        selector: 'app-recipe-card',
        templateUrl: './recipe-card.component.html',
        styleUrls: ['./recipe-card.component.scss']
    })
], RecipeCardComponent);
exports.RecipeCardComponent = RecipeCardComponent;
//# sourceMappingURL=recipe-card.component.js.map