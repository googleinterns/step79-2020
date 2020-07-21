import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CurrentProfilePageComponent} from './current-profile-page/current-profile-page.component';
import {EmailComponent} from './email/email.component';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './login/login.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NgModule} from '@angular/core';
import {ProfileCardComponent} from './profile-card/profile-card.component';
import {ProfileMenuComponent} from './profile-menu/profile-menu.component';
import {NavbarComponent} from './navbar/navbar.component';
import {RecipePageComponent} from './recipe-page/recipe-page.component';
import {RecipesComponent} from './recipes/recipes.component';
import {SetupComponent} from './setup/setup.component';
import {SignupComponent} from './signup/signup.component';
import {UploadRecipeComponent} from './upload-recipe/upload-recipe.component'; 
import {ViewProfilesComponent} from './view-profiles/view-profiles.component'; 
import {UserPageComponent} from './user-page/user-page.component'; 
import {environment} from '../environments/environment';
import {MapComponent} from './map/map.component';
import {GoogleMapsModule} from '@angular/google-maps';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AutoCompleteComponent} from './auto-complete/auto-complete.component';
import {MyProfileTabComponent} from './my-profile-tab/my-profile-tab.component';
import {ChangeProfileImgComponent} from './change-profile-img/change-profile-img.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AutoCompleteComponent,
    ProfileMenuComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    SetupComponent,
    HomeComponent,
    ProfileCardComponent,
    ViewProfilesComponent,
    UserPageComponent,
    UploadRecipeComponent,
    MapComponent,
    RecipesComponent,
    RecipePageComponent,
    CurrentProfilePageComponent,
    MyProfileTabComponent,
    ChangeProfileImgComponent
  ],

  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSelectModule,
    MatToolbarModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    MatTabsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
