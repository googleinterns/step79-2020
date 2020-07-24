import {Component, Output, NgZone, EventEmitter} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {v4 as uuidv4} from 'uuid';
import {Converter} from '../converter';
import {User} from '../user';

@Component({
  selector: 'app-upload-recipe',
  templateUrl: './upload-recipe.component.html',
  styleUrls: ['./upload-recipe.component.scss'],
})
export class UploadRecipeComponent {
  error = '';
  previewImgUrls: SafeUrl[] = [];
  uploading = false;
  imageFiles: Blob[] = [];
  imageUrls: string[] = [];
  loggedIn = false;
  @Output() uploadDone = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private router: Router,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private _ngZone: NgZone,
    private sanitizer: DomSanitizer,
    private fAuth: AngularFireAuth
  ) {
    this.fAuth.onAuthStateChanged(user => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }

  fileFormGroup = new FormGroup({
    imageArray: new FormArray([], {validators: Validators.required}),
  });

  get imageArray() {
    return this.fileFormGroup.get('imageArray') as FormArray;
  }

  deleteImage(i: number) {
    this.imageFiles.splice(i, 1);
    this.previewImgUrls.splice(i, 1);
    this.imageArray.removeAt(i);
  }

  addImageToArray(event: any) {
    if (event.target.files.length > 0) {
      const file: Blob = event.target.files[0];
      this.imageFiles.push(file);
      //uploads preview of image
      this.previewImgUrls.push(
        this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file))
      );
    }
    this.imageArray.push(
      this.fb.control(event.target.value, [
        Validators.required,
        requiredFileType,
      ])
    );
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
    ingredientsArray: new FormArray(
      [this.fb.control('', Validators.required)],
      {validators: Validators.required}
    ),
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
    instructionsArray: new FormArray([
      this.fb.control('', Validators.required),
    ]),
  });

  get instructionsArray() {
    return this.instructionsFormGroup.get('instructionsArray') as FormArray;
  }

  addInstructionsField() {
    this.instructionsArray.push(this.fb.control('', Validators.required));
  }

  checkForBlanks(givenArray: string[]) {
    for (const element of givenArray) {
      if (element.trim() === '') {
        return true;
      }
    }
    return false;
  }

  checkInstructions(givenArray: string[]) {
    for (const element of givenArray) {
      if (this.removeNumsAndSymbolsAtStart(element) === '') {
        return true;
      }
    }
    return false;
  }

  autoCapitalizeFirst(fullString: string): string {
    const trimString: string = fullString.trim();
    if (trimString !== '') {
      return trimString.charAt(0).toUpperCase() + trimString.substring(1);
    }
    return '';
  }

  autoCapitalizeName(fullName: string): string {
    const trimAndSplitName: string[] = fullName.trim().split(' ');
    let formattedName = '';
    for (let i = 0; i < trimAndSplitName.length; i++) {
      if (trimAndSplitName[i] !== '') {
        formattedName += this.autoCapitalizeFirst(trimAndSplitName[i]);
        if (i !== trimAndSplitName.length - 1) {
          formattedName += ' ';
        }
      }
    }
    return formattedName;
  }

  removeNumsAndSymbolsAtStart(originalString: string): string {
    const startIndex = -1;

    for (let i = 0; i < originalString.length; i++) {
      // charCodeAt(i) of 65 is A and of 90 is Z
      // charCodeA(i) of 97 is a and of 122 is z
      const currentValue: number = originalString.charCodeAt(i);
      if (
        (65 <= currentValue && currentValue <= 90) ||
        (97 <= currentValue && currentValue <= 122)
      ) {
        return originalString.substring(i);
      }
    }
    if (startIndex === -1) {
      return '';
    }
    return '';
  }

  formatArrays(originalArray: FormArray) {
    for (let i = 0; i < originalArray.length; i++) {
      originalArray
        .at(i)
        .setValue(this.autoCapitalizeFirst(originalArray.at(i).value));
    }
  }

  formatInstructions(originalArray: FormArray) {
    for (let i = 0; i < originalArray.length; i++) {
      originalArray
        .at(i)
        .setValue(
          this.autoCapitalizeFirst(
            this.removeNumsAndSymbolsAtStart(originalArray.at(i).value)
          )
        );
    }
  }

  async onSubmit() {
    this.basicsFormGroup.controls.name.setValue(
      this.autoCapitalizeName(this.basicsFormGroup.value.name)
    );
    this.basicsFormGroup.controls.description.setValue(
      this.autoCapitalizeFirst(this.basicsFormGroup.value.description)
    );
    this.formatArrays(this.ingredientsArray);
    this.formatArrays(this.toolsArray);
    this.formatInstructions(this.instructionsArray);
    this.extraFormGroup.controls.extraInfo.setValue(
      this.autoCapitalizeFirst(this.extraFormGroup.value.extraInfo)
    );

    this.fAuth.currentUser.then(async user => {
      if (user) {
        this.uploading = true;
        await this.setUrls();
        this.db
          .collection('recipes')
          .add({
            recipeName: this.basicsFormGroup.value.name,
            difficulty: this.basicsFormGroup.value.difficulty,
            description: this.basicsFormGroup.value.description,
            ingredients: this.ingredientsArray.value,
            uploaderUid: user.uid,
            tools: this.toolsArray.value,
            images: this.imageUrls,
            instructions: this.instructionsArray.value,
            extraInfo: this.extraFormGroup.value.extraInfo
              ? this.extraFormGroup.value
              : '',
            timestamp: Date.now(),
          })
          .then(async recipeRef => {
            const userData = await this.afs
              .collection('users')
              .doc(user.uid)
              .ref.withConverter(new Converter().userConverter)
              .get();
            if (userData && userData.data()) {
              const tempUser: User = userData.data()!;
              tempUser.recipes.push(recipeRef.id);
              this.afs
                .collection('users')
                .doc(user.uid)
                .ref.withConverter(new Converter().userConverter)
                .update({recipes: tempUser.recipes})
                .then(() => {
                  this.uploading = false;
                  this.router.navigate(['/confirm-upload']);
                });
            } else {
              recipeRef.delete();
              this.loggedIn = false;
            }
          });
      } else {
        this._ngZone.run(() => {
          this.router.navigate(['/home']);
        });
      }
    });
  }

  //image functions

  async addImage(image: Blob, name: string) {
    await new Promise((resolve, reject) => {
      this.storage
        .ref('recipe-images/' + name + 'RecipeImage')
        .put(image)
        .then(() => {
          this.storage
            .ref('recipe-images/' + name + 'RecipeImage')
            .getDownloadURL()
            .subscribe(url => {
              if (url) {
                this.imageUrls.push(url);
                resolve();
              }
            });
        })
        .catch(() => {
          resolve();
        });
    });
  }

  async setUrls() {
    for await (const image of this.imageFiles) {
      await this.addImage(image, uuidv4());
    }
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
