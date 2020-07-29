import { AngularFirestore } from '@angular/fire/firestore';
import { OnInit, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user';
export declare class CurrentProfilePageComponent implements OnInit {
    private fAuth;
    private router;
    private route;
    private afs;
    private zone;
    selected: number;
    uid: string;
    stillLoading: boolean;
    user: User | null;
    displayNameForm: FormControl | null;
    constructor(fAuth: AngularFireAuth, router: Router, route: ActivatedRoute, afs: AngularFirestore, zone: NgZone);
    ngOnInit(): void;
    setUserData(): Promise<void>;
    editValue(form: string): void;
    cancelForm(form: string): void;
    onSubmit(): void;
}
