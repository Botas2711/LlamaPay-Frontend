import { Component } from '@angular/core';
import { Setting } from '../../../models/setting';
import { SettingService } from '../../../services/setting.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {
  setting!: Setting;
  languages = [
    { value: 'S', viewValue: 'Español' },
    { value: 'E', viewValue: 'Inglés' }
  ];
  theme!: String;
  size!: String;
  language!: String;


  constructor(private settingService: SettingService, private snackbar: MatSnackBar){}

  ngOnInit() {
    this.cargarConfiguracion();
  }

  cargarConfiguracion(){
    this.settingService.getSetting().subscribe({
      next: (data:Setting) => {
        this.setting = data;
        this.theme = this.setting.theme;
        this.size = this.setting.size;
        this.language = this.setting.language;
      },      
      error: (err) => {
        console.log(err);
      }
      
    });
  }

  cambiarTema(theme: String) {
    this.theme = theme;
    const themeAttribute = theme === 'B' ? 'light' : 'dark';

    localStorage.setItem('theme', themeAttribute.toString());
    console.log(localStorage.getItem('theme'));
    
    const setting: Setting = {
      id: this.setting.id,
      theme: this.theme,
      size: this.size,
      language: this.language
    }
    this.settingService.editSetting(setting).subscribe({
      next:(data)=>{
        this.cargarConfiguracion();
        document.documentElement.setAttribute('data-theme',themeAttribute);
        this.snackbar.open("La configuracion fue actualizado correctamente","OK",{duration:2000})        
      },
      error: (err)=>{
        console.log(err);
        console.log(setting);
        this.snackbar.open("Hubo un error en la actualización de la configuracion","OK",{duration:2000})
      }
    })

  }

  seleccionarSize(size: String) {
    this.size = size;
    console.log(this.size);
    const setting: Setting = {
      id: this.setting.id,
      theme: this.theme,
      size: this.size,
      language: this.language
    }
    this.settingService.editSetting(setting).subscribe({
      next:(data)=>{
        this.cargarConfiguracion();
        this.snackbar.open("La configuracion fue actualizado correctamente","OK",{duration:2000})        
      },
      error: (err)=>{
        console.log(err);
        console.log(setting);
        this.snackbar.open("Hubo un error en la actualización de la configuracion","OK",{duration:2000})
      }
    })
  }
  seleccionarIdioma(event: any){
    this.language = event.value;
    console.log(this.size);
    const setting: Setting = {
      id: this.setting.id,
      theme: this.theme,
      size: this.size,
      language: this.language
    }
    this.settingService.editSetting(setting).subscribe({
      next:(data)=>{
        this.cargarConfiguracion();
        this.snackbar.open("La configuracion fue actualizado correctamente","OK",{duration:2000})        
      },
      error: (err)=>{
        console.log(err);
        console.log(setting);
        this.snackbar.open("Hubo un error en la actualización de la configuracion","OK",{duration:2000})
      }
    })
  }
  
}
