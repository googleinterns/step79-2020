import { OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
export declare class WishListComponent implements OnInit {
    private fAuth;
    private db;
    userUid: string;
    constructor(fAuth: AngularFireAuth, db: AngularFirestore);
    ngOnInit(): void;
}
