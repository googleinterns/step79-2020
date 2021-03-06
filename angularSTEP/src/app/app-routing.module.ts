// Copyright 2020 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {RouterModule, Routes} from '@angular/router';
import {EmailComponent} from './email/email.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {NgModule} from '@angular/core';
import {SignupComponent} from './signup/signup.component';
import {UserPageComponent} from './user-page/user-page.component';
import {UploadRecipeComponent} from './upload-recipe/upload-recipe.component'
import {ConfirmComponent} from './confirm/confirm.component';
import {CurrentProfilePageComponent} from './current-profile-page/current-profile-page.component';
import {RecipePageComponent} from './recipe-page/recipe-page.component';
import {DiscoverPageComponent} from './discover-page/discover-page.component';

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
                        { path: 'recipes', redirectTo: 'discover/recipes'}, 
                        { path: 'recipe', redirectTo: 'discover/recipes'},
                        { path: 'users', redirectTo: 'discover/users'}, 
                        { path: 'user', redirectTo: 'discover/user'},
                        { path: 'branch-recipe/:id', component: UploadRecipeComponent},
                        { path: 'myprofile', component: CurrentProfilePageComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
