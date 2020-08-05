import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { User, Username } from './user';
export declare class Converter {
    userConverter: {
        toFirestore: (user: User) => {
            displayName: string;
            uid: string;
            username: string;
            email: string;
            picUrl: string;
            time: number;
            recipes: string[];
            wishlist: string[];
            shoppingList: object;
            following: string[];
            aboutme: string;
        };
        fromFirestore: (snapshot: QueryDocumentSnapshot<User>, options: import("firebase").firestore.SnapshotOptions) => User;
    };
    usernameConverter: {
        toFirestore: (username: Username) => {
            uid: string;
            username: string;
        };
        fromFirestore: (snapshot: QueryDocumentSnapshot<User>, options: import("firebase").firestore.SnapshotOptions) => Username;
    };
}
