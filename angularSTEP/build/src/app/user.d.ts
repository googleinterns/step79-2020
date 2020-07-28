export declare class User {
    username: string;
    uid: string;
    displayName: string;
    email: string;
    picUrl: string;
    following: Array<string>;
    time: number;
    recipes: Array<string>;
    wishlist: Array<string>;
    shoppingList: object;
    aboutme: string;
    constructor(username: string, uid: string, displayName: string, email: string, picUrl: string, following: Array<string>, time: number, recipes: Array<string>, wishlist: Array<string>, shoppingList: object, aboutme: string);
}
export declare class Username {
    username: string;
    uid: string;
    constructor(username: string, uid: string);
}
