import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// Se importa HttpClientModule y se agrega en los imports de NgModule
import { HttpClientModule } from '@angular/common/http';
import { MaskitoModule } from '@maskito/angular';
//Componentes
import { CrearFichaCompComponent } from './components/crear-ficha-comp/crear-ficha-comp.component';
import { AgregarClienteCompComponent } from './components/agregar-cliente-comp/agregar-cliente-comp.component';
import { AgregarHistorialCompComponent } from './components/agregar-historial-comp/agregar-historial-comp.component';

import { BuscarClienteCompComponent } from './components/buscar-cliente-comp/buscar-cliente-comp.component';
import { AgendaCompComponent } from './components/agenda-comp/agenda-comp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AyudaContraComponent } from './components/ayuda-contra/ayuda-contra.component';


@NgModule({
  declarations: [AppComponent, CrearFichaCompComponent, AgregarClienteCompComponent, AgregarHistorialCompComponent, BuscarClienteCompComponent, AgendaCompComponent, AyudaContraComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, MaskitoModule, ReactiveFormsModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
