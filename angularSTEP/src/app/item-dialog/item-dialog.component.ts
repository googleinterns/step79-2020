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

  close() {
    this.dialogRef.close(this.form.controls.quantity.value);
  }

  cancel() {
    this.dialogRef.close();
  }

}
