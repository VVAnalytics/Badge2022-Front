import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PharmaciensSelectionComponent } from './pharmaciens-selection/pharmaciens-selection.component';
import { PharmaciensEditionComponent } from './pharmaciens-edition/pharmaciens-edition.component';
import { PharmaciensCreationComponent } from './pharmaciens-creation/pharmaciens-creation.component';

const routes: Routes = [
  { path: "creation", component: PharmaciensCreationComponent },
  { path: "edition/:id", component: PharmaciensEditionComponent },
  { path: "**", component: PharmaciensSelectionComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class PharmaciensRoutingModule { }
