import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Setting } from '../models/setting';
import { ClientService } from './client.service';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  ruta_servidor: string = "http://localhost:8080/api";
  recurso:string = "settings";

  constructor(private http:HttpClient, private clientService: ClientService) { }

  getSetting(){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<Setting>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId);
      })
    );  
    
  }

  editSetting(setting: Setting){
    return this.http.put<Setting>(this.ruta_servidor+"/"+this.recurso+"/"+setting.id.toString(),setting);
  }
}
