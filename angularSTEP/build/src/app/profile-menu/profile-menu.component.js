"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const converter_1 = require("../converter");
let ProfileMenuComponent = class ProfileMenuComponent {
    constructor(fAuth, router, afs, zone) {
        this.fAuth = fAuth;
        this.router = router;
        this.afs = afs;
        this.zone = zone;
        this.username = '';
        this.displayName = '';
        this.picUrl = 'assets/images/blank-profile.png';
        this.loggedIn = false;
        //checks if Authentication has changed, if user signs in through email
        //it should update menu. If user signs in through google sign-in and is a new
        //user, it won't sign them in until they make a username.
        this.fAuth.onAuthStateChanged(auth => {
            if (auth &&
                this.router.url !== '/login' &&
                this.router.url !== '/signup') {
                this.loggedIn = false;
                this.setUserData(auth.uid);
            }
            else {
                this.lookForRouterChange();
                this.loggedIn = false;
                this.username = '';
                this.picUrl = 'assets/images/blank-profile.png';
            }
        });
    }
    ngOnInit() { }
    //detects route change if router has changed from setting up account.
    //If it has, and the user is not signed it, it will update the menu component
    lookForRouterChange() {
        if (this.router.url === '/login' || this.router.url === '/signup') {
            this.routerCheck = this.router.events.subscribe(event => {
                if (event instanceof router_1.NavigationEnd) {
                    if (this.router.url !== '/login' && this.router.url !== '/signup') {
                        this.fAuth.currentUser.then(user => {
                            if (user) {
                                this.loggedIn = false;
                                this.setUserData(user.uid);
                                this.loggedIn = false;
                            }
                        });
                    }
                }
            });
        }
    }
    logout() {
        this.loggedIn = false;
        this.username = '';
        this.displayName = '';
        this.picUrl = 'assets/images/blank-profile.png';
        this.fAuth.signOut();
    }
    myProfile(index) {
        if (index !== 'myprofile') {
            this.router.navigate(['/myprofile'], { queryParams: { tab: index } });
        }
        else {
            this.router.navigate(['/myprofile']);
        }
    }
    signIn() {
        this.router.navigate(['/login']);
    }
    //this method sets the users data and then injects it
    //into the profile menu dropdown. It waits until all of the
    //information is set and then displays the menu.
    setUserData(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const postUser = yield this.afs
                .doc('/users/' + uid + '/')
                .ref.withConverter(new converter_1.Converter().userConverter)
                .get();
            if (postUser.data()) {
                this.user = postUser.data();
                this.username = this.user.username !== null ? this.user.username : '';
                this.displayName =
                    this.user.displayName !== null ? this.user.displayName : '';
                this.picUrl =
                    this.user.picUrl !== null && this.user.picUrl !== ''
                        ? this.user.picUrl
                        : 'assets/images/blank-profile.png';
                this.zone.run(() => {
                    this.loggedIn = true;
                });
                if (this.routerCheck) {
                    this.routerCheck.unsubscribe();
                }
            }
            else {
                this.fAuth.currentUser.then(user => {
                    if (user &&
                        this.router.url !== '/login' &&
                        this.router.url !== '/signup') {
                        this.routerCheck.unsubscribe();
                        user.delete();
                    }
                });
            }
        });
    }
};
ProfileMenuComponent = __decorate([
    core_1.Component({
        selector: 'app-profile-menu',
        templateUrl: './profile-menu.component.html',
        styleUrls: ['./profile-menu.component.scss'],
    })
], ProfileMenuComponent);
exports.ProfileMenuComponent = ProfileMenuComponent;
//# sourceMappingURL=profile-menu.component.js.map