import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmaciensRoutingModule } from './pharmaciens-routing.module';
import { PharmaciensSelectionComponent } from './pharmaciens-selection/pharmaciens-selection.component';
import { PharmaciensEditionComponent } from './pharmaciens-edition/pharmaciens-edition.component';
import { PharmaciensCreationComponent } from './pharmaciens-creation/pharmaciens-creation.component';
import { PharmaciensComponent } from './pharmaciens.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PharmaciensCreationComponent,
    PharmaciensEditionComponent,
    PharmaciensSelectionComponent,
    PharmaciensComponent
  ],
  imports: [
    CommonModule,
    PharmaciensRoutingModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ReactiveFormsModule
  ],
  exports: [
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ReactiveFormsModule
  ]
})
export class PharmaciensModule { }
