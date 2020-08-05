"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const recipe_converter_1 = require("../recipe-converter");
const converter_1 = require("../converter");
const dialog_1 = require("@angular/material/dialog");
const item_dialog_component_1 = require("../item-dialog/item-dialog.component");
let RecipePageComponent = class RecipePageComponent {
    constructor(db, route, fAuth, dialog) {
        this.db = db;
        this.route = route;
        this.fAuth = fAuth;
        this.dialog = dialog;
        this.id = this.route.snapshot.paramMap.get('id');
        this.setRecipeData();
        this.fAuth.currentUser.then(user => {
            if (user) {
                this.setUserData(user.uid);
            }
        });
    }
    setRecipeData() {
        return __awaiter(this, void 0, void 0, function* () {
            const postRecipe = yield this.db.doc('/recipes/' + this.id + '/')
                .ref.withConverter(new recipe_converter_1.RecipeConverter().recipeConverter).get();
            const recipeClassData = postRecipe.data();
            if (recipeClassData) {
                this.pageRecipe = recipeClassData;
            }
        });
    }
    setUserData(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const postUser = yield this.db.doc('/users/' + uid + '/')
                .ref.withConverter(new converter_1.Converter().userConverter).get();
            if (postUser.data()) {
                this.user = postUser.data();
            }
        });
    }
    objToMap(obj) {
        const mp = new Map();
        Object.keys(obj).forEach(k => { mp.set(k, obj[k]); });
        return mp;
    }
    addItem(item) {
        var currentShoppingList = this.objToMap(this.user.shoppingList);
        const dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.height = 'auto';
        dialogConfig.width = 'auto';
        dialogConfig.data = {
            selectedItem: item,
            add: true,
            remove: false,
            max: 0,
        };
        const dialogRef = this.dialog.open(item_dialog_component_1.ItemDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (currentShoppingList.has(item)) {
                    var currentValue = currentShoppingList.get(item);
                    if (currentValue) {
                        currentShoppingList.set(item, (currentValue + result));
                    }
                }
                else {
                    currentShoppingList.set(item, result);
                }
                let objectCurrentShoppingList = Array.from(currentShoppingList).reduce((objectCurrentShoppingList, [key, value]) => (Object.assign(objectCurrentShoppingList, { [key]: value })), {});
                this.fAuth.currentUser.then(user => {
                    if (user) {
                        this.db.collection('users')
                            .doc(this.user.uid)
                            .ref.withConverter(new converter_1.Converter().userConverter)
                            .update({ shoppingList: objectCurrentShoppingList })
                            .then(() => {
                            this.setUserData(user.uid);
                        });
                    }
                });
            }
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