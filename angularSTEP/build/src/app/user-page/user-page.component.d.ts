import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { OnInit, NgZone } from '@angular/core';
import { User } from '../user';
export declare class UserPageComponent implements OnInit {
    private router;
    private activatedRoute;
    private afs;
    private fAuth;
    private zone;
    username: string;
    currentPageUid: string;
    loggedIn: boolean;
    displayName: string;
    picUrl: string;
    profileLoaded: boolean;
    userFollowing: boolean;
    currentUserUid: string;
    currentUserData: User | undefined;
    constructor(router: Router, activatedRoute: ActivatedRoute, afs: AngularFirestore, fAuth: AngularFireAuth, zone: NgZone);
    ngOnInit(): void;
    setUserData(): Promise<void>;
    isUserFollowing(): Promise<boolean>;
    setFollowing(follow: boolean): void;
    follow(): void;
    unfollow(): void;
}
