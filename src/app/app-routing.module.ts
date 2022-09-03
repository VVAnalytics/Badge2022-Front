import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './modules/general/home/home.component';
import { NotFoundComponent } from './modules/general/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent, },
  {
    path: 'crud',
    loadChildren: () => import('./modules/application/example-crud/tutorial.module')
      .then(mod => mod.TutorialModule)
  },
  {
    path: 'boxoffice',
    loadChildren: () => import('./modules/application/boxoffice/boxoffice.module')
      .then(mod => mod.BoxofficeModule)
  },
  {
    path: 'boxoffice/:id',
    loadChildren: () => import('./modules/application/boxoffice-form/boxoffice-form.module')
      .then(mod => mod.BoxofficeFormModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./modules/application/example-modal/tutorial.module')
      .then(mod => mod.TutorialModule)
  },
  {
    path: 'formations',
    loadChildren: () => import('./modules/application/formations/formations.module')
      .then(mod => mod.FormationsModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./modules/application/resultats/items.module')
      .then(mod => mod.ItemsModule)
  },
  {
    path: 'forms',
    loadChildren: () => import('./modules/application/example-forms/tutorial.module')
      .then(mod => mod.TutorialModule)
  },
  {
    path: 'components',
    loadChildren: () => import('./modules/application/example-components/tutorial.module')
      .then(mod => mod.TutorialModule)
  },
  {
    path: 'bootstrap',
    loadChildren: () => import('./modules/application/example-bootstrap/tutorial.module')
      .then(mod => mod.TutorialModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./modules/general/signup/signup.module')
      .then(mod => mod.SignupModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/general/login/login.module')
      .then(mod => mod.LoginModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./modules/general/contact/contact.module')
      .then(mod => mod.ContactModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./modules/general/about/about.module')
      .then(mod => mod.AboutModule)
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  /*  imports: [RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled'
    })],*/
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }