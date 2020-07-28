import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-upload-recipe',
  templateUrl: './upload-recipe.component.html',
  styleUrls: ['./upload-recipe.component.scss']
})
export class UploadRecipeComponent{
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl();
  filteredCategories!: Observable<string[]>;
  categories: string[] = ['Delicious'];
  allCategories: string[] = ['Vegan', 'Gluten Free', 'Vegetarian', 'Low Calorie', 'High Protein'];

  @ViewChild('catagoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(private fb: FormBuilder,
              private db: AngularFirestore,
              private router: Router,) {
                this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
                  startWith(null),
                  map((category: string | null) => category ? this._filter(category) : this.allCategories.slice()));
               }

               add(event: MatChipInputEvent): void {
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
            
              remove(category: string): void {
                const index = this.categories.indexOf(category);
            
                if (index >= 0) {
                  this.categories.splice(index, 1);
                }
              }
            
              selected(event: MatAutocompleteSelectedEvent): void {
                this.categories.push(event.option.viewValue);
                this.categoryInput.nativeElement.value = '';
                this.categoryCtrl.setValue(null);
              }
            
              private _filter(value: string): string[] {
                const filterValue = value.toLowerCase();
            
                return this.allCategories.filter(category => category.toLowerCase().indexOf(filterValue) === 0);
              }

  basicsFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    difficulty: new FormControl('', Validators.required),
  });

  extraFormGroup = new FormGroup({
    extraInfo: new FormControl(''),
  });



  ingredientsFormGroup = new FormGroup({
    ingredientsArray: new FormArray([this.fb.control('', Validators.required)], {validators: Validators.required}),
  });

  get ingredientsArray() {
    return this.ingredientsFormGroup.get('ingredientsArray') as FormArray;
    }
  
  addIngredientsField() {
    this.ingredientsArray.push(this.fb.control('', Validators.required));
  }



  toolsFormGroup = new FormGroup({
    toolsArray: new FormArray([this.fb.control('', Validators.required)]),
  });
  
  get toolsArray() {
    return this.toolsFormGroup.get('toolsArray') as FormArray;
  }

  addToolsField() {
    this.toolsArray.push(this.fb.control('', Validators.required));
  }



  instructionsFormGroup = new FormGroup({
    instructionsArray: new FormArray([this.fb.control('', Validators.required)]),
  });
  
  get instructionsArray() {
    return this.instructionsFormGroup.get('instructionsArray') as FormArray;
  }

  addInstructionsField() {
    this.instructionsArray.push(this.fb.control('', Validators.required));
  }



  checkForBlanks(givenArray: string[]) {
    for (let element of givenArray) {
      if(element.trim() === '') {
        return true;
      }
    }
    return false;
  }

  checkInstructions(givenArray: string[]) {
    for (let element of givenArray) {
      if(this.removeNumsAndSymbolsAtStart(element) === '') {
        return true;
      }
    }
    return false;
  }

  autoCapitalizeFirst(fullString: string): string {
    var trimString: string = fullString.trim();
    if (trimString != '') {
      return trimString.charAt(0).toUpperCase() + trimString.substring(1);
    }
    return '';
  }

  autoCapitalizeName(fullName: string): string {
    var trimAndSplitName: string[] = fullName.trim().split(' ');
    var formattedName: string = '';
    for (let i = 0; i  < trimAndSplitName.length; i++) {
      if (trimAndSplitName[i] != '') {
        formattedName += this.autoCapitalizeFirst(trimAndSplitName[i]);
        if (i != (trimAndSplitName.length - 1)) {
          formattedName += ' ';
        }
      }
    }
    return formattedName;
  }

  removeNumsAndSymbolsAtStart(originalString: string): string {
    var startIndex: number = -1;

    for (let i = 0; i < originalString.length; i++) {

      // charCodeAt(i) of 65 is A and of 90 is Z
      // charCodeA(i) of 97 is a and of 122 is z
      var currentValue: number = originalString.charCodeAt(i);
      if ((65 <= currentValue && currentValue <= 90) || (97 <= currentValue && currentValue <= 122)) {
        return originalString.substring(i);
      }
    }
    if (startIndex == -1) {
      return '';
    }
    return '';
  }

  formatArrays(originalArray: FormArray) {
    for (let i = 0; i < originalArray.length; i++) {
      originalArray.at(i).setValue(this.autoCapitalizeFirst(originalArray.at(i).value));
    }
  }

  formatInstructions(originalArray: FormArray) {
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
}
