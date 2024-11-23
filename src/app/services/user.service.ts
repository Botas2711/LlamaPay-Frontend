import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { tap } from 'rxjs';
import { Token } from '../models/token';
import { ClientService } from './client.service';
import { UserClientDTO } from '../models/userClientDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  ruta_servidor: string = "http://localhost:8080/api";
  recurso:string = "users";

  constructor(private http:HttpClient, private clientService: ClientService) { }

  getUser(id: number){
    return this.http.get<User>(this.ruta_servidor+"/"+this.recurso+"/"+id.toString());
  }

  newUser(userClient: UserClientDTO){
    return this.http.post<User>(this.ruta_servidor+"/"+this.recurso +"/userClientRegister",userClient);
  }

  deleteUser(){
    return this.http.put<User>(this.ruta_servidor+"/"+this.recurso +"/delete/" + (localStorage.getItem("user_id")), null);
  }

  login(user: User){
    this.logout();
    return this.http.post<Token>(this.ruta_servidor+"/"+this.recurso +"/login",user).pipe(
      tap((resultado: Token) =>{
        localStorage.setItem("jwtToken", resultado.jwtToken);
        localStorage.setItem("user_id", resultado.user_id.toString());
        localStorage.setItem("authorities", resultado.authorities);
      })
    );
  }

  logout(){
    localStorage.clear();
  }

  hayUsuarioLogueado(){
    if(this.getUserIdActual() == null || this.getUserIdActual() == ""){
      return false;
    }
    return true;
  }

  getTokenActual(){
    return localStorage.getItem("jwtToken");
  }

  getUserIdActual(){
    return localStorage.getItem("user_id");
  }

  getAuthoritiesActual(){
    return localStorage.getItem("authorities");
  }
}
