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
const forms_1 = require("@angular/forms");
const converter_1 = require("../converter");
let CurrentProfilePageComponent = class CurrentProfilePageComponent {
    constructor(fAuth, router, route, afs, zone) {
        this.fAuth = fAuth;
        this.router = router;
        this.route = route;
        this.afs = afs;
        this.zone = zone;
        this.selected = 0;
        this.uid = '';
        this.stillLoading = true;
        this.user = null;
        this.displayNameForm = null;
        this.fAuth.onAuthStateChanged(auth => {
            if (auth) {
                this.uid = auth.uid;
                this.setUserData();
            }
            else {
                this.zone.run(() => {
                    this.router.navigate(['/login']);
                });
            }
        });
    }
    ngOnInit() { }
    //gets the current users information and stores it
    setUserData() {
        return __awaiter(this, void 0, void 0, function* () {
            const postUser = yield this.afs
                .doc('/users/' + this.uid + '/')
                .ref.withConverter(new converter_1.Converter().userConverter)
                .get();
            if (postUser !== null && postUser.data() !== undefined) {
                this.route.queryParams.subscribe(params => {
                    const tab = params['tab'];
                    switch (tab) {
                        case 'wishlist': {
                            this.selected = 1;
                            break;
                        }
                        case 'shoppinglist': {
                            this.selected = 2;
                            break;
                        }
                        default: {
                            this.selected = 0;
                        }
                    }
                });
                this.zone.run(() => {
                    this.user = postUser.data();
                });
            }
            else {
                this.router.navigate(['/login']);
            }
        });
    }
    editValue(form) {
        switch (form) {
            case 'displayName': {
                this.displayNameForm = new forms_1.FormControl(this.user.displayName);
                break;
            }
        }
    }
    cancelForm(form) {
        switch (form) {
            case 'displayName': {
                this.displayNameForm = null;
                break;
            }
        }
    }
    onSubmit() {
        this.fAuth.currentUser.then(user => {
            if (user &&
                this.displayNameForm &&
                this.displayNameForm.valid &&
                this.displayNameForm.value !== this.user.displayName) {
                this.afs
                    .collection('users')
                    .doc(this.user.uid)
                    .ref.withConverter(new converter_1.Converter().userConverter)
                    .update({ displayName: this.displayNameForm.value })
                    .then(() => {
                    this.user.displayName = this.displayNameForm.value;
                    this.displayNameForm = null;
                });
            }
            else if (this.displayNameForm &&
                this.displayNameForm.valid &&
                this.displayNameForm.value === this.user.displayName) {
                this.displayNameForm = null;
            }
        });
    }
};
CurrentProfilePageComponent = __decorate([
    core_1.Component({
        selector: 'app-current-profile-page',
        templateUrl: './current-profile-page.component.html',
        styleUrls: ['./current-profile-page.component.scss'],
    })
], CurrentProfilePageComponent);
exports.CurrentProfilePageComponent = CurrentProfilePageComponent;
//# sourceMappingURL=current-profile-page.component.js.map