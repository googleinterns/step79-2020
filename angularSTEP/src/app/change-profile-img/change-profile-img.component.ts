import {Component, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
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

  constructor(public fAuth: AngularFireAuth, private fb: FormBuilder) {
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

  onFileSubmit() {
    //add image to database
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
