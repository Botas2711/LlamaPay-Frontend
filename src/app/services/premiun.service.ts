import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Premiun } from '../models/premiun';

@Injectable({
  providedIn: 'root'
})
export class PremiunService {
  ruta_servidor: string = "http://localhost:8080/api";
  recurso:string = "premiuns";

  constructor(private http:HttpClient) { }

  getPremiun(){
    return this.http.get<Premiun>(this.ruta_servidor+"/"+this.recurso);
  }
}
