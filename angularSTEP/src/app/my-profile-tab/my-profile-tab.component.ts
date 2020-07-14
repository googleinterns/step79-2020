import {
  AngularFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import { Component, OnInit, NgZone, Input } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { Converter } from '../converter'

@Component({
  selector: 'app-my-profile-tab',
  templateUrl: './my-profile-tab.component.html',
  styleUrls: ['./my-profile-tab.component.scss']
})
export class MyProfileTabComponent implements OnInit {
  @Input() userData!: User;
  
  constructor() { }

  ngOnInit(): void {
  }

}