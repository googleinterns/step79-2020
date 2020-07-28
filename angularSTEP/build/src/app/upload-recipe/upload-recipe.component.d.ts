import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
export declare class UploadRecipeComponent {
    private fb;
    private db;
    private router;
    constructor(fb: FormBuilder, db: AngularFirestore, router: Router);
    basicsFormGroup: FormGroup;
    extraFormGroup: FormGroup;
    ingredientsFormGroup: FormGroup;
    get ingredientsArray(): FormArray;
    addIngredientsField(): void;
    toolsFormGroup: FormGroup;
    get toolsArray(): FormArray;
    addToolsField(): void;
    instructionsFormGroup: FormGroup;
    get instructionsArray(): FormArray;
    addInstructionsField(): void;
    checkForBlanks(givenArray: string[]): boolean;
    checkInstructions(givenArray: string[]): boolean;
    autoCapitalizeFirst(fullString: string): string;
    autoCapitalizeName(fullName: string): string;
    removeNumsAndSymbolsAtStart(originalString: string): string;
    formatArrays(originalArray: FormArray): void;
    formatInstructions(originalArray: FormArray): void;
    onSubmit(): void;
}
