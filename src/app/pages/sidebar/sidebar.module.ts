import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';

import { MaterialModule } from "../../material.module";
import { UtilsService } from 'src/app/services/utils.service';

@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [SidebarComponent],
  providers: [UtilsService]
})
export class SidebarModule { }
