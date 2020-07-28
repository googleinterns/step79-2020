"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
//This class is what holds the firebase converter. This
//converter is what you need to include when reading a document
//from Firestore. It tells it how to convert to document into a class
class Converter {
    constructor() {
        this.userConverter = {
            toFirestore: function (user) {
                return {
                    displayName: user.displayName,
                    uid: user.uid,
                    username: user.username,
                    email: user.email,
                    picUrl: user.picUrl,
                    timestamp: user.time,
                    recipes: user.recipes,
                    wishlist: user.wishlist,
                    shoppingList: user.shoppingList,
                    following: user.following,
                    aboutme: user.aboutme
                };
            },
            fromFirestore: function (snapshot, options) {
                const data = snapshot.data(options);
                return new user_1.User(data.username, data.uid, data.displayName, data.email, data.picUrl, data.following, data.time, data.recipes, data.wishlist, data.shoppingList, data.aboutme);
            },
        };
        this.usernameConverter = {
            toFirestore: function (username) {
                return {
                    uid: username.uid,
                    username: username.username,
                };
            },
            fromFirestore: function (snapshot, options) {
                const data = snapshot.data(options);
                return new user_1.Username(data.username, data.uid);
            },
        };
    }
}
exports.Converter = Converter;
//# sourceMappingURL=converter.js.map