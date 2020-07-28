"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const converter_1 = require("../converter");
const user_1 = require("../user");
let SignupComponent = class SignupComponent {
    constructor(fAuth, router, fb, afs) {
        this.fAuth = fAuth;
        this.router = router;
        this.fb = fb;
        this.afs = afs;
        this.error = '';
        this.hide = true;
        this.picUrl = '';
        this.signUpForm = this.fb.group({
            displayName: [null, [forms_1.Validators.required]],
            username: [null, [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
            email: [null, [forms_1.Validators.required, forms_1.Validators.email]],
            password: [null, [forms_1.Validators.required, forms_1.Validators.minLength(6)]],
        });
    }
    //initializes the reactive form with Validators
    ngOnInit() { }
    //when form is submitted, if it is valid, checks if the username exists in Firestore. Then, if not,
    //creates a user and updates the "displayName" of the user authentication to the username (this is for the future
    //to make it easy to find user info since the doc Id is the username).
    onSubmit() {
        if (!this.signUpForm.valid) {
            this.error = 'Please make sure the form is filled out correctly';
        }
        else {
            this.afs
                .doc('/usernames/' + this.signUpForm.value.username + '/')
                .ref.get()
                .then(doc => {
                if (doc.exists) {
                    this.error =
                        'Username ' + this.signUpForm.value.username + ' already taken.';
                }
                else {
                    this.fAuth
                        .createUserWithEmailAndPassword(this.signUpForm.value.email, this.signUpForm.value.password)
                        .then(success => {
                        if (success.user !== null) {
                            this.picUrl =
                                success.user.photoURL !== null
                                    ? success.user.photoURL
                                    : 'assets/images/blank-profile.png';
                            this.addUser(success.user.uid);
                        }
                    })
                        .catch(() => {
                        this.fAuth.currentUser.then(user => {
                            if (user !== null) {
                                user.delete();
                            }
                            this.error = 'User not created. Please try again.';
                        });
                    });
                }
            });
        }
    }
    //creates the user and adds it to Firestore
    addUser(uid) {
        return this.afs
            .collection('usernames')
            .doc(this.signUpForm.value.username)
            .ref.withConverter(new converter_1.Converter().usernameConverter)
            .set(new user_1.Username(this.signUpForm.value.username, uid))
            .then(() => {
            this.afs
                .collection('users')
                .doc(uid)
                .ref.withConverter(new converter_1.Converter().userConverter)
                .set(new user_1.User(this.signUpForm.value.username, uid, this.signUpForm.value.displayName, this.signUpForm.value.email, this.picUrl, [], Date.now(), [], [], new Object(), ""))
                .then(() => {
                this.router.navigate(['/home']);
            });
        });
    }
    goBack() {
        this.router.navigate(['/login']);
    }
};
SignupComponent = __decorate([
    core_1.Component({
        selector: 'app-signup',
        templateUrl: './signup.component.html',
        styleUrls: ['./signup.component.scss'],
    })
], SignupComponent);
exports.SignupComponent = SignupComponent;
//# sourceMappingURL=signup.component.js.map