import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoalService } from '../../../services/goal.service';
import { Goal } from '../../../models/goal';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-goal',
  templateUrl: './add-edit-goal.component.html',
  styleUrl: './add-edit-goal.component.css'
})
export class AddEditGoalComponent {
  formObjetivo!: FormGroup;
  fechaStringInicio!:string;
  fechaStringFin!:string;
  fechaDateInicio!:Date;
  fechaDateFin!:Date;
  goalId: number=0;


  constructor(private formBuilder: FormBuilder, private snackbar: MatSnackBar, 
    private goalService: GoalService, private router: Router,
    private activatedRoute: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<AddEditGoalComponent>){}
    
  ngOnInit(){
    this.cargarFormulario()
  }

  cargarFormulario(){
    this.formObjetivo = this.formBuilder.group({
      name:["", [Validators.required]],
      description:["", [Validators.required]],
      amount:["", [Validators.required, Validators.min(0)]],
      startDate:["", [Validators.required]],
      deadline:["", [Validators.required]],     
    });
    this.goalId = this.data.id;
    if (this.goalId!=0 && this.goalId!=undefined) {
      //Cuando queremos actualizar
      this.goalService.getGoalById(this.goalId).subscribe({
        next: (data:Goal)=>{     
          this.formObjetivo.get("name")?.setValue(data.name),
          this.formObjetivo.get("description")?.setValue(data.description),        
          this.formObjetivo.get("amount")?.setValue(data.amount);
          
          let fechaStart: Date = new Date(data.startDate + 'T00:00:00');
          this.formObjetivo.get("startDate")?.setValue(fechaStart);

          let fechaDead: Date = new Date(data.deadline + 'T00:00:00');
          this.formObjetivo.get("deadline")?.setValue(fechaDead);
        },
        error: (err)=>{
          console.log(err);
        }
      })

    } else{
      //Cuando queremos insertar
      this.goalId =0;
    }
  }

  convertirFechaInicioToString(event: any){
    let fechaDate:Date=event.value;
    this.fechaStringInicio = fechaDate.getFullYear() + "-" + (fechaDate.getMonth() + 1) + "-" + fechaDate.getDate();
  }

  convertirFechaFinToString(event: any){
    let fechaDate:Date=event.value;
    this.fechaStringFin = fechaDate.getFullYear() + "-" + (fechaDate.getMonth() + 1) + "-" + fechaDate.getDate();
  }

  convertirDateToString(fechaDate: Date): string {
    const year = fechaDate.getFullYear();
    const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  grabarObjetivo(){
    let dateToday: Date = new Date();

    let dateStart = this.formObjetivo.get("startDate")?.value;
    let endDate = this.formObjetivo.get("deadline")?.value;

    if(dateStart < dateToday){
      this.snackbar.open("La fecha de incio debe ser igual o mayor a la actual","OK",{duration:2000});
      return;
    }

    if(endDate < dateStart){
      this.snackbar.open("La fecha fin debe ser mayor a la fecha inicio","OK",{duration:2000});
      return;
    }

    const fechaStart= this.formObjetivo.get("startDate")?.value;
    if (fechaStart instanceof Date) {
      this.fechaStringInicio = this.convertirDateToString(fechaStart);
    } else {
      this.fechaStringInicio = fechaStart;
    }

    const fechaDead= this.formObjetivo.get("deadline")?.value;
    if (fechaDead instanceof Date) {
      this.fechaStringFin = this.convertirDateToString(fechaDead);
    } else {
      this.fechaStringFin = fechaDead;
    }

    console.log(this.fechaStringInicio);
    console.log(this.fechaStringFin);

    const goal: Goal = {
      id: this.goalId,
      name: this.formObjetivo.get("name")?.value,
      description: this.formObjetivo.get("description")?.value,
      amount: parseFloat(this.formObjetivo.get("amount")?.value),
      startDate: this.fechaStringInicio,
      deadline: this.fechaStringFin,
    }

    if (this.goalId==0){
      this.goalService.newGoal(goal).subscribe({
        next:(data)=>{
          this.dialogRef.close(true);              
          this.snackbar.open("El objetivo fue registrado correctamente","OK",{duration:2000})
        },
        error: (err)=>{
          console.log(err);
          this.snackbar.open("Hubo un error en el registro del objetivo","OK",{duration:2000})
        }
      })
    }
    else{
      this.goalService.editGoal(goal,this.goalId).subscribe({
        next:(data)=>{
          this.dialogRef.close(true); 
          this.snackbar.open("El objetivo fue actualizado correctamente","OK",{duration:2000})        
        },
        error: (err)=>{
          console.log(err);
          console.log(goal);
          this.snackbar.open("Hubo un error en la actualización del objetivo","OK",{duration:2000})
        }
      })
    }
  }

  cerrar(){
    this.dialogRef.close();
  }
}
