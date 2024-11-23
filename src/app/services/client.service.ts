import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models/client';
import { ClientHasPremiunDTO } from '../models/clientHasPremiunDTO';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  ruta_servidor: string = "http://localhost:8080/api";
  recurso:string = "clients";

  constructor(private http:HttpClient) { }

  editClient(client: Client){
    return this.http.put<Client>(this.ruta_servidor+"/"+this.recurso+"/"+client.id.toString(),client);
  }

  getClientHasPremiun(){
    return this.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<ClientHasPremiunDTO>(this.ruta_servidor+"/"+this.recurso+"/premiun/"+clientId);
      })
    );
  }

  getClientIdByUserId(){
    return this.http.get<number>(this.ruta_servidor+"/"+this.recurso+"/user/"+(localStorage.getItem("user_id")));
  }

  getClient(){
    return this.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<Client>(this.ruta_servidor+"/"+this.recurso+"/"+clientId);
      })
    );  
  }

  newClient(client: Client, userId: number){
    return this.http.post<Client>(this.ruta_servidor+"/"+this.recurso+"/idUser/"+ userId.toString(), client);
  }
}
