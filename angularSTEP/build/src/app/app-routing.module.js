"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@angular/router");
const email_component_1 = require("./email/email.component");
const home_component_1 = require("./home/home.component");
const login_component_1 = require("./login/login.component");
const core_1 = require("@angular/core");
const signup_component_1 = require("./signup/signup.component");
const user_page_component_1 = require("./user-page/user-page.component");
const view_profiles_component_1 = require("./view-profiles/view-profiles.component");
const upload_recipe_component_1 = require("./upload-recipe/upload-recipe.component");
const confirm_component_1 = require("./confirm/confirm.component");
const current_profile_page_component_1 = require("./current-profile-page/current-profile-page.component");
const recipe_page_component_1 = require("./recipe-page/recipe-page.component");
const recipes_component_1 = require("./recipes/recipes.component");
const routes = [{ path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'signup', component: signup_component_1.SignupComponent },
    { path: 'login-email', component: email_component_1.EmailComponent },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'users', component: view_profiles_component_1.ViewProfilesComponent },
    { path: 'users/:username', component: user_page_component_1.UserPageComponent },
    { path: 'upload-recipe', component: upload_recipe_component_1.UploadRecipeComponent },
    { path: 'confirm-upload', component: confirm_component_1.ConfirmComponent },
    { path: 'recipes', component: recipes_component_1.RecipesComponent },
    { path: 'recipes/:id', component: recipe_page_component_1.RecipePageComponent },
    { path: 'myprofile', component: current_profile_page_component_1.CurrentProfilePageComponent }];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map