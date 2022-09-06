import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicamentsRoutingModule } from './medicaments-routing.module';
import { MedicamentsSelectionComponent } from './medicaments-selection/medicaments-selection.component';
import { MedicamentsEditionComponent } from './medicaments-edition/medicaments-edition.component';
import { MedicamentsCreationComponent } from './medicaments-creation/medicaments-creation.component';
import { MedicamentsComponent } from './medicaments.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MedicamentsSelectionComponent,
    MedicamentsEditionComponent,
    MedicamentsCreationComponent,
    MedicamentsComponent
  ],
  imports: [
    CommonModule,
    MedicamentsRoutingModule,
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
export class MedicamentsModule { }
