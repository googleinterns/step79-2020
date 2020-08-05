import { OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../user';
import { MatDialog } from "@angular/material/dialog";
export declare class ShoppingListComponent implements OnInit {
    private db;
    private fAuth;
    private dialog;
    user: User;
    shoppingListMap: Map<string, number>;
    shoppingListMapKeys: string[];
    constructor(db: AngularFirestore, fAuth: AngularFireAuth, dialog: MatDialog);
    ngOnInit(): void;
    setUserData(uid: string): Promise<void>;
    objToMap(obj: any): Map<string, number>;
    removeMultiple(key: string): void;
    removeItem(key: string): void;
}
