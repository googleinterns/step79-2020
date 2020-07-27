import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Component, OnInit, NgZone} from '@angular/core';
import {User} from '../user';
import {Converter} from '../converter';
import { templateJitUrl } from '@angular/compiler';

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
    const username = this.activatedRoute.snapshot.paramMap.get('username');
    if (username === null) {
      this.router.navigate(['/users']);
    } else {
      this.username = username;
      this.setUserData();
    }
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
}
