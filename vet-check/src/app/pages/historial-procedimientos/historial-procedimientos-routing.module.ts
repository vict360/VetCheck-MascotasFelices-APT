import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialProcedimientosPage } from './historial-procedimientos.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialProcedimientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialProcedimientosPageRoutingModule {}
