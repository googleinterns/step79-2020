import { RouterModule, Routes } from '@angular/router';

import { EmailComponent } from './email/email.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { SetupComponent } from './setup/setup.component';
import { SignupComponent } from './signup/signup.component';
import { ViewProfilesComponent } from './view-profiles/view-profiles.component';

const routes: Routes = [{ path: '', redirectTo: 'login', pathMatch: 'full' },
                        { path: 'login', component: LoginComponent },
                        { path: 'signup', component: SignupComponent },
                        { path: 'login-email', component: EmailComponent },
                        { path: 'home', component: HomeComponent },
                        { path: 'users', component: ViewProfilesComponent },
                        { path: 'username-setup', component: SetupComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
