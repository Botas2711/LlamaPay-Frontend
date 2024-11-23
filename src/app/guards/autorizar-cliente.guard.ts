import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { UserService } from "../services/user.service";

@Injectable({
  providedIn:'root'
})
export class AutorizarClienteGuard {
  constructor (private userService: UserService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
   MaybeAsync<GuardResult>
  // boolean | UrlTree | RedirectCommand | Observable<boolean | UrlTree | RedirectCommand> | 
  // Promise<boolean | UrlTree | RedirectCommand>
  {
    let permisos = this.userService.getAuthoritiesActual();
    if (permisos) {
      if (permisos.indexOf("CLIENTE")>=0) {
        return true;
      }
    }
    return false;
  }
}