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
const keycodes_1 = require("@angular/cdk/keycodes");
const core_2 = require("@angular/core");
const operators_1 = require("rxjs/operators");
let UploadRecipeComponent = class UploadRecipeComponent {
    constructor(fb, db, router) {
        this.fb = fb;
        this.db = db;
        this.router = router;
        this.visible = true;
        this.selectable = true;
        this.removable = true;
        this.separatorKeysCodes = [keycodes_1.ENTER, keycodes_1.COMMA];
        this.categoryCtrl = new forms_1.FormControl();
        this.categories = ['Delicious'];
        this.allCategories = ['Vegan', 'Gluten Free', 'Vegetarian', 'Low Calorie', 'High Protein'];
        this.basicsFormGroup = new forms_1.FormGroup({
            name: new forms_1.FormControl('', forms_1.Validators.required),
            description: new forms_1.FormControl('', forms_1.Validators.required),
            difficulty: new forms_1.FormControl('', forms_1.Validators.required),
        });
        this.extraFormGroup = new forms_1.FormGroup({
            extraInfo: new forms_1.FormControl(''),
        });
        this.ingredientsFormGroup = new forms_1.FormGroup({
            ingredientsArray: new forms_1.FormArray([this.fb.control('', forms_1.Validators.required)], { validators: forms_1.Validators.required }),
        });
        this.toolsFormGroup = new forms_1.FormGroup({
            toolsArray: new forms_1.FormArray([this.fb.control('', forms_1.Validators.required)]),
        });
        this.instructionsFormGroup = new forms_1.FormGroup({
            instructionsArray: new forms_1.FormArray([this.fb.control('', forms_1.Validators.required)]),
        });
        this.filteredCategories = this.categoryCtrl.valueChanges.pipe(operators_1.startWith(null), operators_1.map((category) => category ? this._filter(category) : this.allCategories.slice()));
    }
    add(event) {
        const input = event.input;
        const value = event.value;
        // Add our category
        if ((value || '').trim()) {
            this.categories.push(value.trim());
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
        this.categoryCtrl.setValue(null);
    }
    remove(category) {
        const index = this.categories.indexOf(category);
        if (index >= 0) {
            this.categories.splice(index, 1);
        }
    }
    selected(event) {
        this.categories.push(event.option.viewValue);
        this.categoryInput.nativeElement.value = '';
        this.categoryCtrl.setValue(null);
    }
    _filter(value) {
        const filterValue = value.toLowerCase();
        return this.allCategories.filter(category => category.toLowerCase().indexOf(filterValue) === 0);
    }
    get ingredientsArray() {
        return this.ingredientsFormGroup.get('ingredientsArray');
    }
    addIngredientsField() {
        this.ingredientsArray.push(this.fb.control('', forms_1.Validators.required));
    }
    get toolsArray() {
        return this.toolsFormGroup.get('toolsArray');
    }
    addToolsField() {
        this.toolsArray.push(this.fb.control('', forms_1.Validators.required));
    }
    get instructionsArray() {
        return this.instructionsFormGroup.get('instructionsArray');
    }
    addInstructionsField() {
        this.instructionsArray.push(this.fb.control('', forms_1.Validators.required));
    }
    checkForBlanks(givenArray) {
        for (let element of givenArray) {
            if (element.trim() === '') {
                return true;
            }
        }
        return false;
    }
    checkInstructions(givenArray) {
        for (let element of givenArray) {
            if (this.removeNumsAndSymbolsAtStart(element) === '') {
                return true;
            }
        }
        return false;
    }
    autoCapitalizeFirst(fullString) {
        var trimString = fullString.trim();
        if (trimString != '') {
            return trimString.charAt(0).toUpperCase() + trimString.substring(1);
        }
        return '';
    }
    autoCapitalizeName(fullName) {
        var trimAndSplitName = fullName.trim().split(' ');
        var formattedName = '';
        for (let i = 0; i < trimAndSplitName.length; i++) {
            if (trimAndSplitName[i] != '') {
                formattedName += this.autoCapitalizeFirst(trimAndSplitName[i]);
                if (i != (trimAndSplitName.length - 1)) {
                    formattedName += ' ';
                }
            }
        }
        return formattedName;
    }
    removeNumsAndSymbolsAtStart(originalString) {
        var startIndex = -1;
        for (let i = 0; i < originalString.length; i++) {
            // charCodeAt(i) of 65 is A and of 90 is Z
            // charCodeA(i) of 97 is a and of 122 is z
            var currentValue = originalString.charCodeAt(i);
            if ((65 <= currentValue && currentValue <= 90) || (97 <= currentValue && currentValue <= 122)) {
                return originalString.substring(i);
            }
        }
        if (startIndex == -1) {
            return '';
        }
        return '';
    }
    formatArrays(originalArray) {
        for (let i = 0; i < originalArray.length; i++) {
            originalArray.at(i).setValue(this.autoCapitalizeFirst(originalArray.at(i).value));
        }
    }
    formatInstructions(originalArray) {
        for (let i = 0; i < originalArray.length; i++) {
            originalArray.at(i).setValue(this.autoCapitalizeFirst(this.removeNumsAndSymbolsAtStart(originalArray.at(i).value)));
        }
    }
    onSubmit() {
        this.basicsFormGroup.controls.name.setValue(this.autoCapitalizeName(this.basicsFormGroup.value.name));
        this.basicsFormGroup.controls.description.setValue(this.autoCapitalizeFirst(this.basicsFormGroup.value.description));
        this.formatArrays(this.ingredientsArray);
        this.formatArrays(this.toolsArray);
        this.formatInstructions(this.instructionsArray);
        this.extraFormGroup.controls.extraInfo.setValue(this.autoCapitalizeFirst(this.extraFormGroup.value.extraInfo));
        this.db.collection('recipes').add({
            recipeName: this.basicsFormGroup.value.name,
            difficulty: this.basicsFormGroup.value.difficulty,
            description: this.basicsFormGroup.value.description,
            ingredients: this.ingredientsArray.value,
            tools: this.toolsArray.value,
            instructions: this.instructionsArray.value,
            extraInfo: this.extraFormGroup.value.extraInfo ? this.extraFormGroup.value : '',
            timestamp: Date.now(),
        });
        this.router.navigate(['/confirm-upload']);
    }
};
__decorate([
    core_2.ViewChild('catagoryInput')
], UploadRecipeComponent.prototype, "categoryInput", void 0);
__decorate([
    core_2.ViewChild('auto')
], UploadRecipeComponent.prototype, "matAutocomplete", void 0);
UploadRecipeComponent = __decorate([
    core_1.Component({
        selector: 'app-upload-recipe',
        templateUrl: './upload-recipe.component.html',
        styleUrls: ['./upload-recipe.component.scss']
    })
], UploadRecipeComponent);
exports.UploadRecipeComponent = UploadRecipeComponent;
//# sourceMappingURL=upload-recipe.component.js.map