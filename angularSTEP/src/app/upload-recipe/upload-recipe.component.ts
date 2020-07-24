import {Component, Output, NgZone, EventEmitter} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Converter} from '../converter';


@Component({
  selector: 'app-upload-recipe',
  templateUrl: './upload-recipe.component.html',
  styleUrls: ['./upload-recipe.component.scss']
})
export class UploadRecipeComponent{
  error = '';
  hide = true;
  imgFile!: Blob;
  pictureUrl = '';
  progress = 0;
  previewImgUrls: SafeUrl[] = [];
  imageFiles: Blob[] = [];
  @Output() uploadDone = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder,
              private db: AngularFirestore,
              private router: Router,
              private storage: AngularFireStorage,
              private afs: AngularFirestore,
              private _ngZone: NgZone,
              private sanitizer: DomSanitizer,
              private fAuth: AngularFireAuth) {}

  fileFormGroup = new FormGroup({
    imageArray: new FormArray([], {validators: Validators.required} )
  });

  get imageArray() {
    return this.fileFormGroup.get('imageArray') as FormArray;
  }

  deleteImage(i: number) {
    this.previewImgUrls.splice(i, 1);
    this.imageArray.removeAt(i);
  }

  addImageToArray(event: any) {
    if (event.target.files.length > 0) {
      const file: Blob = event.target.files[0];
      this.imgFile = file;
      //uploads preview of image
      this.previewImgUrls.push(this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      ));
    }
    this.imageArray.push(this.fb.control(event.target.value, [Validators.required, requiredFileType]));
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

  //image functions

  onFileSubmit() {
    this.fAuth.currentUser.then(user => {
      if (user) {
        //this.addImage(user.uid);
      } else {
        this._ngZone.run(() => {
          this.router.navigate(['/home']);
        });
      }
    });
  }
}

function requiredFileType(control: FormControl) {
  const imageTypes: Array<string> = ['png', 'jpg', 'jpeg', 'gif'];
  const file = control.value;
  if (file && file.split('.')[1]) {
    const type = file.split('.')[1].toLowerCase();
    if (imageTypes.indexOf(type) > -1) {
      return null;
    }
  }
  return {fileType: true};
}
