import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReminderService } from '../../../services/reminder.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Reminder } from '../../../models/reminder';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-reminder',
  templateUrl: './add-edit-reminder.component.html',
  styleUrl: './add-edit-reminder.component.css'
})
export class AddEditReminderComponent {
  formRecordatorio!: FormGroup;
  fechaString!:string;
  fechaDate!:Date;
  reminderId: number=0;

  constructor(private formBuilder: FormBuilder, private snackbar: MatSnackBar, 
    private reminderService: ReminderService, private router: Router,
    private activatedRoute: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddEditReminderComponent>){}

  ngOnInit(){
    this.cargarFormulario()
  }

  cargarFormulario(){
    this.formRecordatorio = this.formBuilder.group({
      title:["", [Validators.required]],
      details:["", [Validators.required]],
      amount:["", [Validators.required, Validators.min(0)]],
      expirationDate:["", [Validators.required]],
    });

    this.reminderId = this.data.id;
    if (this.reminderId!=0 && this.reminderId!=undefined) {
      //Cuando queremos actualizar
      this.reminderService.getReminderById(this.reminderId).subscribe({
        next: (data:Reminder)=>{     
          this.formRecordatorio.get("title")?.setValue(data.title),
          this.formRecordatorio.get("details")?.setValue(data.details),        
          this.formRecordatorio.get("amount")?.setValue(data.amount);
          
          let fecha: Date = new Date(data.expirationDate + 'T00:00:00');
          this.formRecordatorio.get("expirationDate")?.setValue(fecha);
        },
        error: (err)=>{
          console.log(err);
        }
      })

    } else{
      //Cuando queremos insertar
      this.reminderId =0;
    }
  }

  convertirFechaToString(event: any){
    let fechaDate:Date=event.value;
    this.fechaString = fechaDate.getFullYear() + "-" + (fechaDate.getMonth() + 1) + "-" + fechaDate.getDate();
  }

  convertirDateToString(fechaDate: Date): string {
    const year = fechaDate.getFullYear();
    const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  grabarRecordatorio(){
    let dateToday: Date = new Date();

    let date = this.formRecordatorio.get("expirationDate")?.value;
    if(date < dateToday){
      this.snackbar.open("La fecha de expiracion debe ser mayor a la actual","OK",{duration:2000});
      return;
    }

    const fecha= this.formRecordatorio.get("expirationDate")?.value;
    if (fecha instanceof Date) {
      this.fechaString = this.convertirDateToString(fecha);
    } else {
      this.fechaString = fecha;
    }
    console.log(this.fechaString);
    
    const reminder: Reminder = {
      id: this.reminderId,
      title: this.formRecordatorio.get("title")?.value,
      details: this.formRecordatorio.get("details")?.value,
      amount: parseFloat(this.formRecordatorio.get("amount")?.value),
      expirationDate: this.fechaString
    }

    if (this.reminderId==0){
      this.reminderService.newReminder(reminder).subscribe({
        next:(data)=>{
          this.dialogRef.close(true);       
          this.snackbar.open("El recordatorio fue registrado correctamente","OK",{duration:2000})
        },
        error: (err)=>{
          console.log(err);
          this.snackbar.open("Hubo un error en el registro del recordatorio","OK",{duration:2000})
        }
      })
    }
    else{
      this.reminderService.editReminder(reminder,this.reminderId).subscribe({
        next:(data)=>{
          this.dialogRef.close(true);
          console.log(reminder);  
          this.snackbar.open("El recordatorio fue actualizado correctamente","OK",{duration:2000})        
        },
        error: (err)=>{
          console.log(err);
          console.log(reminder);
          this.snackbar.open("Hubo un error en la actualización del recordatorio","OK",{duration:2000})
        }
      })
    }
  }

  cerrar(){
    this.dialogRef.close();
  }

}
