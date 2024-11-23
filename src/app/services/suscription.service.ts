import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Suscription } from '../models/suscription';
import { ClientService } from './client.service';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuscriptionService {
  ruta_servidor: string = "http://localhost:8080/api";
  recurso:string = "suscriptions";

  constructor(private http:HttpClient, private clientService: ClientService) { }

  newSuscription(){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.post<Suscription>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId + "/premiun/1",null);
      })
    );
  }
}
