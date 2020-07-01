import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadRecipeComponent } from './upload-recipe/upload-recipe.component'
import { ConfirmComponent } from './confirm/confirm.component';


const routes: Routes = [
  { path: 'upload-recipe', component: UploadRecipeComponent},
  { path: 'confirm-upload', component: ConfirmComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
