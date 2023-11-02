import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonInput, IonSelect, ModalController, NavController, ViewWillEnter } from '@ionic/angular';
import { ApiRestService } from 'src/app/api-rest.service';
import * as moment from 'moment';
import { ModificarHistorialComponent } from './components/modificar-historial/modificar-historial.component';

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
  arg: any

  constructor(
    private api: ApiRestService,
    private actRoute: ActivatedRoute,
    private nav: NavController,
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) { 
    this.arg = this.actRoute.snapshot.paramMap.get('id')?.toString();
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

  async modificar(id: any) {
    const modal = await this.modalCtrl.create({
      component: ModificarHistorialComponent,
      componentProps: {id}
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if(role){
      this.procedimientos = []
      this.historial_real = []
      this.ngOnInit()
    }
  }

}
