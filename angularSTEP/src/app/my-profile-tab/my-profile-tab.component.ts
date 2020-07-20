import {AngularFirestore} from '@angular/fire/firestore';
import {Component, OnInit, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../user';
import {Converter} from '../converter';

@Component({
  selector: 'app-my-profile-tab',
  templateUrl: './my-profile-tab.component.html',
  styleUrls: ['./my-profile-tab.component.scss'],
})
export class MyProfileTabComponent implements OnInit {
  @Input() userData!: User;
  aboutMeForm: FormControl | null = null;

  constructor(private afs: AngularFirestore, private fAuth: AngularFireAuth) {}

  ngOnInit(): void {}

  editValue(form: string) {
    switch (form) {
      case 'aboutme': {
        this.aboutMeForm = new FormControl(this.userData.aboutme);
        break;
      }
    }
  }

  cancelForm(form: string) {
    this.aboutMeForm = null;
  }

  onSubmit() {
    this.fAuth.currentUser.then(user => {
      if (
        user &&
        this.aboutMeForm &&
        this.aboutMeForm.valid &&
        this.aboutMeForm.value !== this.userData.aboutme
      ) {
        this.afs
          .collection('users')
          .doc(this.userData.uid)
          .ref.withConverter(new Converter().userConverter)
          .update({aboutme: this.aboutMeForm.value})
          .then(() => {
            this.userData.aboutme = this.aboutMeForm!.value;
            this.aboutMeForm = null;
          });
      }
    });
  }
}
