import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationActionComponent } from '../confirmations/confirmation-action/confirmation-action.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  selectedTab: string = "clientDetails";
  constructor(private dialog: MatDialog, private router: Router, private userService: UserService){}

  selectTab(tab: string) {
      this.selectedTab = tab;
  }

  logout(){
    let dialogRef = this.dialog.open(ConfirmationActionComponent);
    dialogRef.afterClosed().subscribe(
      opcionSeleccionada => {
          if (opcionSeleccionada==true){
            this.userService.logout();
            document.documentElement.setAttribute('data-theme', "light");        
            this.router.navigate(["/login"]);
          }
      }
    )
  }
      
}
