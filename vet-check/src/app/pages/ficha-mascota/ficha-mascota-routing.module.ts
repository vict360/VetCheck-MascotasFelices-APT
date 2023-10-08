import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FichaMascotaPage } from './ficha-mascota.page';

const routes: Routes = [
  {
    path: '',
    component: FichaMascotaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FichaMascotaPageRoutingModule {}
