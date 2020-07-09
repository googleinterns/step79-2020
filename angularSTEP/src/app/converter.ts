import {QueryDocumentSnapshot, SnapshotOptions} from '@angular/fire/firestore';

import {User} from './user';

export class Converter {
  public converter = {
    toFirestore: function (user: User) {
      return {
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        picUrl: user.picUrl,
        timestamp: user.time,
        recipes: user.recipes,
        wishlist: user.wishlist,
        shoppingList: user.shoppingList,
        following: user.following,
      };
    },
    fromFirestore: function (
      snapshot: QueryDocumentSnapshot<User>,
      options: SnapshotOptions
    ) {
      const data = snapshot.data(options);
      return new User(
        data.username,
        data.displayName,
        data.email,
        data.picUrl,
        data.following,
        data.time,
        data.recipes,
        data.wishlist,
        data.shoppingList
      );
    },
  };
}
