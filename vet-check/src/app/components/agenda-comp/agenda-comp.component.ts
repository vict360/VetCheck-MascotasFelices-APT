import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiRestService } from '../../api-rest.service';

@Component({
  selector: 'app-agenda-comp',
  templateUrl: './agenda-comp.component.html',
  styleUrls: ['./agenda-comp.component.scss'],
})
export class AgendaCompComponent  implements OnInit {

  horariosDisponibles: any | undefined;
  horarioRealDisponible: any []=[];
  horariosAgendados: any | undefined;
  horariosSolicitados: any []=[];
  constructor(
    private modalCtrl: ModalController,
    private api: ApiRestService,
  ) { }

  async ngOnInit() {
    await this.api.traerDatosApi('horario/disponible/')
    this.horariosDisponibles = await this.api.datos
    this.horariosDisponibles.forEach(async (e:any) => {
    let rut = e.rut_vet.replace('https://davydvat.pythonanywhere.com/veterinario/','');
      if(rut===localStorage.getItem('rut_vet')+'/'){
        this.horarioRealDisponible.push(e)
      }
    });

    await this.api.traerDatosApi("horario/ocupado/");

    this.horariosAgendados = await this.api.datos;
    this.horariosAgendados.forEach(async (e:any)=>{
      let rut = e.rut_vet.replace('https://davydvat.pythonanywhere.com/veterinario/','');
      if(rut===localStorage.getItem('rut_vet')+'/'){
        this.horariosSolicitados.push(e)
      }
    });
    

  }



  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
