import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../pages/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {
  constructor(private autSvc: AuthService){

  }
  canActivate(): Observable<boolean>  {
    return this.autSvc.isLogged.pipe(
      take(1),
      map((isLogged: boolean) => !isLogged) //Si no está logueado, no vamos a permitir que acceda a esa ruta
    );
    
  }
  
}
