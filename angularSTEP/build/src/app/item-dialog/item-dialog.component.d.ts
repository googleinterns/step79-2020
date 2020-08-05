import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
export declare class ItemDialogComponent {
    private fb;
    private dialogRef;
    form: FormGroup;
    selectedItem: string;
    add: boolean;
    remove: boolean;
    max: number;
    constructor(fb: FormBuilder, dialogRef: MatDialogRef<ItemDialogComponent>, data: any);
    close(): void;
    cancel(): void;
}
