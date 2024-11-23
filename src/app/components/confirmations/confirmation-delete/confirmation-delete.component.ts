import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-delete',
  templateUrl: './confirmation-delete.component.html',
  styleUrl: './confirmation-delete.component.css'
})
export class ConfirmationDeleteComponent {
  constructor (private dialogRef: MatDialogRef<ConfirmationDeleteComponent>){}


  cancelar(){
    this.dialogRef.close(false);
  }

  confirmar(){
    this.dialogRef.close(true);
  }

}
