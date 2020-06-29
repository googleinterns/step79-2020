import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
<<<<<<< HEAD

import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
=======
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SetupComponent } from './setup/setup.component';
import { HomeComponent } from './home/home.component';
>>>>>>> ac803c5992db0cb6f90c3e7dc6dcad7cb70b23d1

@NgModule({
  declarations: [
    AppComponent,
<<<<<<< HEAD
    NavbarComponent
=======
    LoginComponent,
    EmailComponent,
    SignupComponent,
    SetupComponent,
    HomeComponent
>>>>>>> ac803c5992db0cb6f90c3e7dc6dcad7cb70b23d1
  ],
  imports: [
    MatToolbarModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    AppRoutingModule,
<<<<<<< HEAD
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule
=======
    BrowserAnimationsModule
>>>>>>> ac803c5992db0cb6f90c3e7dc6dcad7cb70b23d1
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

