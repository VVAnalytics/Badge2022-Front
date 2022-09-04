import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialComponent } from './tutorial.component';

import { AlertsComponent } from './alerts/items.component';

const routes: Routes = [
  {
    path: '', component: TutorialComponent, children: [

      {
        path: '',
        redirectTo: '/bootstrap/alerts',
        pathMatch: 'full'
      },
      { path: '**', component: AlertsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorialRoutingModule { }
