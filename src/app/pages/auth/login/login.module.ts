import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { MaterialModule } from "../../../material.module";
import { ReactiveFormsModule } from '@angular/forms';
import { FlipModule } from 'ngx-flip';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FlipModule
  ]
})
export class LoginModule { }
