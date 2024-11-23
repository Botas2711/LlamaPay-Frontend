import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reminder } from '../models/reminder';
import { ClientService } from './client.service';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  ruta_servidor: string = "http://localhost:8080/api";
  recurso: string = "reminders"

  constructor(private http:HttpClient, private clientService: ClientService) { }

  getRemindersClientId(){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<Reminder[]>(this.ruta_servidor+"/"+this.recurso+"/client/"+clientId);
      })
    ); 
  }

  deleteReminder(id: number){
    return this.http.delete<Reminder>(this.ruta_servidor+"/"+this.recurso+"/"+id.toString());
  }

  getReminderById(id: number) {
    return this.http.get<Reminder>(this.ruta_servidor+"/"+this.recurso+"/"+id.toString());
  }

  newReminder(reminder: Reminder){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.post<Reminder>(this.ruta_servidor+"/"+this.recurso+"/client/"+ clientId, reminder);
      })
    ); 

  }

  editReminder(reminder: Reminder, id:number){
    return this.http.put<Reminder>(this.ruta_servidor+"/"+this.recurso+"/"+ id.toString(),reminder);
  }
}
