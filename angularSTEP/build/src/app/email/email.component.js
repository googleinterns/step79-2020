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
let EmailComponent = class EmailComponent {
    constructor(fAuth, router, fb) {
        this.fAuth = fAuth;
        this.router = router;
        this.fb = fb;
        this.error = '';
        this.hide = true;
        this.logInForm = this.fb.group({
            email: [null, [forms_1.Validators.required]],
            password: [null, [forms_1.Validators.required]],
        });
        this.fAuth.onAuthStateChanged(auth => {
            if (auth) {
                this.router.navigate(['/home']);
            }
        });
    }
    //set up reactive form
    ngOnInit() { }
    //sign in to account with email and password
    onSubmit() {
        this.fAuth
            .signInWithEmailAndPassword(this.logInForm.value.email, this.logInForm.value.password)
            .then(success => {
            this.router.navigate(['/home']);
        })
            .catch(err => {
            this.error = 'Email and/or password may be invalid.';
        });
    }
    goBack() {
        this.router.navigate(['/login']);
    }
};
EmailComponent = __decorate([
    core_1.Component({
        selector: 'app-email',
        templateUrl: './email.component.html',
        styleUrls: ['./email.component.scss'],
    })
], EmailComponent);
exports.EmailComponent = EmailComponent;
//# sourceMappingURL=email.component.js.map