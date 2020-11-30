import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, UserResponse } from "../../../models/user.interface";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  auth = true;
  hide = true;
  private isValidEmail = /\S+@\S+\.\S+/;

  loginForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.pattern(this.isValidEmail)]
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(4), ]
    ]
  })

  private subscription = new Subscription();
  constructor(private authSvc: AuthService, private fb: FormBuilder, private router: Router) { }


  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLogin() {

    if (this.loginForm.invalid) return;

    const formValue = this.loginForm.value;
    this.subscription.add(this.authSvc.login(formValue).subscribe((res:UserResponse) => {
      // console.log(res.auth)
      if (res.auth) {
        // this.auth = true
        this.router.navigate(['notes'])
      }
    },
    err => {
      if(err = 'pass invalid') {
        this.auth = false
        this.loginForm.get('password').reset
      }
    }))
  }


  getErrorMessage(field: string): string {
    let message;
    const fieldAux = this.loginForm.get(field)
    // console.log(this.auth)
    
    if (fieldAux.errors.required) {
      message = 'You must enter a value.'
    }
    else if (fieldAux.hasError('pattern')) {
      message = 'Email is not valid.'
    }
    else if (fieldAux.hasError('minLength')) {
      const minLength = fieldAux.errors?.minLength.requiredLength
      message = `Password must have ${minLength} characters.`
    }
      return message;
  }


  isValid(field: string): boolean {

    return (this.loginForm.get(field).touched || this.loginForm.get(field).dirty) && !this.loginForm.get(field).valid;
  }
}
