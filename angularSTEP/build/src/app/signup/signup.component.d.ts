import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
export declare class SignupComponent implements OnInit {
    private fAuth;
    private router;
    private fb;
    private afs;
    error: string;
    signUpForm: FormGroup;
    hide: boolean;
    picUrl: string;
    constructor(fAuth: AngularFireAuth, router: Router, fb: FormBuilder, afs: AngularFirestore);
    ngOnInit(): void;
    onSubmit(): void;
    addUser(uid: string): Promise<void>;
    goBack(): void;
}
