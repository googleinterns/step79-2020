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
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {v4 as uuidv4} from 'uuid';
import {User} from '../user';
import {Converter} from '../converter';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-upload-recipe',
  templateUrl: './upload-recipe.component.html',
  styleUrls: ['./upload-recipe.component.scss'],
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
  user!: User;
  branching: boolean = false;
  baseRecipe!: Recipe;
  baseUploaderUid!: string;
  id: string | null= '';
  changed: boolean = true;

  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private router: Router,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private _ngZone: NgZone,
    private sanitizer: DomSanitizer,
    private fAuth: AngularFireAuth,
    private route: ActivatedRoute,
  ) {
      if (this.router.url.indexOf('/branch-recipe/') !== -1) {
        this.branching = true;
        this.id = this.route.snapshot.paramMap.get('id');
        this.setRecipeData().then(() => {
          this.basicsFormGroup.controls.name.setValue(this.baseRecipe.recipeName);
          this.basicsFormGroup.controls.difficulty.setValue(this.baseRecipe.difficulty);
          this.basicsFormGroup.controls.description.setValue(this.baseRecipe.description);
    
          for (let ingredient of this.baseRecipe.ingredients) {
            this.setIngredients(ingredient);
          }
    
          for (let tool of this.baseRecipe.tools) {
            this.setTools(tool);
          }
    
          for (let instruction of this.baseRecipe.instructions) {
            this.setInstructions(instruction);
          }
    
          this.extraFormGroup.controls.extraInfo.setValue(this.baseRecipe.extraInfo);
    
          this.baseUploaderUid = this.baseRecipe.uploaderUid;
        });
      } else {
        this.addIngredientsField();
        this.addToolsField();
        this.addInstructionsField();
      }

      this.fAuth.onAuthStateChanged(user => {
        if (user) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      });
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
    error = '';
    previewImgUrls: SafeUrl[] = [];
    uploading = false;
    imageFiles: Blob[] = [];
    imageUrls: string[] = [];
    loggedIn = false;
    @Output() uploadDone = new EventEmitter<boolean>();


    fileFormGroup = new FormGroup({
      imageArray: new FormArray([], {validators: Validators.required}),
    });

    get imageArray() {
      return this.fileFormGroup.get('imageArray') as FormArray;
    }

    //deletes the image from the blob array, preview, and the form
    deleteImage(i: number) {
      this.imageFiles.splice(i, 1);
      this.previewImgUrls.splice(i, 1);
      this.imageArray.removeAt(i);
    }

    //adds preview image to array
    addImageToArray(event: any) {
      if (event.target.files.length > 0) {
        const file: Blob = event.target.files[0];
        this.imageFiles.push(file);
        //uploads preview of image
        //BypasssecuirtyTrustUrl creates a temporary URL for the known blob.
        //This image/blob is one the user has just uploaded.
        //It does not change the actual security of the URL, but allows the website to just display it temporarily. 
        this.previewImgUrls.push(this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        ));
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
    difficulty: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  extraFormGroup = new FormGroup({
    extraInfo: new FormControl(''),
  });



  ingredientsFormGroup = new FormGroup({
    ingredientsArray: new FormArray([]),
  });

  get ingredientsArray() {
    return this.ingredientsFormGroup.get('ingredientsArray') as FormArray;
  }

  setIngredients(baseValue: string) {
    this.ingredientsArray.push(this.fb.control(baseValue, Validators.required));
  }    
  
  addIngredientsField() {
    this.ingredientsArray.push(this.fb.control('', Validators.required));
  }



  toolsFormGroup = new FormGroup({
    toolsArray: new FormArray([]),
  });

  get toolsArray() {
    return this.toolsFormGroup.get('toolsArray') as FormArray;
  }

  setTools(baseValue: string) {
    this.toolsArray.push(this.fb.control(baseValue, Validators.required));
  }

  addToolsField() {
    this.toolsArray.push(this.fb.control('', Validators.required));
  }



  instructionsFormGroup = new FormGroup({
    instructionsArray: new FormArray([]),
  });

  get instructionsArray() {
    return this.instructionsFormGroup.get('instructionsArray') as FormArray;
  }

  setInstructions(baseValue: string) {
    this.instructionsArray.push(this.fb.control(baseValue, Validators.required));
  }

  addInstructionsField() {
    this.instructionsArray.push(this.fb.control('', Validators.required));
  }



  async setRecipeData() {
    const postRecipe = await this.db.doc('/recipes/' + this.id + '/')
      .ref.withConverter(new RecipeConverter().recipeConverter).get();
    const recipeClassData = postRecipe.data();
    if (recipeClassData) {
      this.baseRecipe = recipeClassData;
    }
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
  
  async setUserData(uid: string) {
    const postUser = await this.db.doc('/users/' + uid + '/')
      .ref.withConverter(new Converter().userConverter).get();
    if (postUser && postUser.data()) {
      this.user = postUser.data()!;
    }
  }

  //image functions

  onFileSubmit() {
    this.basicsFormGroup.controls.name.setValue(this.autoCapitalizeName(this.basicsFormGroup.value.name));
    this.basicsFormGroup.controls.description.setValue(this.autoCapitalizeFirst(this.basicsFormGroup.value.description));
    this.formatArrays(this.ingredientsArray);
    this.formatArrays(this.toolsArray);
    this.formatInstructions(this.instructionsArray);
    this.extraFormGroup.controls.extraInfo.setValue(this.autoCapitalizeFirst(this.extraFormGroup.value.extraInfo));

    if (this.branching) {
    const ingredientsCheck = (currentValue: string) => this.ingredientsArray.value.indexOf(currentValue) === this.baseRecipe.ingredients.indexOf(currentValue);
    const toolsCheck = (currentValue: string) => this.toolsArray.value.indexOf(currentValue) === this.baseRecipe.tools.indexOf(currentValue);
    const instructionsCheck = (currentValue: string) => this.instructionsArray.value.indexOf(currentValue) === this.baseRecipe.instructions.indexOf(currentValue);
  
    if (
      this.basicsFormGroup.controls.name.value === this.baseRecipe.recipeName
      &&  this.basicsFormGroup.controls.difficulty.value === this.baseRecipe.difficulty
      &&  this.basicsFormGroup.controls.description.value === this.baseRecipe.description
      &&  this.ingredientsArray.value.every(ingredientsCheck)
      &&  this.toolsArray.value.every(toolsCheck)
      &&  this.instructionsArray.value.every(instructionsCheck)
      &&  this.extraFormGroup.controls.extraInfo.value === this.baseRecipe.extraInfo
    ) {
      this.changed = false;
    } else {
      this.changed = true;

      this.fAuth.currentUser.then(async user => {
        if (user) {
          this.uploading = true;
          //sets the urls from the image and waits for that to be done before proceeding
          await this.setUrls();  
          this.db.collection<Recipe>('recipes')
          .ref.withConverter(new RecipeConverter().recipeConverter)
          .add(new Recipe(
            this.basicsFormGroup.value.name, 
            user.uid,
            this.basicsFormGroup.value.difficulty,
            this.basicsFormGroup.value.description,
            this.ingredientsArray.value,
            this.toolsArray.value,
            this.imageUrls,
            this.instructionsArray.value,
            this.extraFormGroup.value.extraInfo
              ? this.extraFormGroup.value.extraInfo
              : '',
            Date.now(),
            {},
            this.categories,
            this.id,
            this.baseUploaderUid,
            0,
            )).then(async recipeRef => {
              //then it connects the recipe to the user signed in and adds it to their array
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
          }
      });
    }
  } else {
    this.fAuth.currentUser.then(user => {
      if (user) {        
        this.db.collection('recipes')
        .ref.withConverter(new RecipeConverter().recipeConverter)
        .add(new Recipe(
          this.basicsFormGroup.value.name, 
          user.uid,
          this.basicsFormGroup.value.difficulty,
          this.basicsFormGroup.value.description,
          this.ingredientsArray.value,
          this.toolsArray.value,
          this.imageUrls,
          this.instructionsArray.value,
          this.extraFormGroup.value.extraInfo
            ? this.extraFormGroup.value.extraInfo
            : '',
          Date.now(),
          {},
          this.categories,
          '',
          '',
          0,
        )).then(async recipeRef => {
            //then it connects the recipe to the user signed in and adds it to their array
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
}

  //---------------image functions-----------------

  //adds each image to storage and retreivs their url to add to the array of urls
  async addImage(image: Blob, name: string) {
    await new Promise((resolve, reject) => {
      this.fAuth.currentUser.then(async user => {
        if (user) {
          this.storage
            .ref('recipe-images/' + name + 'RecipeImage')
            .put(image)
            .then(() => {
              //gets the images download url after uploaded
              this.storage
                .ref('recipe-images/' + name + 'RecipeImage')
                .getDownloadURL()
                .subscribe(url => {
                  if (url) {
                    this.imageUrls.push(url);
                    resolve();
                  } else {
                    this.error = 'Not able to upload images.'
                    reject();
                  }
                });
            }).catch(() => {
              this.error = 'Not able to upload images.'
              reject()
            });
        } else {
          this.loggedIn = false;
          reject();
        }
      })
    })
  }

  async setUrls() {
    //loops through images to upload them
    for await (const image of this.imageFiles) {
      await this.addImage(image, uuidv4());
    }
  }
}

  //validator to make sure each image is a specific type
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
