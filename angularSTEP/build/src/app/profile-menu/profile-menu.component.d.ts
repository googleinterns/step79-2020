import { OnInit, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../user';
import { Subscription } from 'rxjs';
export declare class ProfileMenuComponent implements OnInit {
    private fAuth;
    private router;
    private afs;
    private zone;
    user: User;
    username: string;
    displayName: string;
    picUrl: string;
    loggedIn: boolean;
    routerCheck: Subscription;
    constructor(fAuth: AngularFireAuth, router: Router, afs: AngularFirestore, zone: NgZone);
    ngOnInit(): void;
    lookForRouterChange(): void;
    logout(): void;
    myProfile(index: string): void;
    signIn(): void;
    setUserData(uid: string): Promise<void>;
}
