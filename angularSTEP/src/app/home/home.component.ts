import { AngularFirestore, AngularFirestoreCollection } from  "@angular/fire/firestore";
import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from  "@angular/fire/auth";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from  "@angular/router";

//basic home page
interface User {
  username: string;
  displayName: string;
  email: string;
  photo: string;
  following: Array<string>;
  recipes: Array<string>;
  wishlist: Array<string>;
  shoppinglist: Array<string>;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name: any;
  obj: any;
  intA: any;
  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(public fAuth: AngularFireAuth, private router: Router, private http: HttpClient, private afs: AngularFirestore) { 
    this.fAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.name = auth.displayName;
      }
      if (!auth) {
        this.router.navigate(['/login']);
      }
    })
  }

  logout() {
    this.fAuth.signOut();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.userCollection = this.afs.collection('users');
    this.users = this.userCollection.valueChanges(); 
  }
}
