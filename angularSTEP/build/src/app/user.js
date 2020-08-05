"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//User class that resembles the documents
//in the Users collection on Firestore
class User {
    constructor(username, uid, displayName, email, picUrl, following, time, recipes, wishlist, shoppingList, aboutme) {
        this.username = username;
        this.uid = uid;
        this.displayName = displayName;
        this.email = email;
        this.picUrl = picUrl;
        this.following = following;
        this.time = time;
        this.recipes = recipes;
        this.wishlist = wishlist;
        this.shoppingList = shoppingList;
        this.aboutme = aboutme;
        this.username = username;
        this.uid = uid;
        this.displayName = displayName;
        this.email = email;
        this.picUrl = picUrl;
        this.following = following;
        this.time = time;
        this.recipes = recipes;
        this.wishlist = wishlist;
        this.shoppingList = shoppingList;
        this.aboutme = aboutme;
    }
}
exports.User = User;
class Username {
    constructor(username, uid) {
        this.username = username;
        this.uid = uid;
        this.username = username;
        this.uid = uid;
    }
}
exports.Username = Username;
//# sourceMappingURL=user.js.map