import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdonnancesCreationComponent } from './ordonnances-creation/ordonnances-creation.component';
import { OrdonnancesEditionComponent } from './ordonnances-edition/ordonnances-edition.component';
import { OrdonnancesSelectionComponent } from './ordonnances-selection/ordonnances-selection.component';

const routes: Routes = [
  { path: "creation", component: OrdonnancesCreationComponent },
  { path: "edition/:id", component: OrdonnancesEditionComponent },
  { path: "**", component: OrdonnancesSelectionComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdonnancesRoutingModule { }
