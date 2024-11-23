import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardService } from '../../services/card.service';
import { Card } from '../../models/card';
import { Premiun } from '../../models/premiun';
import { PremiunService } from '../../services/premiun.service';
import { ClientHasPremiunDTO } from '../../models/clientHasPremiunDTO';
import { ClientService } from '../../services/client.service';
import { SuscriptionService } from '../../services/suscription.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {
  isClick = false;
  card!: Card
  form!: FormGroup;
  cardId: number = 0;
  premiun!: Premiun;
  hasPremiun = false;
  selectedMonth = null;
  selectedYear = null;
  month!: String;
  year!: String;

  months = [
    { value: "01" },
    { value: "02" },
    { value: "03" },
    { value: "04" },
    { value: "05" },
    { value: "06" },
    { value: "07" },
    { value: "08" },
    { value: "09" },
    { value: "10" },
    { value: "11" },
    { value: "12" }
  ];

  years = Array.from({ length: 10 }, (v, i) => ({ value: (2025 + i).toString() }));

  constructor(private cardService: CardService, private formBuilder: FormBuilder, private snackbar: MatSnackBar,
    private premiunService: PremiunService, private clientService: ClientService, private suscriptionService: SuscriptionService){}

  async ngOnInit() {
    await this.verificarPremiun();
    this.cargarFormulario();
    this.cargarPremiun();
    console.log(this.hasPremiun);
  }

  cargarFormulario(){
    this.form = this.formBuilder.group({
      cardNumber:["", [Validators.required]],
      ownerName:["", [Validators.required]],
      cvv:["", [Validators.required]],
      month: ["", [Validators.required]],
      year: ["", [Validators.required]]
    });
  }

  cargarPremiun(){
    this.premiunService.getPremiun().subscribe({
      next: (data:Premiun) => {
        this.premiun = data;
      },      
      error: (err) => {
        console.log(err);
      }
    });
  }

  seleccionarMes(event: any){
    this.month = event.value;
    this.selectedMonth = event.value;
  }
  
  seleccionarAnio(event: any){
    this.year = event.value;
    this.selectedYear = event.value;
  }

  async verificarPremiun() {
    try {
      const data = await firstValueFrom(this.clientService.getClientHasPremiun());
      this.hasPremiun = data.hasPremiun;
    } catch (err) {
      console.log(err);
    }
  }

  JuntarFechas(month: String, year: String): string {
    return (month+"-"+year);
  }

  suscribirse(){
    this.isClick = !this.isClick;
  }

  guardarTarjeta(){
    this.card = {
      id: this.cardId,
      cardNumber: this.form.get("cardNumber")?.value,
      ownerName: this.form.get("ownerName")?.value,
      cvv: this.form.get("cvv")?.value,
      expirationDate: this.JuntarFechas(this.form.get("month")?.value,(this.form.get("year")?.value))
    }

    this.cardService.newCard(this.card).subscribe({
      next:(data)=>{
        this.isClick = false
        this.snackbar.open("La tarjeta fue registrada correctamente","OK",{duration:2000})
        this.suscriptionService.newSuscription().subscribe({
          next:(data)=>{ 
            this.snackbar.open("Se registro la suscripcion","OK",{duration:2000})
            this.ngOnInit();
          }
        })       
      },
      error: (err)=>{
        console.log(err);
        console.log(this.card);
        this.snackbar.open("Hubo un error en el registro de la tarjeta","OK",{duration:2000})
      }
    })
  }

}
