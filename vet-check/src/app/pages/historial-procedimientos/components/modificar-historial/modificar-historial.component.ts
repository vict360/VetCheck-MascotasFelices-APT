import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonInput, IonSelect, ModalController, NavController, NavParams, ViewWillEnter } from '@ionic/angular';
import * as moment from 'moment';
import { ApiRestService } from 'src/app/api-rest.service';

@Component({
  selector: 'app-modificar-historial',
  templateUrl: './modificar-historial.component.html',
  styleUrls: ['./modificar-historial.component.scss'],
})
export class ModificarHistorialComponent  implements OnInit {

  data:any;
  fichas: any;
  prod:any
  historial: any;
  procedimientos: any []=[]
  procedimientosSeleccionados: any[]=[]
  id: any
  isModificar = false;
  historialAbierto: any;
  procedimientoAbierto: any;
  procedimientoSelecAbierto: any []=[]
  fechaAtencion : any;
  formModHist: FormGroup;
  isProxAten = false;

  constructor(
    private api: ApiRestService,
    private fb: FormBuilder,
    private navParams : NavParams,
    private modalCtrl: ModalController,
  ) { 
    
    this.id = this.navParams.get('id')
    
    this.formModHist = this.fb.group({
      peso: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      procedimiento: ['', [Validators.required]]
    })

  }

  async ngOnInit() {

    this.historial = await this.api.traerDatosApi("historial/"+this.id)

    let pros:any = await this.api.traerDatosApi("procedimiento/")

    pros.forEach(async (e:any)=>{
      if(e?.estado_proc==='Activo'){
        this.procedimientos.push(e)
      }
    }) 
    
    this.historial.procedimiento.forEach(async (e:any)=>{
      this.procedimientoSelecAbierto.push(e)
    })
    
    this.formModHist.get('procedimiento')?.setValue(this.procedimientoSelecAbierto)
    this.formModHist.get('peso')?.setValue(this.historial.peso_masc)
    this.formModHist.get('descripcion')?.setValue(this.historial.descripcion_hist)

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
  }

  enviarDatos(proSeleccionado: IonSelect, peso: IonInput, descricion: IonInput ){
  
    let id = this.historial?.id_hist
    let proxAtencion
    let proce
    
    
    if(!proSeleccionado.value){
      proce = this.procedimientoSelecAbierto;
    }else{
      proce = proSeleccionado.value
    }

    if(!this.isProxAten){
      if(!this.historialAbierto?.proxima_aten){
        proxAtencion = null;
      }else{
        proxAtencion = this.historialAbierto?.proxima_aten
      }
    }else{
      proxAtencion = this.fechaAtencion;
    }

    let data = {
      "procedimiento": proce, 
      "proxima_aten": proxAtencion,
      "descripcion_hist": descricion.value,
      "peso_masc": peso.value,
    }      
  
    this.api.cambiarDatos(id, 'historial/', data, 2)

    this.cancel();

  }


}
