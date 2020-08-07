// Copyright 2020 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Component, OnInit, NgZone, Output, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
  imgFile!: Blob;
  pictureUrl = '';
  progress = 0;
  previewImgUrl!: SafeUrl;
  @Output() uploadDone = new EventEmitter<boolean>();

  constructor(
    public fAuth: AngularFireAuth,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private router: Router,
    private _ngZone: NgZone,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ChangeProfileImgComponent>
  ) {
    this.fileForm = this.fb.group({
      image: [null, [requiredFileType]],
    });
  }

  ngOnInit() {}

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file: Blob = event.target.files[0];
      this.imgFile = file;
      //uploads preview of image
      this.previewImgUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      );
    }
  }

  addImage(uid: string) {
    const imageRef = this.storage.ref('images/' + uid + 'ProfileImage');
    if (imageRef) {
      imageRef.delete();
    }
    const task = this.storage
      .ref('images/' + uid + 'ProfileImage')
      .put(this.imgFile);
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
              .then(() => {
                this.dialogRef.close(true);
              });
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

  closeComponent() {
    this.dialogRef.close(false);
  }
}

function requiredFileType(control: FormControl) {
  const imageTypes: Array<string> = ['png', 'jpg', 'jpeg', 'gif'];
  const file = control.value;
  if (file && file.split('.')[1]) {
    const type = file.split('.')[1].toLowerCase();
    if (imageTypes.indexOf(type) > -1) {
      return null;
    }
  }
  return {fileType: true};
}
