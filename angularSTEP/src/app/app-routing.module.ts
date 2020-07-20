import { RouterModule, Routes } from '@angular/router';

import { EmailComponent } from './email/email.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { SetupComponent } from './setup/setup.component';
import { SignupComponent } from './signup/signup.component';
import { UploadRecipeComponent } from './upload-recipe/upload-recipe.component'
import { ConfirmComponent } from './confirm/confirm.component';
import { CurrentProfilePageComponent } from './current-profile-page/current-profile-page.component';

const routes: Routes = [{ path: '', redirectTo: 'home', pathMatch: 'full' },
                        { path: 'login', component: LoginComponent },
                        { path: 'signup', component: SignupComponent },
                        { path: 'login-email', component: EmailComponent },
                        { path: 'home', component: HomeComponent },
                        { path: 'upload-recipe', component: UploadRecipeComponent},
                        { path: 'confirm-upload', component: ConfirmComponent},
                        { path: 'myprofile', component: CurrentProfilePageComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
