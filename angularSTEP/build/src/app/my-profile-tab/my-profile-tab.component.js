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
let MyProfileTabComponent = class MyProfileTabComponent {
    constructor(afs, fAuth) {
        this.afs = afs;
        this.fAuth = fAuth;
        this.aboutMeForm = null;
    }
    ngOnInit() { }
    editValue(form) {
        switch (form) {
            case 'aboutme': {
                this.aboutMeForm = new forms_1.FormControl(this.userData.aboutme);
                break;
            }
        }
    }
    cancelForm(form) {
        this.aboutMeForm = null;
    }
    onSubmit() {
        this.fAuth.currentUser.then(user => {
            if (user &&
                this.aboutMeForm &&
                this.aboutMeForm.valid &&
                this.aboutMeForm.value !== this.userData.aboutme) {
                this.afs
                    .collection('users')
                    .doc(this.userData.uid)
                    .ref.withConverter(new converter_1.Converter().userConverter)
                    .update({ aboutme: this.aboutMeForm.value })
                    .then(() => {
                    this.userData.aboutme = this.aboutMeForm.value;
                    this.aboutMeForm = null;
                });
            }
        });
    }
};
__decorate([
    core_1.Input()
], MyProfileTabComponent.prototype, "userData", void 0);
MyProfileTabComponent = __decorate([
    core_1.Component({
        selector: 'app-my-profile-tab',
        templateUrl: './my-profile-tab.component.html',
        styleUrls: ['./my-profile-tab.component.scss'],
    })
], MyProfileTabComponent);
exports.MyProfileTabComponent = MyProfileTabComponent;
//# sourceMappingURL=my-profile-tab.component.js.map