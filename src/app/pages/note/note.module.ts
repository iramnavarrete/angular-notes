import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteRoutingModule } from './note-routing.module';
import { NoteComponent } from './note.component';
import { MaterialModule } from "../../material.module";
import { CreateNoteComponent } from './create-note/create-note.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [NoteComponent, CreateNoteComponent],
  imports: [
    CommonModule,
    NoteRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
})
export class NoteModule { }
