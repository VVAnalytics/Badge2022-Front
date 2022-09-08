import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PiluliersSelectionComponent } from './piluliers-selection/piluliers-selection.component';
import { PiluliersEditionComponent } from './piluliers-edition/piluliers-edition.component';
import { PiluliersCreationComponent } from './piluliers-creation/piluliers-creation.component';

const routes: Routes = [
  { path: "creation", component: PiluliersCreationComponent },
  { path: "edition/:id", component: PiluliersEditionComponent },
  { path: "**", component: PiluliersSelectionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PiluliersRoutingModule { }
