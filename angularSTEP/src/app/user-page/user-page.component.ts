import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {Converter} from '../converter';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  username = '';
  loggedIn = false;
  displayName = '';
  picUrl = 'assets/images/blank-profile.png';
  profileLoaded = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

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
      const postUser = await this.afs
        .doc('/users/' + postUsername.data()?.uid + '/')
        .ref.withConverter(new Converter().userConverter)
        .get();
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
}
