import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { OnInit } from '@angular/core';
export declare class UserPageComponent implements OnInit {
    private router;
    private activatedRoute;
    private afs;
    username: string;
    loggedIn: boolean;
    displayName: string;
    picUrl: string;
    profileLoaded: boolean;
    constructor(router: Router, activatedRoute: ActivatedRoute, afs: AngularFirestore);
    ngOnInit(): void;
    setUserData(): Promise<void>;
}
