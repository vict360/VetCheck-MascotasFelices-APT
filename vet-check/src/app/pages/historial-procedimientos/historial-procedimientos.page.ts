import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonInput, IonSelect, ModalController, NavController } from '@ionic/angular';
import { ApiRestService } from 'src/app/api-rest.service';
import * as moment from 'moment';

@Component({
  selector: 'app-historial-procedimientos',
  templateUrl: './historial-procedimientos.page.html',
  styleUrls: ['./historial-procedimientos.page.scss'],
})
export class HistorialProcedimientosPage implements OnInit {

  data:any;
  fichas: any;
  prod:any
  historial_real: any[]=[];
  procedimientos: any []=[]
  procedimientosSeleccionados: any[]=[]
  arg: any
  isModificar = false;
  historialAbierto: any;
  procedimientoAbierto: any;
  procedimientoSelecAbierto: any []=[]
  fechaAtencion : any;
  formModHist: FormGroup;
  isProxAten = false;

  constructor(
    private api: ApiRestService,
    private actRoute: ActivatedRoute,
    private nav: NavController,
    private fb: FormBuilder
  ) { 
    
    this.arg = this.actRoute.snapshot.paramMap.get('id')?.toString();
    
    this.formModHist = this.fb.group({
      peso: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      procedimiento: ['', [Validators.required]]
    })

  }

  async ngOnInit() {

    let pros:any = await this.api.traerDatosApi("procedimiento/")

    pros.forEach(async (e:any)=>{
      if(e?.estado_proc==='Activo'){
        this.procedimientos.push(e)
      }
    })



    let rut = "https://davydvat.pythonanywhere.com/veterinario/"+localStorage.getItem("rut_vet")+"/"
    await this.api.llamadaApi("https://davydvat.pythonanywhere.com/historial/");
    
    this.fichas = await this.api.datos;
    this.fichas.forEach(async (e:any)=> {
      if(e.rut_vet === rut){
        let id = e.id_masc.replace('https://davydvat.pythonanywhere.com/mascota/','')
        if(id===this.arg+'/'){          
          this.historial_real.push(e)
        }
      }
    })
    

  }


  volver(){
    this.nav.navigateForward(`ficha-mascota/${this.arg}`)
  }

  async fecha(event:any){
    let fecha_moment = await moment(event.detail.value); // fecha_nacimiento = "2023-07-10T22:04:00"
    this.fechaAtencion = fecha_moment.format('YYYY-MM-DD')    
  }

  cambiarCheckbox(event:any){
    this.isProxAten = event.detail.checked;
  }

  async abrirModificar(id:any, is: boolean) {
    this.isModificar = is;
    // Itera sobre los elementos en historial_real
    this.historial_real.forEach((element: any) => {
      // Verifica si el valor de id_hist es igual a 2
      if (element.id_hist === id) {
        this.historialAbierto = element
      }
    });

    this.historialAbierto?.procedimiento.forEach((e:any)=>{
      this.procedimientoSelecAbierto.push(e)
    })


    this.formModHist.get('procedimiento')?.setValue(this.procedimientoSelecAbierto)
    this.formModHist.get('peso')?.setValue(this.historialAbierto.peso_masc)
    this.formModHist.get('descripcion')?.setValue(this.historialAbierto.descripcion_hist)


    if(!is){
      this.isProxAten = false;
      this.formModHist.get('procedimientos')?.reset();
    }
    

  }

  enviarDatos(proSeleccionado: IonSelect, peso: IonInput, descricion: IonInput ){
  
    let id = this.historialAbierto?.id_hist
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
    this.isModificar = false;
  
  }

}
