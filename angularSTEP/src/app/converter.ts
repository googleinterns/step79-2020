import { QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';

import { User, Username } from './user';

//This class is what holds the firebase converter. This
//converter is what you need to include when reading a document
//from Firestore. It tells it how to convert to document into a class
export class Converter {
  public userConverter = {
    toFirestore: function (user: User) {
      return {
        displayName: user.displayName,
        uid: user.uid,
        username: user.username,
        email: user.email,
        picUrl: user.picUrl,
        time: user.time,
        recipes: user.recipes,
        wishlist: user.wishlist,
        shoppingList: user.shoppingList,
        following: user.following,
        aboutme: user.aboutme
      };
    },
    fromFirestore: function (
      snapshot: QueryDocumentSnapshot<User>,
      options: SnapshotOptions
    ) {
      const data = snapshot.data(options);
      return new User(
        data.username,
        data.uid,
        data.displayName,
        data.email,
        data.picUrl,
        data.following,
        data.time,
        data.recipes,
        data.wishlist,
        data.shoppingList,
        data.aboutme
      );
    },
  };

  public usernameConverter = {
    toFirestore: function (username: Username) {
      return {
        uid: username.uid,
        username: username.username,
      };
    },
    fromFirestore: function (
      snapshot: QueryDocumentSnapshot<User>,
      options: SnapshotOptions
    ) {
      const data = snapshot.data(options);
      return new Username(
        data.username,
        data.uid
      );
    },
  };
}
