import {Component, OnInit, NgZone } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {Converter} from '../converter';

@Component({
  selector: 'app-change-profile-img',
  templateUrl: './change-profile-img.component.html',
  styleUrls: ['./change-profile-img.component.scss'],
})
export class ChangeProfileImgComponent implements OnInit {
  error = '';
  fileForm: FormGroup;
  hide = true;
  imgFile!: object;
  pictureUrl = '';
  progress = 0;

  constructor(
    public fAuth: AngularFireAuth,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private router: Router,
    private _ngZone: NgZone
  ) {
    this.fileForm = this.fb.group({
      image: [null, [requiredFileType]],
    });
  }

  logout() {
    this.fAuth.signOut();
  }

  ngOnInit() {}

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imgFile = file;
    }
  }

  addImage(uid: string) {
    const imageRef = this.storage.ref('images/' + uid + 'ProfileImage');
    if (imageRef) {
      imageRef.delete();
    }
    const task = this.storage.ref('images/' + uid + 'ProfileImage').put(this.imgFile);
    task.percentageChanges().subscribe(num => {
      this.progress = num ? num : 0;
    });
    task.then(() => {
      this.storage
        .ref('images/' + uid + 'ProfileImage')
        .getDownloadURL()
        .subscribe(url => {
          if (url) {
            this.afs
              .collection('users')
              .doc(uid)
              .ref.withConverter(new Converter().userConverter)
              .update({picUrl: url})
          }
        });
    });
    return null;
  }

  onFileSubmit() {
    this.fAuth.currentUser.then(user => {
      if (user) {
        this.addImage(user.uid);
      } else {
        this._ngZone.run(() => {
          this.router.navigate(['/home']);
        });
      }
    });
  }
}

function requiredFileType(control: FormControl) {
  const imageTypes: Array<string> = ['png', 'jpg', 'jpeg', 'gif'];
  const file = control.value;
  if (file !== null) {
    const type = file.split('.')[1].toLowerCase();
    if (imageTypes.indexOf(type) > -1) {
      return null;
    }
  }
  return {fileType: true};
}
