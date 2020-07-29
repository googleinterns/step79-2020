"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let ProfileCardComponent = class ProfileCardComponent {
    constructor() {
        this.username = '';
        this.displayName = '';
        this.picUrl = '';
    }
    ngOnInit() {
        if (this.user !== null) {
            this.displayName = this.user.displayName;
            this.username = this.user.username;
            this.picUrl = this.user.picUrl;
        }
    }
};
__decorate([
    core_1.Input()
], ProfileCardComponent.prototype, "user", void 0);
ProfileCardComponent = __decorate([
    core_1.Component({
        selector: 'app-profile-card',
        templateUrl: './profile-card.component.html',
        styleUrls: ['./profile-card.component.scss'],
    })
], ProfileCardComponent);
exports.ProfileCardComponent = ProfileCardComponent;
//# sourceMappingURL=profile-card.component.js.map