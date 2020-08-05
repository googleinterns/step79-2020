import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
export declare class SetupComponent implements OnInit {
    private fAuth;
    private router;
    private fb;
    private afs;
    error: string;
    usernameForm: FormGroup;
    hide: boolean;
    picUrl: string;
    constructor(fAuth: AngularFireAuth, router: Router, fb: FormBuilder, afs: AngularFirestore);
    ngOnInit(): void;
    addUser(dName: string, email: string, uid: string): Promise<void>;
    onSubmit(): void;
}
