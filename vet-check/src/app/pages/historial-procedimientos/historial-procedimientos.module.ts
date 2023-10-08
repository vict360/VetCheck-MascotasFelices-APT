import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialProcedimientosPageRoutingModule } from './historial-procedimientos-routing.module';

import { HistorialProcedimientosPage } from './historial-procedimientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialProcedimientosPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [HistorialProcedimientosPage]
})
export class HistorialProcedimientosPageModule {}
