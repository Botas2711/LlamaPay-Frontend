import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { UserClientDTO } from '../../models/userClientDTO';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  form!: FormGroup;
  ocultarPass:boolean=true;
  ocultarPassConfirme:boolean=true;
  termsCheck:boolean=true;
  fechaString!: String;
  
  constructor(private formBuilder: FormBuilder, private userService: UserService, private snackbar: MatSnackBar,
    private clientService: ClientService, private router: Router){}

  ngOnInit(){
    this.cargarFormulario()
  }

  cargarFormulario(){
    this.form = this.formBuilder.group({
      firstName:["", [Validators.required, Validators.minLength(3)]],
      lastName:["", [Validators.required, Validators.minLength(3)]],
      email:["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.min(0)]],
      birthDate:["", [Validators.required]],
      username:["", [Validators.required]],
      password:["", [Validators.required]],
      passwordConfirme:["", [Validators.required]],
      gender:["", [Validators.required]],
      terms: [false, [Validators.requiredTrue]]  
    });
  }
  
  deseleccionarOpcion(value: string) {
    if (this.form.get('gender')?.value === value) {
      this.form.get('gender')?.reset();
    }
  }

  PasswordVisibility(): void {
    this.ocultarPass = !this.ocultarPass;
  }

  PasswordConfirmeVisibility(): void {
    this.ocultarPassConfirme = !this.ocultarPassConfirme;
  }

  convertirFechaToString(event: any){
    let fechaDate:Date=event.value;
    this.fechaString = fechaDate.getFullYear() + "-" + (fechaDate.getMonth() + 1) + "-" + fechaDate.getDate();
  }

  formatFecha(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  register() {
    let apellidos : String = this.form.get('lastName')?.value;
    if(apellidos.length < 6){
      this.snackbar.open("Debe ingresar sus dos apellidos", "OK", { duration: 2000 });
      return;
    }

    if (!this.form.get('terms')?.value) {
      this.snackbar.open("Debes aceptar los términos y condiciones para continuar", "OK", { duration: 2000 });
      return;
    }

    if (this.form.get('passwordConfirme')?.value !== this.form.get('password')?.value) {
      this.snackbar.open("Las contraseñas no coinciden", "OK", { duration: 2000 });
      return;
    }
    const fecha = this.formatFecha(this.form.get("birthDate")?.value);
    
    const user: User = {
      id: 0,
      username: this.form.get("username")?.value,
      password: this.form.get("password")?.value,
      authorities: "CLIENTE"
    };
  
    const client: Client = {
      id: 0,
      firstName: this.form.get("firstName")?.value,
      lastName: this.form.get("lastName")?.value,
      email: this.form.get("email")?.value,
      phoneNumber: this.form.get("phone")?.value,
      birthdate: fecha,
      gender: this.form.get("gender")?.value,
      profilePicture: "https://i.pinimg.com/474x/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg"
    };

    const userClient : UserClientDTO = {
      userDTO: user,
      clientDTO: client
    }

    this.userService.newUser(userClient).subscribe({
      next: (data: User) =>{
        this.router.navigate(["/login"]);
        this.snackbar.open("El usuario y cliente fueron registrados correctamente", "OK", { duration: 2000 });
      },
      error: (err) => {
        console.log(err);
        this.snackbar.open("Hubo un error en el registro del usuario", "OK", { duration: 2000 });
      }
    })
  }
}
