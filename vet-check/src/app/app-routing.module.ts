import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from './logged.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [LoggedGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'ficha-mascota/:id',
    loadChildren: () => import('./pages/ficha-mascota/ficha-mascota.module').then( m => m.FichaMascotaPageModule),
    canActivate: [LoggedGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [LoggedGuard]
  },
  {
    path: 'historial/:id',
    loadChildren: () => import('./pages/historial-procedimientos/historial-procedimientos.module').then( m => m.HistorialProcedimientosPageModule),
    canActivate: [LoggedGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
