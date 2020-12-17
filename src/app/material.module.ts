import { NgModule } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';

const myModules = [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
]
@NgModule({
    imports: [...myModules],
    exports: [...myModules]
})

export class MaterialModule {

}