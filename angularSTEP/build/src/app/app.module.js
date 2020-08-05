"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const platform_browser_1 = require("@angular/platform-browser");
const forms_1 = require("@angular/forms");
const auth_1 = require("@angular/fire/auth");
const database_1 = require("@angular/fire/database");
const fire_1 = require("@angular/fire");
const firestore_1 = require("@angular/fire/firestore");
const storage_1 = require("@angular/fire/storage");
const app_component_1 = require("./app.component");
const app_routing_module_1 = require("./app-routing.module");
const auto_complete_component_1 = require("./auto-complete/auto-complete.component");
const animations_1 = require("@angular/platform-browser/animations");
const current_profile_page_component_1 = require("./current-profile-page/current-profile-page.component");
const email_component_1 = require("./email/email.component");
const environment_1 = require("../environments/environment");
const google_maps_1 = require("@angular/google-maps");
const home_component_1 = require("./home/home.component");
const http_1 = require("@angular/common/http");
const item_dialog_component_1 = require("./item-dialog/item-dialog.component");
const login_component_1 = require("./login/login.component");
const map_component_1 = require("./map/map.component");
const autocomplete_1 = require("@angular/material/autocomplete");
const button_1 = require("@angular/material/button");
const card_1 = require("@angular/material/card");
const dialog_1 = require("@angular/material/dialog");
const divider_1 = require("@angular/material/divider");
const form_field_1 = require("@angular/material/form-field");
const icon_1 = require("@angular/material/icon");
const input_1 = require("@angular/material/input");
const menu_1 = require("@angular/material/menu");
const core_1 = require("@angular/material/core");
const select_1 = require("@angular/material/select");
const stepper_1 = require("@angular/material/stepper");
const tabs_1 = require("@angular/material/tabs");
const toolbar_1 = require("@angular/material/toolbar");
const my_profile_tab_component_1 = require("./my-profile-tab/my-profile-tab.component");
const navbar_component_1 = require("./navbar/navbar.component");
const core_2 = require("@angular/core");
const profile_card_component_1 = require("./profile-card/profile-card.component");
const profile_menu_component_1 = require("./profile-menu/profile-menu.component");
const recipe_card_component_1 = require("./recipe-card/recipe-card.component");
const recipe_page_component_1 = require("./recipe-page/recipe-page.component");
const recipes_component_1 = require("./recipes/recipes.component");
const setup_component_1 = require("./setup/setup.component");
const shopping_list_component_1 = require("./shopping-list/shopping-list.component");
const signup_component_1 = require("./signup/signup.component");
const upload_recipe_component_1 = require("./upload-recipe/upload-recipe.component");
const user_page_component_1 = require("./user-page/user-page.component");
const view_profiles_component_1 = require("./view-profiles/view-profiles.component");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_2.NgModule({
        declarations: [
            app_component_1.AppComponent,
            navbar_component_1.NavbarComponent,
            auto_complete_component_1.AutoCompleteComponent,
            profile_menu_component_1.ProfileMenuComponent,
            login_component_1.LoginComponent,
            email_component_1.EmailComponent,
            signup_component_1.SignupComponent,
            setup_component_1.SetupComponent,
            home_component_1.HomeComponent,
            profile_card_component_1.ProfileCardComponent,
            view_profiles_component_1.ViewProfilesComponent,
            user_page_component_1.UserPageComponent,
            upload_recipe_component_1.UploadRecipeComponent,
            recipe_card_component_1.RecipeCardComponent,
            map_component_1.MapComponent,
            recipes_component_1.RecipesComponent,
            recipe_page_component_1.RecipePageComponent,
            current_profile_page_component_1.CurrentProfilePageComponent,
            my_profile_tab_component_1.MyProfileTabComponent,
            shopping_list_component_1.ShoppingListComponent,
            item_dialog_component_1.ItemDialogComponent,
        ],
        entryComponents: [
            item_dialog_component_1.ItemDialogComponent,
        ],
        imports: [
            fire_1.AngularFireModule.initializeApp(environment_1.environment.firebase),
            auth_1.AngularFireAuthModule,
            database_1.AngularFireDatabaseModule,
            storage_1.AngularFireStorageModule,
            firestore_1.AngularFirestoreModule,
            app_routing_module_1.AppRoutingModule,
            platform_browser_1.BrowserModule,
            animations_1.BrowserAnimationsModule,
            forms_1.FormsModule,
            http_1.HttpClientModule,
            card_1.MatCardModule,
            dialog_1.MatDialogModule,
            divider_1.MatDividerModule,
            form_field_1.MatFormFieldModule,
            button_1.MatButtonModule,
            form_field_1.MatFormFieldModule,
            input_1.MatInputModule,
            icon_1.MatIconModule,
            form_field_1.MatFormFieldModule,
            autocomplete_1.MatAutocompleteModule,
            menu_1.MatMenuModule,
            core_1.MatRippleModule,
            select_1.MatSelectModule,
            stepper_1.MatStepperModule,
            toolbar_1.MatToolbarModule,
            forms_1.ReactiveFormsModule,
            google_maps_1.GoogleMapsModule,
            tabs_1.MatTabsModule,
        ],
        providers: [],
        bootstrap: [app_component_1.AppComponent],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map