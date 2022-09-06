import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicamentsCreationComponent } from './medicaments-creation/medicaments-creation.component';
import { MedicamentsEditionComponent } from './medicaments-edition/medicaments-edition.component';
import { MedicamentsSelectionComponent } from './medicaments-selection/medicaments-selection.component';

const routes: Routes = [
  { path: "creation", component: MedicamentsCreationComponent },
  { path: "edition/:id", component: MedicamentsEditionComponent },
  { path: "**", component: MedicamentsSelectionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicamentsRoutingModule { }
