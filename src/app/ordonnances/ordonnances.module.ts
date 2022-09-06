import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdonnancesRoutingModule } from './ordonnances-routing.module';
import { OrdonnancesSelectionComponent } from './ordonnances-selection/ordonnances-selection.component';
import { OrdonnancesEditionComponent } from './ordonnances-edition/ordonnances-edition.component';
import { OrdonnancesCreationComponent } from './ordonnances-creation/ordonnances-creation.component';
import { OrdonnancesComponent } from './ordonnances.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OrdonnancesCreationComponent,
    OrdonnancesEditionComponent,
    OrdonnancesSelectionComponent,
    OrdonnancesComponent
  ],
  imports: [
    CommonModule,
    OrdonnancesRoutingModule,
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
export class OrdonnancesModule { }
