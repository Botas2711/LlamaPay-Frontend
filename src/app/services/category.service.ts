import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  ruta_servidor: string = "http://localhost:8080/api";
  recurso: string = "categories"

  constructor(private http:HttpClient) { }

  getCategories(type: string){
    return this.http.get<Category[]>(this.ruta_servidor+"/"+this.recurso+"/type/"+type);
  }
}
