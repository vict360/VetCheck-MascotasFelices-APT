import { Component, OnInit } from '@angular/core';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { ApiRestService } from '../../api-rest.service';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buscar-cliente-comp',
  templateUrl: './buscar-cliente-comp.component.html',
  styleUrls: ['./buscar-cliente-comp.component.scss'],
})
export class BuscarClienteCompComponent  implements OnInit {

  cliente: any | undefined;

  formRut : FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiRestService,
    private nav: NavController,
    private fb: FormBuilder
  ) { 

    this.formRut = this.fb.group({
      'rut_busqueda': ['', [Validators.required]]
    })

  }

  ngOnInit() {
  }

  readonly rutMask: MaskitoOptions = {
    mask: [
      ...Array(8).fill(/\d/),
      '-',
      ...Array(1).fill(/[0-9Kk]/)
    ],
  };

  
  readonly maskRut: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async buscarCliente(rut: IonInput){
    let rutCliente: any = rut.value?.toString().toUpperCase()
    let a = await this.api.datosAPI("cliente/"+ rutCliente)
    this.cliente = await this.api.datos
  }

  abrirFicha(id: IonInput){
    this.nav.navigateForward(`/ficha-mascota/${id}`)
    this.cancel()
  }

}
