//User class that resembles the documents
//in the Users collection on Firestore
export class User {
  username: string;
  displayName: string;
  email: string;
  picUrl: string;
  following: Array<string>;
  time: number;
  recipes: Array<string>;
  wishlist: Array<string>;
  shoppingList: object;
  constructor(
    username: string,
    displayName: string,
    email: string,
    picUrl: string,
    following: Array<string>,
    time: number,
    recipes: Array<string>,
    wishlist: Array<string>,
    shoppingList: object
  ) {
    this.username = username;
    this.displayName = displayName;
    this.email = email;
    this.picUrl = picUrl;
    this.following = following;
    (this.time = time), (this.recipes = recipes);
    this.wishlist = wishlist;
    this.shoppingList = shoppingList;
  }
}
