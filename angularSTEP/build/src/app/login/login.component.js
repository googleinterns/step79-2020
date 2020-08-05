"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const firebase_1 = require("firebase");
let LoginComponent = class LoginComponent {
    //checks if user is already signed in. If user is signed in
    //and there is no user in the database linked to the account
    //it will delete the user (in case user refreshes page before
    //setting a username but after signing in with Google
    constructor(fAuth, router) {
        this.fAuth = fAuth;
        this.router = router;
        this.error = '';
        this.userSetup = false;
        this.aboutToSetup = false;
        this.redirected = false;
    }
    //checks if google user is new, if so, calls setup component to
    //allow the user to create a username, if not new, redirects to home page
    googleLogin() {
        const provider = new firebase_1.auth.GoogleAuthProvider();
        this.aboutToSetup = true;
        this.fAuth
            .signInWithPopup(provider)
            .then(success => {
            const userInfo = success.additionalUserInfo;
            if (success !== null && userInfo) {
                if (userInfo.isNewUser) {
                    this.userSetup = true;
                }
                else {
                    this.router.navigate(['/home']);
                }
            }
        })
            .catch(() => {
            this.error = 'Could not create user. Please try again.';
        });
    }
    ngOnInit() { }
};
LoginComponent = __decorate([
    core_1.Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.scss'],
    })
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map