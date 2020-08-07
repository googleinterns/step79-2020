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

import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss']
})
export class ItemDialogComponent {
  form: FormGroup = new FormGroup({
    quantity: new FormControl(1, Validators.required),
  })
  selectedItem: string;
  add: boolean;
  remove: boolean;
  max: number;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) { 
    this.selectedItem = data.selectedItem;
    this.add =  data.add;
    this.remove = data.remove;
    this.max = data.max;
  }

  removeItem() {
    this.dialogRef.close(this.form.controls.quantity.value);
  }

  addItem() {
    this.dialogRef.close(this.form.controls.quantity.value);
  }

  cancel() {
    this.dialogRef.close();
  }

}
