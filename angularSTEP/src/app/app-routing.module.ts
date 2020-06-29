import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email/email.component';

const routes: Routes = [{ path: '', redirectTo: 'login', pathMatch: 'full' },
                        { path: 'login', component: LoginComponent },
                        { path: 'signup', component: SignupComponent },
                        { path: 'login-email', component: EmailComponent },
                        { path: 'home', component: HomeComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
