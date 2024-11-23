import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { SettingService } from '../../services/setting.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form!: FormGroup;
  theme!: String;
  ocultarPass:boolean=true;

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private router: Router, private snackbar: MatSnackBar, private settingService: SettingService){}

  ngOnInit(){
    this.cargarForm();
  }

  cargarForm(){
    this.form=this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(2)]],
      password: ["", [Validators.required]]
    });
  }

  PasswordVisibility(): void {
    this.ocultarPass = !this.ocultarPass;
  }

  login(){
    const user: User = {
      id:0,
      username: this.form.get("username")?.value,
      password: this.form.get("password")?.value,
      authorities: ""
    }

    this.userService.login(user).subscribe({
      next: (data) =>{
        this.router.navigate(["/list-flows"]);
      },
      error: (err) =>{
        console.log(err);
        this.snackbar.open("Hubo un error en la identificación del usuario", "OK",{duration:2000});
      }
    });
  }

  
}
