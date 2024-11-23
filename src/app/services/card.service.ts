import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card } from '../models/card';
import { ClientService } from './client.service';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  ruta_servidor: string = "http://localhost:8080/api";
  recurso:string = "cards";

  constructor(private http:HttpClient, private clientService: ClientService) { }

  getCard(){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<Card>(this.ruta_servidor+"/"+this.recurso+"/client/"+clientId);
      })
    );  
    
  }

  editCard(card: Card){
    return this.http.put<Card>(this.ruta_servidor+"/"+this.recurso+"/"+card.id.toString(),card);
  }

  newCard(card: Card){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.post<Card>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId, card);
      })
    ); 
    
  }

  deleteCard(id: number){
    return this.http.delete<Card>(this.ruta_servidor+"/"+this.recurso+"/"+id.toString());
  }

}
