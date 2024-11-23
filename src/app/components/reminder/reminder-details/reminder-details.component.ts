import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReminderService } from '../../../services/reminder.service';
import { Reminder } from '../../../models/reminder';
import { AddEditReminderComponent } from '../add-edit-reminder/add-edit-reminder.component';
import { ConfirmationDeleteComponent } from '../../confirmations/confirmation-delete/confirmation-delete.component';

@Component({
  selector: 'app-reminder-details',
  templateUrl: './reminder-details.component.html',
  styleUrl: './reminder-details.component.css'
})
export class ReminderDetailsComponent {
  reminder!: Reminder;
  constructor(private reminderService: ReminderService,
    public dialogRef: MatDialogRef<ReminderDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) {}

  ngOnInit(){
    this.cargarRecordatorio();
  }

  cargarRecordatorio(){
    this.reminderService.getReminderById(this.data.id).subscribe({
      next: (data:Reminder)=>{     
        this.reminder = data;
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  cerrar(){
    this.dialogRef.close(true);   
  }

  editarRecordatorio(){
    const dialogRef = this.dialog.open(AddEditReminderComponent, {
      width: '500px',
      height:'760px',
      disableClose: true,
      data: { id: this.data.id}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarRecordatorio();
      }
    });
  }

  borrarReminder(){
    let dialogRef = this.dialog.open(ConfirmationDeleteComponent);
    dialogRef.afterClosed().subscribe(
      opcionSeleccionada => {
          if (opcionSeleccionada==true){
            this.reminderService.deleteReminder(this.data.id).subscribe({
              next: (data)=> {
                this.dialogRef.close(true);
              }
              ,      
              error: (err) => {
                console.log(err);
              }
            })

          }
      }
    )
  }

}
