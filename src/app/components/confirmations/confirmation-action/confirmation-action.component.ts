import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-action',
  templateUrl: './confirmation-action.component.html',
  styleUrl: './confirmation-action.component.css'
})
export class ConfirmationActionComponent {
  constructor (private dialogRef: MatDialogRef<ConfirmationActionComponent>){}


  cancelar(){
    this.dialogRef.close(false);
  }

  confirmar(){
    this.dialogRef.close(true);
  }
}
