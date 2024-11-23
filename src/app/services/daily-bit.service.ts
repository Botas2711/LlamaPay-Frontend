import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { switchMap } from 'rxjs';
import { DailyBit } from '../models/dailyBit';
import { DailyBitDTO } from '../models/dailyBitDTO';

@Injectable({
  providedIn: 'root'
})
export class DailyBitService {
  ruta_servidor: string = "http://localhost:8080/api";
  recurso: string = "dailyBits"

  constructor(private http:HttpClient, private clientService: ClientService) { }

  newDailyBit(dailyBit: DailyBitDTO){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.post<DailyBit>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId, dailyBit);
      })
    );
  }

  getDailyBit(date: String ){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<DailyBit>(this.ruta_servidor+"/"+this.recurso+ "/client/" + clientId + "/date/" + date);
      })
    );
  }

  updateDailyBit(id: number){
    return this.http.put<DailyBit>(this.ruta_servidor+"/"+this.recurso+ "/" + id.toString(), null);
  }
}
