import {RouterModule, Routes} from '@angular/router';

import {DiscoverPageComponent} from './discover-page/discover-page.component'
import {EmailComponent} from './email/email.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {NgModule} from '@angular/core';
import {SignupComponent} from './signup/signup.component';
import {UserPageComponent} from './user-page/user-page.component';
import {ViewProfilesComponent} from './view-profiles/view-profiles.component';
import {UploadRecipeComponent} from './upload-recipe/upload-recipe.component'
import {ConfirmComponent} from './confirm/confirm.component';
import {CurrentProfilePageComponent} from './current-profile-page/current-profile-page.component';
import {RecipePageComponent} from './recipe-page/recipe-page.component';
import {RecipesComponent} from './recipes/recipes.component';

const routes: Routes = [{ path: '', redirectTo: 'home', pathMatch: 'full' },
                        { path: 'login', component: LoginComponent },
                        { path: 'signup', component: SignupComponent },
                        { path: 'login-email', component: EmailComponent },
                        { path: 'home', component: HomeComponent },
                        { path: 'upload-recipe', component: UploadRecipeComponent},
                        { path: 'confirm-upload', component: ConfirmComponent},
                        { path: 'discover', component: DiscoverPageComponent},
                        { path: 'discover/:type', component: DiscoverPageComponent},
                        { path: 'discover/users/:username', component: UserPageComponent},
                        { path: 'discover/recipes/:recipeid', component: RecipePageComponent},
                        { path: 'myprofile', component: CurrentProfilePageComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
