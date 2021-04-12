import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SignUpResponse, User, UserResponse } from "../../../models/user.interface";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  errorMessage = ''
  response = true //variable para determinar si está disponible el server, true= disponible 
  private isValidEmail = /\S+@\S+\.\S+/;
  flip = false

  loginForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.pattern(this.isValidEmail)]
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(4),]
    ]
  })

  registerForm = this.fb2.group({
    name: [
      '',
      [Validators.required]
    ],
    email: [
      '',
      [Validators.required, Validators.pattern(this.isValidEmail)]
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(4),]
    ]
  })

  private subscription = new Subscription();
  constructor(
    private authSvc: AuthService, 
    private fb: FormBuilder, 
    private fb2: FormBuilder, 
    private router: Router,
    private toastr: ToastrService
    ) { }


  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  rotate() {
    this.flip = !this.flip;
  }

  capitalizeName (myString): string {
    return myString.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  }

  onLogin() {

    if (this.loginForm.invalid) return;

    const formValue = this.loginForm.value;
    this.subscription.add(this.authSvc.login(formValue).subscribe((res: UserResponse) => {
      // console.log(res.auth)
      if (res.auth) {
        this.router.navigate(['notes'])
        this.toastr.success(`Welcome again ${this.capitalizeName(res.name)}`,'Login success')
      }
    },
      err => {
        console.log('Error message interface', err)
        this.errorMessage = err.message
        console.log('Error message ok', err.message)
        if (err.status == 401) {
          this.loginForm.get('password').setErrors({ incorrectPassword: true })
        } else if (err.status == 404) {
          this.loginForm.get('email').setErrors({ incorrectEmail: true })
        }
        else {
          this.response = false
          console.log('Si esntra')
        }
      }))
  }

  onRegister() {

    if (this.registerForm.invalid) return;

    const formValue = this.registerForm.value;
    this.subscription.add(this.authSvc.register(formValue).subscribe((res: SignUpResponse) => {
      // console.log(res, 'onRegister')
      this.toastr.success("Redirecting to login, put your credentials", res.message);
      setTimeout(() => {
        this.rotate()
      }, 1300);
    },
      err => {
        // console.log('Error message interface', err)
        this.errorMessage = err.message
        if (err.status == 450) {
          this.registerForm.get('email').setErrors({ emailExists: true })
        }
        else {
          console.log('Error message ok', err.message)
          this.response = false
        }
      }))
  }


  getErrorMessage(field: string, register?: boolean): string {
    let message;
    const fieldAux = !register ? this.loginForm.get(field) : this.registerForm.get(field)
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
    } else if (fieldAux.hasError('incorrectPassword')) {
      message = this.errorMessage
    } else if (fieldAux.hasError('incorrectEmail')) {
      message = this.errorMessage
    } else if (fieldAux.hasError('emailExists')) {
      message = this.errorMessage
    }
    return message;
  }


  isValid(field: string, register?: boolean): boolean {

    return !register ?
      (this.loginForm.get(field).touched || this.loginForm.get(field).dirty) && !this.loginForm.get(field).valid
      :
      (this.registerForm.get(field).touched || this.registerForm.get(field).dirty) && !this.registerForm.get(field).valid;
  }
}
