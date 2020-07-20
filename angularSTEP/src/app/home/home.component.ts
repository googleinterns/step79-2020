import {
  AngularFirestore
} from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(public fAuth: AngularFireAuth, private afs: AngularFirestore) {}

  ngOnInit() {}
}
