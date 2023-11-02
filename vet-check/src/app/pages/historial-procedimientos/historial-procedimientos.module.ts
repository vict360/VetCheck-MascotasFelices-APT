import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialProcedimientosPageRoutingModule } from './historial-procedimientos-routing.module';

import { HistorialProcedimientosPage } from './historial-procedimientos.page';
import { ModificarHistorialComponent } from './components/modificar-historial/modificar-historial.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialProcedimientosPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [HistorialProcedimientosPage, ModificarHistorialComponent]
})
export class HistorialProcedimientosPageModule {}
