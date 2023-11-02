import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ApiRestService } from '../../api-rest.service';
// Componentes
import { CrearFichaCompComponent } from './components/crear-ficha-comp/crear-ficha-comp.component';
import { AgregarClienteCompComponent } from './components/agregar-cliente-comp/agregar-cliente-comp.component';
import { BuscarClienteCompComponent } from './components/buscar-cliente-comp/buscar-cliente-comp.component';
import { AgendaCompComponent } from './components/agenda-comp/agenda-comp.component';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  resultadoEscaneado : any;
  visibilidad = '';
  enEscaneo= 'hidden';
  resultado:any | undefined;
  ultimaMascota: any | undefined;
  vet:any | undefined;
  isEscaneado: any
  constructor(

    private modalCtrl: ModalController,
    private nav: NavController,
    private api: ApiRestService,
    private alertController :  AlertController,

  ) {}

  async ngOnInit(){
    let rut = localStorage.getItem('rut_vet')
    if(!rut){
      this.cerrarSesion();
    }
    this.vet = await this.api.traerDatosApi('veterinario/'+rut)
    if(this.vet?.estado_vet==='Inactivo'){
      this.cerrarSesion();
    }    

  }

  async PermisoDeUsuario() {
    // verifica si el usuario ya ha concedido el permiso
    const estado = await BarcodeScanner.checkPermission({ force: false });
  
    if (estado.granted) {
      // el usuario ha concedido el permiso
      return true;
    }
  
    if (estado.denied) {
      // el usuario ha denegado el permiso
      return false;
    }
  
    if (estado.asked) {
      // el sistema solicitó al usuario el permiso durante esta llamada
      // solo es posible cuando se establece 'force' en true
    }
  
  
    if (estado.restricted || estado.unknown) {
      // solo para iOS
      // probablemente significa que el permiso ha sido denegado
      return false;
    }
  
    // el usuario no ha denegado el permiso
    // pero el usuario tampoco ha concedido el permiso aún
    // así que solicitamos el permiso
    const estadoSolicitud = await BarcodeScanner.checkPermission({ force: true });
  
    if (estadoSolicitud.asked) {
      // el sistema solicitó al usuario el permiso durante esta llamada
      // solo es posible cuando se establece 'force' en true
    }
  
    if (estadoSolicitud.granted) {
      // el usuario concedió el permiso ahora
      return true;
    }
  
    // el usuario no concedió el permiso, por lo que debe haber rechazado la solicitud
    return false;
  };

  async iniciarEscaneo(){
    let estadoCamara = await this.PermisoDeUsuario()
    console.log("ESTADO");
    console.log(estadoCamara);

    if(!estadoCamara){
      BarcodeScanner.stopScan();
      this.pararEscaner();
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Concede acceso a la cámara',
        message: 'Por favor, da acceso a los permisos de la cámara para escanear un código QR',
        buttons: [
          {
            text: 'Ok',
            role: 'confirm',
            handler: ()=>{
              console.log("Confirm presionado");
              BarcodeScanner.openAppSettings()
            }
          },{
            text: 'Cancelar',
            role: 'cancel'
          }]
        });
      await alert.present();
    } else{
      document.querySelector('body')?.classList.add('scanner-active');
    this.enEscaneo = ''
    this.visibilidad = 'hidden';
    BarcodeScanner.hideBackground();
    let resultado = await BarcodeScanner.startScan();
    if(resultado?.hasContent){
      this.pararEscaner()
      BarcodeScanner.startScan()
      let a = parseInt(resultado.content)
      if(typeof a == 'number'){
        if(Number.isNaN(a)){
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Código QR inválido',
            message: 'Por favor, escanea un código QR válido',
            buttons: [
              {
                text: 'OK',
                role: 'cancel'
              }
            ]
          });
          await alert.present();
          BarcodeScanner.stopScan()
          this.pararEscaner()
        }else{
          this.api.traerDatosAPI2('mascota/'+a+'/').subscribe(
            async (response: any) =>{
            this.ultimaMascota = response
            console.log(this.ultimaMascota);
            
            this.pararEscaner()
            BarcodeScanner.stopScan()
            this.nav.navigateForward(`/ficha-mascota/${a}`)  
          }, async error =>{
            if(error.status==404){
              BarcodeScanner.stopScan()
              this.pararEscaner()
              const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'No se ha encontrado',
                message: 'Por favor, escanea un código QR válido',
                buttons: [
                  {
                    text: 'OK',
                    role: 'cancel'
                  }
                ]
              });
              await alert.present();
            }else{
              const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'Código QR inválido',
                message: 'Por favor, escanea un código QR válido',
                buttons: [
                  {
                    text: 'OK',
                    role: 'cancel'
                  }
                ]
              });
              await alert.present();
            }
          } )
        }
      }
    }
    }
    
    
  }

  mostrarUltimaMascota(){
    this.nav.navigateForward(`/ficha-mascota/${this.ultimaMascota?.id_masc}`)  
  }

  async pararEscaner(){
    this.enEscaneo = 'hidden';
    this.visibilidad = '';
    BarcodeScanner.showBackground();
    document.querySelector('body')?.classList.remove('scanner-active');
  }

  async addMascota() {
    const modal = await this.modalCtrl.create({
      component: CrearFichaCompComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  async addCliente() {
    const modal = await this.modalCtrl.create({
      component: AgregarClienteCompComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  async buscarCliente() {
    const modal = await this.modalCtrl.create({
      component: BuscarClienteCompComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  async verAgenda() {
    const modal = await this.modalCtrl.create({
      component: AgendaCompComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  cerrarSesion(){
    localStorage.removeItem("rut_vet");
    this.nav.navigateRoot('login')
  }

  abrirPerfil() {
    this.nav.navigateForward('perfil')  
  }
  

}
