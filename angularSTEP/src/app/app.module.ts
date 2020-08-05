import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AutoCompleteComponent} from './auto-complete/auto-complete.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChangeProfileImgComponent} from './change-profile-img/change-profile-img.component';
import {CurrentProfilePageComponent} from './current-profile-page/current-profile-page.component';
import {EmailComponent} from './email/email.component';
import {environment} from '../environments/environment';
import {GoogleMapsModule} from '@angular/google-maps';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {ItemDialogComponent} from './item-dialog/item-dialog.component';
import {LoginComponent} from './login/login.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MapComponent} from './map/map.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatRadioModule} from '@angular/material/radio';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {CurrentProfileTabComponent} from './current-profile-tab/current-profile-tab.component';
import {NavbarComponent} from './navbar/navbar.component';
import {NgAisModule} from 'angular-instantsearch';
import {NgModule} from '@angular/core';
import {ViewProfilesComponent} from './view-profiles/view-profiles.component'
import {ProfileCardComponent} from './profile-card/profile-card.component';
import {ProfileMenuComponent} from './profile-menu/profile-menu.component';
import {RecipeCardComponent} from './recipe-card/recipe-card.component';
import {RecipePageComponent} from './recipe-page/recipe-page.component';
import {RecipesComponent} from './recipes/recipes.component';
import {SearchBoxComponent} from './search-box/search-box.component';
import {SetupComponent} from './setup/setup.component';
import {ShoppingListComponent} from './shopping-list/shopping-list.component';
import {SignupComponent} from './signup/signup.component';
import {UploadRecipeComponent} from './upload-recipe/upload-recipe.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DiscoverPageComponent} from './discover-page/discover-page.component';
import {UserPageComponent} from './user-page/user-page.component'; 


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
    UserPageComponent,
    UploadRecipeComponent,
    RecipeCardComponent,
    MapComponent,
    RecipesComponent,
    RecipePageComponent,
    CurrentProfilePageComponent,
    ChangeProfileImgComponent,
    CurrentProfileTabComponent,
    ViewProfilesComponent,
    SearchBoxComponent,
    DiscoverPageComponent,
    ShoppingListComponent,
    ItemDialogComponent,
  ],
  entryComponents: [
    ItemDialogComponent,
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
    GoogleMapsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRippleModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    NgAisModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
