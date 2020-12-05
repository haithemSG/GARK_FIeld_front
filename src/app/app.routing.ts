import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  { path : '', component : HomePageComponent },
  { path: 'football', loadChildren: () => import('./views/views.module').then(m => m.ViewsModule) },
  { path : '**', redirectTo : '/', pathMatch : 'full' }
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
