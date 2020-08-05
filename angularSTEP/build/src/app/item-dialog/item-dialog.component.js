"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const dialog_1 = require("@angular/material/dialog");
let ItemDialogComponent = class ItemDialogComponent {
    constructor(fb, dialogRef, data) {
        this.fb = fb;
        this.dialogRef = dialogRef;
        this.form = new forms_1.FormGroup({
            quantity: new forms_1.FormControl(1, forms_1.Validators.required),
        });
        this.selectedItem = data.selectedItem;
        this.add = data.add;
        this.remove = data.remove;
        this.max = data.max;
    }
    close() {
        this.dialogRef.close(this.form.controls.quantity.value);
    }
    cancel() {
        this.dialogRef.close();
    }
};
ItemDialogComponent = __decorate([
    core_1.Component({
        selector: 'app-item-dialog',
        templateUrl: './item-dialog.component.html',
        styleUrls: ['./item-dialog.component.scss']
    }),
    __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
], ItemDialogComponent);
exports.ItemDialogComponent = ItemDialogComponent;
//# sourceMappingURL=item-dialog.component.js.map