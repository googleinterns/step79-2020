import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { OnInit, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../user';
export declare class ViewProfilesComponent implements OnInit {
    private fAuth;
    private router;
    private afs;
    private zone;
    loggedIn: boolean;
    userCollection: AngularFirestoreCollection<User>;
    users: Observable<User[]>;
    constructor(fAuth: AngularFireAuth, router: Router, afs: AngularFirestore, zone: NgZone);
    goToUser(username: string): void;
    ngOnInit(): void;
}
