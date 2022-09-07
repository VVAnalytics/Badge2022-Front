import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MedecinsComponent } from './medecins/medecins.component';
import { MedicamentsComponent } from './medicaments/medicaments.component';
import { PharmaciensComponent } from './pharmaciens/pharmaciens.component';
import { OrdonnancesComponent } from './ordonnances/ordonnances.component';
import { PiluliersComponent } from './piluliers/piluliers.component';
import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  { path: "Personnes", component: MedecinsComponent, loadChildren: () => import('./medecins/medecins.module').then(m => m.MedecinsModule) },
  { path: "personnes", component: MedecinsComponent, loadChildren: () => import('./medecins/medecins.module').then(m => m.MedecinsModule) },
  { path: "Roles", component: MedicamentsComponent, loadChildren: () => import('./medicaments/medicaments.module').then(m => m.MedicamentsModule) },
  { path: "roles", component: MedicamentsComponent, loadChildren: () => import('./medicaments/medicaments.module').then(m => m.MedicamentsModule) },
  { path: "Formations", component: OrdonnancesComponent, loadChildren: () => import('./ordonnances/ordonnances.module').then(m => m.OrdonnancesModule) },
  { path: "formations", component: OrdonnancesComponent, loadChildren: () => import('./ordonnances/ordonnances.module').then(m => m.OrdonnancesModule) },
  { path: "Cours", component: PharmaciensComponent, loadChildren: () => import('./pharmaciens/pharmaciens.module').then(m => m.PharmaciensModule) },
  { path: "cours", component: PharmaciensComponent, loadChildren: () => import('./pharmaciens/pharmaciens.module').then(m => m.PharmaciensModule) },
  { path: "Notes", component: PiluliersComponent, loadChildren: () => import('./piluliers/piluliers.module').then(m => m.PiluliersModule) },
  { path: "notes", component: PiluliersComponent, loadChildren: () => import('./piluliers/piluliers.module').then(m => m.PiluliersModule) },

  { path: 'notfound', component: NotfoundComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: "**", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
