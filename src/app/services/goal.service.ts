import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoalResponseDTO } from '../models/goalResponseDTO';
import { Goal } from '../models/goal';
import { ClientService } from './client.service';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  ruta_servidor: string = "http://localhost:8080/api";
  recurso: string = "goals"

  constructor(private http:HttpClient, private clientService: ClientService) { }

  getGoalsClientId(){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.get<GoalResponseDTO[]>(this.ruta_servidor+"/"+this.recurso+"/client/" + clientId);
      })
    );
  }

  deleteGoal(id: number){
    return this.http.delete<Goal>(this.ruta_servidor+"/"+this.recurso+"/"+id.toString());
  }

  getGoalById(id: number) {
    return this.http.get<Goal>(this.ruta_servidor+"/"+this.recurso+"/"+id.toString());
  }

  newGoal(goal: Goal){
    return this.clientService.getClientIdByUserId().pipe(
      switchMap((clientId: number) => {
        return this.http.post<Goal>(this.ruta_servidor+"/"+this.recurso+"/client/" + clientId, goal);
      })
    );  
  }

  editGoal(goal: Goal, id:number){
    return this.http.put<Goal>(this.ruta_servidor+"/"+this.recurso+"/"+ id.toString(),goal);
  }
}
