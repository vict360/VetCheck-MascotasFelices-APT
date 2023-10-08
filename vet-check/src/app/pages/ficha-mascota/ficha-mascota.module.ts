import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FichaMascotaPageRoutingModule } from './ficha-mascota-routing.module';

import { FichaMascotaPage } from './ficha-mascota.page';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FichaMascotaPageRoutingModule,
    ReactiveFormsModule,
    MaskitoModule
  ],
  declarations: [FichaMascotaPage]
})
export class FichaMascotaPageModule {}
