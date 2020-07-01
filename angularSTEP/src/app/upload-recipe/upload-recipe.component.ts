import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { formattedError } from '@angular/compiler';

@Component({
  selector: 'app-upload-recipe',
  templateUrl: './upload-recipe.component.html',
  styleUrls: ['./upload-recipe.component.scss'],
})

export class UploadRecipeComponent {
  constructor(private db: AngularFirestore,
              private router: Router,) {
  }

  ingredients: string[] = [];
  instructions: string[] = [];
  tools: string[] = [];

  recipeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    tools: new FormControl(this.tools, [Validators.required]),
    ingredients: new FormControl(this.ingredients, [Validators.required]),
    instructions: new FormControl(this.instructions, [Validators.required]),
    extraInfo: new FormControl(''),
    difficulty: new FormControl('', [Validators.required]),
  });


  addIngredient(newIngredient: string) {
    var formattedIngredient: string = this.autoCapitalizeFirst(newIngredient);
    if (formattedIngredient != '' && formattedIngredient != undefined) {
      this.ingredients.push(formattedIngredient);
    }
  }

  addInstruction(newInstruction: string) {
    var onlyLettersStartInstruction: string =  this.removeNumsAndSymbolsAtStart(newInstruction);
    if (onlyLettersStartInstruction != '') {
      var formattedInstruction: string = this.autoCapitalizeFirst(onlyLettersStartInstruction);
      if (formattedInstruction != '' && formattedInstruction != undefined) {
        this.instructions.push(formattedInstruction);
      } 
    }
  } 

  addTool(newTool: string) {
    var formattedTool: string = this.autoCapitalizeFirst(newTool);
    if (formattedTool != '' && formattedTool != undefined) {
      this.tools.push(formattedTool);
    }
  }

  autoCapitalizeFirst(fullString: string): string {
    var trimString: string = fullString.trim();
    if (trimString != '') {
      return trimString.charAt(0).toUpperCase() + trimString.substring(1);
    }
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
        var currentValue: number = originalString.charCodeAt(i);
        if ((65 <= currentValue && currentValue <= 90) || (97 <= currentValue && currentValue <= 122)) {
          return originalString.substring(i);
        }
      }
      if (startIndex == -1) {
        return '';
      }
  }

  onSubmit() {
    this.db.collection('recipes').add({
      //// uploaderUserName: 
      // / userDocumentID
      recipeName: this.autoCapitalizeName(this.recipeForm.value.name),
      description: this.autoCapitalizeFirst(this.recipeForm.value.description),
      // // totalRating
      // // numRatings
      ingredients: this.ingredients,
      tools: this.tools,
      instructions: this.instructions,
      extraInfo: this.autoCapitalizeFirst(this.recipeForm.value.extraInfo),
      //// comments
      //// images
      difficulty: this.recipeForm.value.difficulty,
      timestamp: Date.now(),
      //// tags[] 
    });
    
    this.router.navigate(['/confirm-upload']);
  }
}