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

const routes: Routes = [{ path: '', redirectTo: 'home', pathMatch: 'full' },
                        { path: 'login', component: LoginComponent },
                        { path: 'signup', component: SignupComponent },
                        { path: 'login-email', component: EmailComponent },
                        { path: 'home', component: HomeComponent },
                        { path: 'users', component: ViewProfilesComponent},
                        { path: 'users/:username', component: UserPageComponent },
                        { path: 'upload-recipe', component: UploadRecipeComponent},
                        { path: 'confirm-upload', component: ConfirmComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
