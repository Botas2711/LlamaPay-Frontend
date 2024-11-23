import { Component } from '@angular/core';
import { SettingService } from '../../services/setting.service';
import { Setting } from '../../models/setting';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  theme!: String;
  constructor(private settingService: SettingService, private userService: UserService){}

  ngOnInit() {
    console.log(localStorage.getItem("theme"));
  
    if (localStorage.getItem('theme') === null) {
      this.cargarConfiguracion();
    } else {
      this.theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', this.theme.toString());
    }
  }
  
  cargarConfiguracion() {
    this.settingService.getSetting().subscribe({
      next: (data: Setting) => {
        this.theme = data.theme;
        console.log(this.theme);
  
        const themeAttribute = this.theme === 'B' ? 'light' : 'dark';
        localStorage.setItem("theme", themeAttribute.toString());
        document.documentElement.setAttribute('data-theme', themeAttribute);
        console.log(localStorage.getItem("theme"));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  usuarioLogueado(){
    return this.userService.hayUsuarioLogueado()
  }

}
