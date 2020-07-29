import { OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
export declare class LoginComponent implements OnInit {
    private fAuth;
    private router;
    error: string;
    userSetup: boolean;
    aboutToSetup: boolean;
    redirected: boolean;
    constructor(fAuth: AngularFireAuth, router: Router);
    googleLogin(): void;
    ngOnInit(): void;
}
