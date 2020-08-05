import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Component, OnInit, NgZone} from '@angular/core';
import {User} from '../user';
import {Converter} from '../converter';
import {Recipe} from '../recipe';
import {RecipeConverter} from '../recipe-converter';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  username = '';
  currentPageUid = '';
  loggedIn = false;
  displayName = '';
  picUrl = 'assets/images/blank-profile.png';
  usersFollowing: User[] = [];
  theirRecipes: Recipe[] = [];
  bio: string = '';
  profileLoaded = false;
  userFollowing = false;
  currentUserUid!: string;
  currentUserData: User | undefined = undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private fAuth: AngularFireAuth,
    private zone: NgZone
  ) {
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.loggedIn = true;
        this.currentUserUid = auth.uid;
      } else {
        this.loggedIn = false;
        this.currentUserData = undefined;
        this.userFollowing = false;
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.username = params.get("username");
      if (!this.username) {
        this.router.navigate(['/users']);
      } else {
        this.resetData();
        this.setUserData();
      }
    })
  }

  async setUserData() {
    const postUsername = await this.afs
      .doc('/usernames/' + this.username + '/')
      .ref.withConverter(new Converter().usernameConverter)
      .get();
    if (postUsername !== null && postUsername.data() !== undefined) {
      this.currentPageUid = postUsername.data()?.uid!;
      const postUser = await this.afs
        .doc('/users/' + this.currentPageUid + '/')
        .ref.withConverter(new Converter().userConverter)
        .get();
      this.userFollowing = await this.isUserFollowing();
      if (postUser !== null && postUser.data() !== undefined) {
        const user: User = postUser.data()!;
        this.displayName = user.displayName !== null ? user.displayName : '';
        this.picUrl =
          user.picUrl !== null && user.picUrl !== ''
            ? user.picUrl
            : 'assets/images/blank-profile.png';
        this.bio = user.aboutme;
        this.getRecipes(user.recipes);
        this.getFollowing(user.following);
        this.profileLoaded = true;
      } else {
        this.router.navigate(['/users']);
      }
    }
  }

  async isUserFollowing() {
    if (this.currentPageUid && this.loggedIn && this.currentUserUid) {
      const postUser = await this.afs.firestore
        .doc('/users/' + this.currentUserUid + '/')
        .withConverter(new Converter().userConverter)
        .get();
      if (postUser) {
        this.currentUserData = postUser.data();
        if (
          this.currentUserData &&
          this.currentUserData.following.indexOf(this.currentPageUid) > -1
        ) {
          return true;
        }
      }
    }
    return false;
  }

  setFollowing(follow: boolean){
    if (this.currentUserData && this.currentUserData.following) {
      if(follow){
        this.currentUserData.following.push(this.currentPageUid);
      } else {
        const index = this.currentUserData.following.indexOf(this.currentPageUid);
        if (index > -1) {
          this.currentUserData.following.splice(index, 1);
        }
      }
      this.fAuth.currentUser.then(user => {
        if (user) {
          this.afs
            .collection('users')
            .doc(this.currentUserUid)
            .ref.withConverter(new Converter().userConverter)
            .update({following: this.currentUserData!.following})
            .then(() => {
                this.userFollowing = follow;
            });
        }
      });
    }
  }

  follow() {
    this.zone.run(() => {
      this.setFollowing(true);
    })
  }
  

  unfollow() {
    this.zone.run(() => {
      this.setFollowing(false)
    })
  }

  async getFollowing(following: string[]){
    if(following){
      for(let i = 0; i < following.length; i++){
        const user = await this.afs
              .collection('users')
              .doc(following[i])
              .ref.withConverter(new Converter().userConverter).get();
        if(user && user.data()){
          this.usersFollowing.push(user.data()!);
        }
      }
    }
  }

  async getRecipes(recipes: string[]){
    if(recipes){
      for(let i = 0; i < recipes.length; i++){
        const recipe = await this.afs
              .collection('recipes')
              .doc(recipes[i])
              .ref.withConverter(new RecipeConverter().recipeConverter).get();
        if(recipe && recipe.data()){
          this.theirRecipes.push(recipe.data()!);
        }
      }
    }
  }

  goToUser(username: string) {
    this.resetData();
    this.zone.run(() => {
      this.router.navigate(['users/', username]);
    })
  }

  resetData() {
    this.profileLoaded = false;
    this.displayName = '';
    this.usersFollowing = [];
    this.theirRecipes = [];
    this.bio = '';

  }
}
