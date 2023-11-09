import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, IonSelect, ModalController, NavParams } from '@ionic/angular';
import { ApiRestService } from 'src/app/api-rest.service';
import * as moment from 'moment';

@Component({
  selector: 'app-agregar-historial-comp',
  templateUrl: './agregar-historial-comp.component.html',
  styleUrls: ['./agregar-historial-comp.component.scss'],
})
export class AgregarHistorialCompComponent  implements OnInit {

  procedimientos: any | undefined;
  formHist : FormGroup;
  fechaAtencion: any;
  isProxAten: any;
  fechaActual: any
  idMascota: any;
  mascota: any
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private api: ApiRestService,
    private navParams: NavParams
  ) { 

    this.idMascota = this.navParams.get('data');

    this.formHist = this.fb.group({
      procedimiento: ['' ,[Validators.required]],
      peso_hist: ['', [Validators.required]],
      descripcion_hist: ['', [Validators.required, Validators.minLength(5)]],
    })

  }

  async ngOnInit() {
    let fecha = new Date().toISOString(); // Se obtiene la fecha actual
    this.fechaActual= moment(fecha).format('YYYY-MM-DD') 
    await this.api.llamadaApi("https://davydvat.pythonanywhere.com/procedimiento/")
    this.procedimientos = await this.api.datos;
    this.mascota = await this.api.llamadaApi(this.idMascota);
    console.log(this.mascota);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async fecha(event:any){
    let fecha_moment = await moment(event.detail.value); // fecha_nacimiento = "2023-07-10T22:04:00"
    this.fechaAtencion = fecha_moment.format('YYYY-MM-DD')       
  }

  cambiarCheckbox(event:any){
    this.isProxAten = event.detail.checked;
    this.fechaAtencion = this.fechaActual;
  }

  async enviarDatos(proSelec: IonSelect, peso: IonInput, descripcion: IonInput){
    
    let fechaProxAten

    if(!this.isProxAten){
      fechaProxAten = null;
    }else{
      fechaProxAten = this.fechaAtencion;
    }

    let data = {
      "peso_masc": peso.value,
      "fecha_hist": this.fechaActual,
      "descripcion_hist": descripcion.value,
      "proxima_aten": fechaProxAten,
      "id_masc": this.idMascota,
      "rut_vet": "https://davydvat.pythonanywhere.com/veterinario/"+localStorage.getItem("rut_vet")+"/",
      "procedimiento": proSelec.value
    }
    this.api.subirDatos('historial/', data, 2);
    this.modalCtrl.dismiss('created', 'cancel')
  }

}
