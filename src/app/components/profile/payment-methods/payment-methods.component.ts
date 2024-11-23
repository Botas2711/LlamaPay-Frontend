import { Component } from '@angular/core';
import { Card } from '../../../models/card';
import { CardService } from '../../../services/card.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDeleteComponent } from '../../confirmations/confirmation-delete/confirmation-delete.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.css'
})
export class PaymentMethodsComponent {
  card!: Card;
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

  years = Array.from({ length: 51 }, (v, i) => ({ value: (2000 + i).toString() }));

  isEditing = false;
  form!: FormGroup;

  constructor(private cardService: CardService, private formBuilder: FormBuilder, private snackbar: MatSnackBar,
    private dialog: MatDialog){}

  ngOnInit() {
    this.cargarTarjeta();
    this.cargarFormulario()
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

  cargarTarjeta(){
    this.cardService.getCard().subscribe({
      next: (data:Card) => {
        this.card = data;
      },      
      error: (err) => {
        console.log(err);
      }
    });
  }

  editando() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.CargarInformación();
    }
  }

  CargarInformación() {
    const [month, year] = this.card.expirationDate.split("-");
    this.form.patchValue({
        cardNumber: this.card.cardNumber,
        ownerName: this.card.ownerName,
        cvv: this.card.cvv,
        month: month,
        year: year
    });
  }

  JuntarFechas(month: String, year: String): string {
    return (month+"-"+year);
  }

  guardarTarjeta(){
    const card: Card = {
      id: this.card.id,
      cardNumber: this.form.get("cardNumber")?.value,
      ownerName: this.form.get("ownerName")?.value,
      cvv: this.form.get("cvv")?.value,
      expirationDate: this.JuntarFechas(this.form.get("month")?.value,(this.form.get("year")?.value))
    }

    this.cardService.editCard(card).subscribe({
      next:(data)=>{
        this.isEditing = false
        this.cargarTarjeta();
        this.snackbar.open("La tarjeta fue actualizado correctamente","OK",{duration:2000})        
      },
      error: (err)=>{
        console.log(err);
        console.log(card);
        this.snackbar.open("Hubo un error en la actualización de la tarjeta","OK",{duration:2000})
      }
    })
  }

  eliminarTarjeta(){
    let dialogRef = this.dialog.open(ConfirmationDeleteComponent);
    dialogRef.afterClosed().subscribe(
      opcionSeleccionada => {
          if (opcionSeleccionada==true){

            this.cardService.deleteCard(this.card.id).subscribe({
              next: (data)=> {
                this.cargarTarjeta();
                this.snackbar.open("La tarjeta fue eliminada correctamente","OK",{duration:2000}) 
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
