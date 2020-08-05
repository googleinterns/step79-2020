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
//this component gets called when signing into a google account. Changes the "display name"
//to the username
let SetupComponent = class SetupComponent {
    constructor(fAuth, router, fb, afs) {
        this.fAuth = fAuth;
        this.router = router;
        this.fb = fb;
        this.afs = afs;
        this.error = '';
        this.hide = true;
        this.picUrl = '';
        this.usernameForm = this.fb.group({
            username: [null, [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
        });
    }
    //creates a reactive form for username input
    ngOnInit() { }
    //creates and adds a user to Firestore
    addUser(dName, email, uid) {
        return this.afs
            .collection('users')
            .doc(uid)
            .ref.withConverter(new converter_1.Converter().userConverter)
            .set(new user_1.User(this.usernameForm.value.username, uid, dName, email, this.picUrl, [], Date.now(), [], [], new Object(), ""))
            .then(() => {
            this.afs
                .collection('usernames')
                .doc(this.usernameForm.value.username)
                .ref.withConverter(new converter_1.Converter().usernameConverter)
                .set(new user_1.Username(this.usernameForm.value.username, uid))
                .then(() => {
                this.router.navigate(['/home']);
            });
        });
    }
    //when form is submitted, if it is valid, checks if the username exists in Firestore. Then, if not,
    //creates a user and updates the "displayName" of the user authentication to the username
    onSubmit() {
        if (!this.usernameForm.valid) {
            this.error = 'Please make sure the form is filled out correctly';
        }
        else {
            this.afs
                .doc('/usernames/' + this.usernameForm.value.username + '/')
                .ref.get()
                .then(doc => {
                if (doc.exists) {
                    this.error =
                        'Username ' +
                            this.usernameForm.value.username +
                            ' already taken.';
                }
                else {
                    this.fAuth.currentUser.then(user => {
                        if (user === null) {
                            this.error = 'Could not create user. Please try again.';
                        }
                        else {
                            const dName = user.displayName !== null ? user.displayName : '';
                            const email = user.email !== null ? user.email : '';
                            this.picUrl = user.photoURL !== null ? user.photoURL : '';
                            user;
                            this.addUser(dName, email, user.uid);
                        }
                    });
                }
            })
                .catch(() => {
                this.error = 'Could not create user. Please try again.';
                this.fAuth.currentUser.then(user => {
                    if (user !== null) {
                        user.delete();
                    }
                });
            });
        }
    }
};
SetupComponent = __decorate([
    core_1.Component({
        selector: 'app-setup',
        templateUrl: './setup.component.html',
        styleUrls: ['./setup.component.scss'],
    })
], SetupComponent);
exports.SetupComponent = SetupComponent;
//# sourceMappingURL=setup.component.js.map