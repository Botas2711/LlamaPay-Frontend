import { Component } from '@angular/core';
import { GoalResponseDTO } from '../../../models/goalResponseDTO';
import { GoalService } from '../../../services/goal.service';
import { ConfirmationDeleteComponent } from '../../confirmations/confirmation-delete/confirmation-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { AddEditGoalComponent } from '../add-edit-goal/add-edit-goal.component';
import { ClientService } from '../../../services/client.service';
import { ClientHasPremiunDTO } from '../../../models/clientHasPremiunDTO';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-goals',
  templateUrl: './list-goals.component.html',
  styleUrl: './list-goals.component.css'
})
export class ListGoalsComponent {
  dsGoals!: GoalResponseDTO [];
  hasPremiun!: boolean;

  constructor(private goalService: GoalService, private dialog: MatDialog, private clientService: ClientService,
    private snackbar: MatSnackBar){}

  ngOnInit() {
    this.VerificarClientePremiun();
    this.cargarObjetivos();
  }


  VerificarClientePremiun(){
    this.clientService.getClientHasPremiun().subscribe({
      next: (data: ClientHasPremiunDTO)=>{
        this.hasPremiun = data.hasPremiun;
      }
    })
  }

  cargarObjetivos(){
    this.goalService.getGoalsClientId().subscribe({
      next: (data: GoalResponseDTO[]) => {
        this.dsGoals = data;
      }
    });
  }

  borrarGoal(id: number){
    let dialogRef = this.dialog.open(ConfirmationDeleteComponent);
    dialogRef.afterClosed().subscribe(
      opcionSeleccionada => {
          if (opcionSeleccionada==true){

            this.goalService.deleteGoal(id).subscribe({
              next: (data)=> {
                  this.cargarObjetivos();
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

  Validaciones(goalId?: number){
    if (this.hasPremiun){
      return true;
    } 
    if (!this.hasPremiun && !goalId && this.dsGoals.length == 0){
      return true;
    }
    if (!this.hasPremiun && goalId && this.dsGoals.length == 1){
      return true;
    }
    return false;
  }

  AbrirAddEditGoal(goalId?: number) {
    console.log(this.dsGoals.length)
    console.log(this.hasPremiun)
    if(this.Validaciones(goalId)){
      const dialogRef = this.dialog.open(AddEditGoalComponent, {
        width: '500px',
        height: '870px',
        disableClose: true,
        data: { id: goalId }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.cargarObjetivos();
        }
      });
    }
    else{
      this.snackbar.open("Hazte Premiun para poder registrar más objetivos","OK",{duration:2000});
    }

  }
}
