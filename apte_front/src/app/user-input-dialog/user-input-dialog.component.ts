import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-user-input-dialog',
    templateUrl: './user-input-dialog.component.html',
    styleUrls: ['./user-input-dialog.component.css'] 
  })


export class UserInputDialogComponent {
    userInput: string = '';
  
    constructor(
      public dialogRef: MatDialogRef<UserInputDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
  
    onCancel(): void {
      this.dialogRef.close();
    }
  
    onSubmit(): void {
      this.dialogRef.close(this.userInput);
    }
  }