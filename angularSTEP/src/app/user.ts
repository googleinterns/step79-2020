//User class that resembles the documents
//in the Users collection on Firestore
export class User {
  constructor(
    public username: string,
    public uid: string,
    public displayName: string,
    public email: string,
    public picUrl: string,
    public following: Array<string>,
    public time: number,
    public recipes: Array<string>,
    public wishlist: Array<string | null>,
    public shoppingList: Object,
    public aboutme: string
  ) {
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

export class Username {
  constructor(
    public username: string,
    public uid: string){
      this.username = username;
      this.uid = uid;
    }
}
