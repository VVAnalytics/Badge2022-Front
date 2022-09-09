import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PiluliersRoutingModule } from './piluliers-routing.module';
import { PiluliersSelectionComponent } from './piluliers-selection/piluliers-selection.component';
import { PiluliersEditionComponent } from './piluliers-edition/piluliers-edition.component';
import { PiluliersCreationComponent } from './piluliers-creation/piluliers-creation.component';
import { PiluliersComponent } from './piluliers.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    PiluliersCreationComponent,
    PiluliersEditionComponent,
    PiluliersSelectionComponent,
    PiluliersComponent
  ],
  imports: [
    CommonModule,
    PiluliersRoutingModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class PiluliersModule { }
