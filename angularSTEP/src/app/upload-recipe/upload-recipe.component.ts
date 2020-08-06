import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';
import {User} from '../user';
import {Converter} from '../converter';

@Component({
  selector: 'app-upload-recipe',
  templateUrl: './upload-recipe.component.html',
  styleUrls: ['./upload-recipe.component.scss']
})

export class UploadRecipeComponent{
  user!: User;
  branching: boolean = false;
  baseRecipe!: Recipe;
  baseUploaderUid!: string;
  id: string | null= '';
  changed: boolean = true;


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private fAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
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
  
  async setUserData(uid: string) {
    const postUser = await this.db.doc('/users/' + uid + '/')
      .ref.withConverter(new Converter().userConverter).get();
    if (postUser && postUser.data()) {
      this.user = postUser.data()!;
    }
  }

  onSubmit() {
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
            this.instructionsArray.value,
            this.extraFormGroup.value.extraInfo ? this.extraFormGroup.value.extraInfo : '',
            Date.now(),
            [], 
            [],
            this.id,
            this.baseUploaderUid,
          )).then(() => {
            this.router.navigate(['/confirm-upload']);
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
          this.instructionsArray.value,
          this.extraFormGroup.value.extraInfo ? this.extraFormGroup.value.extraInfo : '',
          Date.now(),
          [], 
          [],
          '',
          '',
        )).then(() => {
          this.router.navigate(['/confirm-upload']);
        });
      }
    });
  }
  }
}
