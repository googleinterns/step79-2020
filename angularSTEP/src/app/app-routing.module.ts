import { RouterModule, Routes } from '@angular/router';

import { EmailComponent } from './email/email.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import { UserPageComponent } from './user-page/user-page.component';
import { ViewProfilesComponent } from './view-profiles/view-profiles.component';
import { UploadRecipeComponent } from './upload-recipe/upload-recipe.component'
import { ConfirmComponent } from './confirm/confirm.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { RecipesComponent } from './recipes/recipes.component';
import { CurrentProfilePageComponent } from './current-profile-page/current-profile-page.component';

const routes: Routes = [{ path: '', redirectTo: 'home', pathMatch: 'full' },
                        { path: 'login', component: LoginComponent },
                        { path: 'signup', component: SignupComponent },
                        { path: 'login-email', component: EmailComponent },
                        { path: 'home', component: HomeComponent },
                        { path: 'users', component: ViewProfilesComponent},
                        { path: 'users/:username', component: UserPageComponent },
                        { path: 'upload-recipe', component: UploadRecipeComponent},
                        { path: 'confirm-upload', component: ConfirmComponent},
                        { path: 'recipes', component: RecipesComponent},
                        { path: 'recipes/:id', redirectTo: 'recipe/:id'}, 
                        { path: 'recipe/:id', component: RecipePageComponent},
                        { path: 'myprofile', component: CurrentProfilePageComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
