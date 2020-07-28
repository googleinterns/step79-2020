"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let ViewProfilesComponent = class ViewProfilesComponent {
    constructor(fAuth, router, afs) {
        this.fAuth = fAuth;
        this.router = router;
        this.afs = afs;
        this.loggedIn = false;
        this.userCollection = this.afs.collection('users');
        this.users = this.userCollection.valueChanges();
        this.fAuth.onAuthStateChanged(auth => {
            if (auth) {
                this.loggedIn = true;
            }
            if (!auth) {
                this.loggedIn = false;
            }
        });
    }
    goToUser(username) {
        this.router.navigate(['users/' + username]);
    }
    ngOnInit() { }
};
ViewProfilesComponent = __decorate([
    core_1.Component({
        selector: 'app-view-profiles',
        templateUrl: './view-profiles.component.html',
        styleUrls: ['./view-profiles.component.scss'],
    })
], ViewProfilesComponent);
exports.ViewProfilesComponent = ViewProfilesComponent;
//# sourceMappingURL=view-profiles.component.js.map