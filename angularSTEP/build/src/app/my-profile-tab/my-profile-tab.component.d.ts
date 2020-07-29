import { AngularFirestore } from '@angular/fire/firestore';
import { OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../user';
export declare class MyProfileTabComponent implements OnInit {
    private afs;
    private fAuth;
    userData: User;
    aboutMeForm: FormControl | null;
    constructor(afs: AngularFirestore, fAuth: AngularFireAuth);
    ngOnInit(): void;
    editValue(form: string): void;
    cancelForm(form: string): void;
    onSubmit(): void;
}
