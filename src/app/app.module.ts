import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NoteComponent } from './pages/note/note.component';

// import { NgxMasonryModule } from 'ngx-masonry';
import {MaterialModule} from './material.module'
import { Masonry, MasonryModule} from '@thisissoon/angular-masonry';
import { HeaderComponent } from './pages/header/header.component';
import { SidebarModule } from './pages/sidebar/sidebar.module';
import { HttpClientModule } from '@angular/common/http';

const masonryProviders = [
  { provide: Masonry, useFactory: () => window['Masonry'] },
];
@NgModule({
  declarations: [
    AppComponent,
    // NoteComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MasonryModule.forRoot(masonryProviders),
    MaterialModule,
    SidebarModule,
    HttpClientModule,
    // NgxMasonryModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
}) 
export class AppModule { }
