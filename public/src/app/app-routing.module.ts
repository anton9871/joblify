import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRegistrationComponent } from './login-registration/login-registration.component';
import { JobSearchComponent } from './job-search/job-search.component';

import { FavoritesComponent } from './favorites/favorites.component';
import { StatusBoardComponent } from './status-board/status-board.component';
import { CompareComponent } from './compare/compare.component';
import { MetricsComponent } from './metrics/metrics.component';

const routes: Routes = [
  {path:'login', component: LoginRegistrationComponent},
  {path:'jobSearch', component: JobSearchComponent},
  {path:'favorites', component: FavoritesComponent},
  {path:'statusBoard', component: StatusBoardComponent},
  {path:'compare/:id1/:id2', component: CompareComponent},
  {path:'metrics', component: MetricsComponent},
  {path:'', redirectTo: 'login', pathMatch: 'full'},
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
