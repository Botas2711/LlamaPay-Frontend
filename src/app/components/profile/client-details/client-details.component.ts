import { Component } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationActionComponent } from '../../confirmations/confirmation-action/confirmation-action.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css'
})
export class ClientDetailsComponent {
  client!: Client;
  isEditing = false;
  form!: FormGroup;
  fechaString!: String;
  
  constructor(private clientService: ClientService, private formBuilder: FormBuilder, private router: Router,
    private snackbar: MatSnackBar,private dialog: MatDialog, private userService: UserService){}


  ngOnInit() {
    this.cargarDatosCliente();
    this.cargarFormulario();
  }

  cargarFormulario(){
    this.form = this.formBuilder.group({
      firstName:["", [Validators.required]],
      lastName:["", [Validators.required]],
      email:["", [Validators.required]],
      phone: ["", [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      birthDate:["", [Validators.required]],
      gender:["", [Validators.required]],
      profilePicture: ["", [Validators.required]]
    });
  }

  cargarDatosCliente(){
    this.clientService.getClient().subscribe({
      next: (data:Client) => {
        this.client = data;
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
    let fecha: Date = new Date(this.client.birthdate + 'T00:00:00');

    this.form.patchValue({
        firstName: this.client.firstName,
        lastName: this.client.lastName,
        email: this.client.email,
        phone: this.client.phoneNumber,
        birthDate: fecha,
        gender: this.client.gender,
        profilePicture: this.client.profilePicture
    });
  }

  deseleccionarOpcion(value: string) {
    if (this.form.get('gender')?.value === value) {
      this.form.get('gender')?.reset();
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

  grabarCambios(){
    const fechaDesdeFormulario = this.form.get("birthDate")?.value;
    if (fechaDesdeFormulario instanceof Date) {
      this.fechaString = this.convertirDateToString(fechaDesdeFormulario);
    } else {
      this.fechaString = fechaDesdeFormulario;
    }

    const client: Client = {
      id: this.client.id,
      firstName: this.form.get("firstName")?.value,
      lastName: this.form.get("lastName")?.value,
      birthdate: this.fechaString,
      email: this.form.get("email")?.value,
      phoneNumber: (this.form.get("phone")?.value).toString(),
      gender: this.form.get("gender")?.value,
      profilePicture: this.form.get("profilePicture")?.value
    }

    this.clientService.editClient(client).subscribe({
      next:(data)=>{
        this.isEditing = false
        this.cargarDatosCliente(); 
        this.snackbar.open("La información fue actualizado correctamente","OK",{duration:2000})        
      },
      error: (err)=>{
        console.log(err);
        console.log(client);
        this.snackbar.open("Hubo un error en la actualización de la información","OK",{duration:2000})
      }
    })
  }

  Deshabilitar(){
    let dialogRef = this.dialog.open(ConfirmationActionComponent);
    dialogRef.afterClosed().subscribe(
      opcionSeleccionada => {
          if (opcionSeleccionada==true){
            this.userService.deleteUser().subscribe({
              next: (data)=>{
                this.userService.logout();
                document.documentElement.setAttribute('data-theme', "light");        
                this.router.navigate(["/login"]);
              }
            })
          }
      }
    )
  }
}
