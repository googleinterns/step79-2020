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
const converter_1 = require("../converter");
let UserPageComponent = class UserPageComponent {
    constructor(router, activatedRoute, afs, fAuth, zone) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.afs = afs;
        this.fAuth = fAuth;
        this.zone = zone;
        this.username = '';
        this.currentPageUid = '';
        this.loggedIn = false;
        this.displayName = '';
        this.picUrl = 'assets/images/blank-profile.png';
        this.profileLoaded = false;
        this.userFollowing = false;
        this.currentUserData = undefined;
        this.fAuth.onAuthStateChanged(auth => {
            if (auth) {
                this.loggedIn = true;
                this.currentUserUid = auth.uid;
            }
            else {
                this.loggedIn = false;
                this.currentUserData = undefined;
                this.userFollowing = false;
            }
        });
    }
    ngOnInit() {
        const username = this.activatedRoute.snapshot.paramMap.get('username');
        if (username === null) {
            this.router.navigate(['/users']);
        }
        else {
            this.username = username;
            this.setUserData();
        }
    }
    setUserData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const postUsername = yield this.afs
                .doc('/usernames/' + this.username + '/')
                .ref.withConverter(new converter_1.Converter().usernameConverter)
                .get();
            if (postUsername !== null && postUsername.data() !== undefined) {
                this.currentPageUid = (_a = postUsername.data()) === null || _a === void 0 ? void 0 : _a.uid;
                const postUser = yield this.afs
                    .doc('/users/' + this.currentPageUid + '/')
                    .ref.withConverter(new converter_1.Converter().userConverter)
                    .get();
                this.userFollowing = yield this.isUserFollowing();
                if (postUser !== null && postUser.data() !== undefined) {
                    const user = postUser.data();
                    this.displayName = user.displayName !== null ? user.displayName : '';
                    this.picUrl =
                        user.picUrl !== null && user.picUrl !== ''
                            ? user.picUrl
                            : 'assets/images/blank-profile.png';
                    this.profileLoaded = true;
                }
                else {
                    this.router.navigate(['/users']);
                }
            }
        });
    }
    isUserFollowing() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentPageUid && this.loggedIn && this.currentUserUid) {
                const postUser = yield this.afs.firestore
                    .doc('/users/' + this.currentUserUid + '/')
                    .withConverter(new converter_1.Converter().userConverter)
                    .get();
                if (postUser) {
                    this.currentUserData = postUser.data();
                    if (this.currentUserData &&
                        this.currentUserData.following.indexOf(this.currentPageUid) > -1) {
                        return true;
                    }
                }
            }
            return false;
        });
    }
    setFollowing(follow) {
        if (this.currentUserData && this.currentUserData.following) {
            if (follow) {
                this.currentUserData.following.push(this.currentPageUid);
            }
            else {
                const index = this.currentUserData.following.indexOf(this.currentPageUid);
                if (index > -1) {
                    this.currentUserData.following.splice(index, 1);
                }
            }
            this.fAuth.currentUser.then(user => {
                if (user) {
                    this.afs
                        .collection('users')
                        .doc(this.currentUserUid)
                        .ref.withConverter(new converter_1.Converter().userConverter)
                        .update({ following: this.currentUserData.following })
                        .then(() => {
                        this.userFollowing = follow;
                    });
                }
            });
        }
    }
    follow() {
        this.zone.run(() => {
            this.setFollowing(true);
        });
    }
    unfollow() {
        this.zone.run(() => {
            this.setFollowing(false);
        });
    }
};
UserPageComponent = __decorate([
    core_1.Component({
        selector: 'app-user-page',
        templateUrl: './user-page.component.html',
        styleUrls: ['./user-page.component.scss'],
    })
], UserPageComponent);
exports.UserPageComponent = UserPageComponent;
//# sourceMappingURL=user-page.component.js.map