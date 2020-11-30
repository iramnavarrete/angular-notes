import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User, UserResponse } from 'src/app/models/user.interface';

import { environment } from "../../../environments/environment";
import { catchError, map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http:HttpClient, private router:Router) { 
    this.checkToken();
  }

  get isLogged(): Observable<boolean>{
    return this.loggedIn.asObservable();
  }
  login(authData: User): Observable<UserResponse | void>{
    return this.http.post<UserResponse>(environment.API_URL+'/users/login', authData)
    .pipe(
      map((res:UserResponse) =>{
        // console.log('Res->', res);
        this.saveToken(res.token);
        this.loggedIn.next(true);
        console.log('respuesta',res)
        return res;
      }),
      catchError((err) => this.handleError(err))
    )

  }
  logout(){
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['login']);
  }
  private checkToken(){
    const userToken = localStorage.getItem('token');
    const isExpired = helper.isTokenExpired(userToken);
    console.log('isExpired->', isExpired);
    
    isExpired ? this.logout() : this.loggedIn.next(true);
    
    //set userLogged = isExpired
  }
  private saveToken(token: string){
    localStorage.setItem('token', token);
  }
  private handleError(err): Observable<never>{
    
    let errorMessage = 'An error ocurred retrienving data';
    if(err){
      
      if (err.status == 401){
        errorMessage = "pass invalid"
      }
      else{
        errorMessage = 'Error code '+ err.message;
      }
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);

  }
}
