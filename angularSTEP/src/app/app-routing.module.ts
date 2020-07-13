import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email/email.component';
import { SetupComponent } from './setup/setup.component';
import { UploadRecipeComponent } from './upload-recipe/upload-recipe.component'
import { ConfirmComponent } from './confirm/confirm.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { RecipesComponent } from './recipes/recipes.component';

const routes: Routes = [{ path: '', redirectTo: 'login', pathMatch: 'full' },
                        { path: 'login', component: LoginComponent },
                        { path: 'signup', component: SignupComponent },
                        { path: 'login-email', component: EmailComponent },
                        { path: 'home', component: HomeComponent },
                        { path: 'username-setup', component: SetupComponent },
                        { path: 'upload-recipe', component: UploadRecipeComponent},
                        { path: 'confirm-upload', component: ConfirmComponent},
                        { path: 'recipes', component: RecipesComponent},
                        { path: 'recipes/:id', redirectTo: 'recipe/:id'}, 
                        { path: 'recipe/:id', component: RecipePageComponent},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
