import {Component, OnInit, NgZone, Output, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
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
    private sanitizer: DomSanitizer
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
                this.uploadDone.emit(true);
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
    this.uploadDone.emit(true);
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
