import { OnInit } from '@angular/core';
interface recipeData {
    recipeName: string;
    description: string;
    difficulty: string;
}
export declare class RecipeCardComponent implements OnInit {
    recipe: recipeData;
    recipeName: string;
    description: string;
    difficulty: string;
    ngOnInit(): void;
}
export {};
