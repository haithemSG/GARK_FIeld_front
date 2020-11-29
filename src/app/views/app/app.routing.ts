import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { PharesComponent } from './phares/phares.component';
import { BoutiqueComponent } from './boutique/boutique.component';
import { ShowTerrainComponent } from './boutique/show-terrain/show-terrain.component';
import { CompteComponent } from './compte/compte.component';
// import { AjoutCategorie } from './ajout-categorie/ajout-categorie';
// import { AuthGuard } from 'src/app/shared/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    //canActivate : [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboards' },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
      },
      {
        path: 'applications',
        loadChildren: () =>
          import('./applications/applications.module').then(
            (m) => m.ApplicationsModule
          ),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'ui',
        loadChildren: () => import('./ui/ui.module').then((m) => m.UiModule),
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('./menu/menu.module').then((m) => m.MenuModule),
      },
      { path: 'blank-page', component: BlankPageComponent },
      { path: 'mes-terrains', component: PharesComponent },
      { path: 'terrains', component: BoutiqueComponent },
      { path: 'compte', component: CompteComponent },
      { path: 'terrains/view/:id', component: ShowTerrainComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
