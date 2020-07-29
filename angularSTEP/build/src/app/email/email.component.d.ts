import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
export declare class EmailComponent implements OnInit {
    private fAuth;
    private router;
    private fb;
    error: string;
    hide: boolean;
    logInForm: FormGroup;
    constructor(fAuth: AngularFireAuth, router: Router, fb: FormBuilder);
    ngOnInit(): void;
    onSubmit(): void;
    goBack(): void;
}
