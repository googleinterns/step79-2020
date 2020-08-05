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
const converter_1 = require("../converter");
const dialog_1 = require("@angular/material/dialog");
const item_dialog_component_1 = require("../item-dialog/item-dialog.component");
let ShoppingListComponent = class ShoppingListComponent {
    constructor(db, fAuth, dialog) {
        this.db = db;
        this.fAuth = fAuth;
        this.dialog = dialog;
        this.shoppingListMap = new Map();
        this.fAuth.currentUser.then(user => {
            if (user) {
                this.setUserData(user.uid);
            }
        });
    }
    ngOnInit() {
    }
    setUserData(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const postUser = yield this.db.doc('/users/' + uid + '/')
                .ref.withConverter(new converter_1.Converter().userConverter).get();
            if (postUser.data()) {
                this.user = postUser.data();
                this.shoppingListMap = this.objToMap(this.user.shoppingList);
                if (!this.shoppingListMapKeys) {
                    this.shoppingListMapKeys = Array.from(this.shoppingListMap.keys());
                }
            }
        });
    }
    objToMap(obj) {
        const mp = new Map;
        Object.keys(obj).forEach(k => { mp.set(k, obj[k]); });
        return mp;
    }
    removeMultiple(key) {
        const currentValue = this.shoppingListMap.get(key);
        const dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.height = 'auto';
        dialogConfig.width = 'auto';
        dialogConfig.data = {
            selectedItem: key,
            max: currentValue,
            add: false,
            remove: true,
        };
        const dialogRef = this.dialog.open(item_dialog_component_1.ItemDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result && currentValue) {
                let difference = currentValue - result;
                if (difference === 0) {
                    this.shoppingListMap.delete(key);
                    let index = this.shoppingListMapKeys.indexOf(key);
                    this.shoppingListMapKeys.splice(index, 1);
                }
                else {
                    if (currentValue) {
                        this.shoppingListMap.set(key, (currentValue - result));
                    }
                }
                let objectUpdatedShoppingList = Array.from(this.shoppingListMap).reduce((objectUpdatedShoppingList, [key, value]) => (Object.assign(objectUpdatedShoppingList, { [key]: value })), {});
                this.fAuth.currentUser.then(user => {
                    if (user) {
                        this.db.collection('users')
                            .doc(this.user.uid)
                            .ref.withConverter(new converter_1.Converter().userConverter)
                            .update({ shoppingList: objectUpdatedShoppingList })
                            .then(() => {
                            this.setUserData(user.uid);
                        });
                    }
                });
            }
        });
    }
    removeItem(key) {
        if (this.shoppingListMap.get(key) === 1) {
            this.shoppingListMap.delete(key);
            let index = this.shoppingListMapKeys.indexOf(key);
            this.shoppingListMapKeys.splice(index, 1);
        }
        else {
            let currentValue = this.shoppingListMap.get(key);
            if (currentValue) {
                this.shoppingListMap.set(key, (currentValue - 1));
            }
        }
        let objectUpdatedShoppingList = Array.from(this.shoppingListMap).reduce((objectUpdatedShoppingList, [key, value]) => (Object.assign(objectUpdatedShoppingList, { [key]: value })), {});
        this.fAuth.currentUser.then(user => {
            if (user) {
                this.db.collection('users')
                    .doc(this.user.uid)
                    .ref.withConverter(new converter_1.Converter().userConverter)
                    .update({ shoppingList: objectUpdatedShoppingList })
                    .then(() => {
                    this.setUserData(user.uid);
                });
            }
        });
    }
};
ShoppingListComponent = __decorate([
    core_1.Component({
        selector: 'app-shopping-list',
        templateUrl: './shopping-list.component.html',
        styleUrls: ['./shopping-list.component.scss']
    })
], ShoppingListComponent);
exports.ShoppingListComponent = ShoppingListComponent;
//# sourceMappingURL=shopping-list.component.js.map