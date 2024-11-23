import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MoneyFlowResponseDTO } from '../models/moneyFlowResponseDTO';
import { MoneyFlow } from '../models/moneyFlow';
import { ClientService } from './client.service';
import { switchMap } from 'rxjs';
import { MoneyFlowSummaryDTO } from '../models/moneyFlowSummaryDTO';
import { MoneyFlowTypeDTO } from '../models/moneyFlowTypeDTO';
import { MoneyFlowCategoryDTO } from '../models/moneyFlowCategoryDTO';

@Injectable({
  providedIn: 'root'
})
export class MoneyFlowService {

  ruta_servidor: string = "http://localhost:8080/api";
  recurso: string = "moneyFlows"

  constructor(private http:HttpClient, private clientService: ClientService) { }

  getMoneyFlowByClientId(date: String){
    const partes: string[] = date.split('-');
    const anio: string = partes[0];
    const mes: string = partes[1]; 
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<MoneyFlowResponseDTO[]>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId +
          "/year/"+ anio + "/month/"+ mes);
      })
    );    
  }

  newMoneyFlow(moneyFlow: MoneyFlow, categoryId: number){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.post<MoneyFlow>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId + "/"+
          "category/"+categoryId.toString(), moneyFlow);
      })
    );
  }

  deleteMoneyFlow(id: number){
    return this.http.delete<MoneyFlow>(this.ruta_servidor+"/"+this.recurso+"/"+id.toString());
  }

  getMoneyFlowById(id: number) {
    return this.http.get<MoneyFlowResponseDTO>(this.ruta_servidor+"/"+this.recurso+"/"+id.toString());
  }

  
  editMoneyFlow(moneyFlow: MoneyFlow, id:number, categoryId: number){
    return this.http.put<MoneyFlow>(this.ruta_servidor+"/"+this.recurso+"/"+ id.toString() +
      "/category/"+categoryId.toString(),moneyFlow);
  }

  getMoneyFlowSummaryMonth(date: String) { 
    const partes: string[] = date.split('-');
    const anio: string = partes[0];
    const mes: string = partes[1]; 
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<MoneyFlowSummaryDTO>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId + "/"+
          "NetAmount/year/"+ anio+ "/month/"+ mes);
      })
    );
  }

  getMoneyFlowsTypeAndMonth(date: String, type: String) { 
    const partes: string[] = date.split('-');
    const anio: string = partes[0];
    const mes: string = partes[1]; 
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<MoneyFlowTypeDTO[]>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId + "/"+
          "type/"+ type + "/year/"+ anio+ "/month/"+ mes);
      })
    );
  }

  getMoneyFlowsTypeCategory(date: String, type: string) { 
    const partes: string[] = date.split('-');
    const anio: string = partes[0];
    const mes: string = partes[1]; 
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<MoneyFlowCategoryDTO[]>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId + "/"+
          type.toString() + "/year/"+ anio+ "/month/"+ mes);
      })
    );
  }

  getMoneyFlowsRangeMonth(year: String, mesInicio: String, mesFin: String) { 
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<MoneyFlowSummaryDTO[]>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId + 
          "/summary/year/"+ year + "/firstMonth/"+ mesInicio + "/finalMonth/" + mesFin);
      })
    );
  }

  getMoneyFlowTotalTypeAndMonth(type: string, date: String) {
    const partes: string[] = date.split('-');
    const anio: string = partes[0];
    const mes: string = partes[1]; 

    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<MoneyFlowTypeDTO>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId + 
          "/Total/type/" + type.toString() +"/year/"+ anio + "/month/"+ mes);
      })
    );
  }
}
