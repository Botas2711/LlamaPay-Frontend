import { Component } from '@angular/core';
import { DailyBit } from '../../models/dailyBit';
import { DailyBitService } from '../../services/daily-bit.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DailyBitDTO } from '../../models/dailyBitDTO';

@Component({
  selector: 'app-daily-bit',
  templateUrl: './daily-bit.component.html',
  styleUrl: './daily-bit.component.css'
})
export class DailyBitComponent {
  dailyBit!: DailyBit;
  dailyBitId: number = 0;
  generoBitDiario: boolean = false;

  constructor(private dailyBitService: DailyBitService, private snackbar: MatSnackBar){}

  ngOnInit(){
    this.cargarBitDiario();
  }

  convertirDateToString(fechaDate: Date): string {
    const year = fechaDate.getFullYear();
    const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  GenerarBitDiario(){
    let fechaActual: Date = new Date();
    let fechaString = this.convertirDateToString(fechaActual);
    const dailyBit: DailyBitDTO = {
      id: 0,
      date: fechaString
    };

    this.dailyBitService.newDailyBit(dailyBit).subscribe({
      next:(data: DailyBit)=>{
        this.cargarBitDiario();
        this.generoBitDiario = true;
        this.snackbar.open("El Bit fue generado correctamente","OK",{duration:2000})
      },
      error: (err)=>{
        console.log(err);
        this.snackbar.open("Hubo un error en la generacion del bit","OK",{duration:2000})
      }
    })
  }

  Abrirpanel(){
    this.dailyBitService.updateDailyBit(this.dailyBitId).subscribe({
      next:(data: DailyBit)=>{
        console.log("entre al panel");
        this.snackbar.open("El bit fue visto","OK",{duration:2000})
      },
      error: (err)=>{
        console.log(err);
        this.snackbar.open("No se podido visualizar el bit","OK",{duration:2000})
      }
    })
  }

  cargarBitDiario(){
    let fechaActual: Date = new Date();
    let fechaString = this.convertirDateToString(fechaActual);
    this.dailyBitService.getDailyBit(fechaString).subscribe({
      next: (data: DailyBit) =>{
        this.dailyBit = data;
        this.dailyBitId = data.id;
        this.generoBitDiario = true;
      }
    })
  }
}
