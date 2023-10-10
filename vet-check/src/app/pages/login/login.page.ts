import { Component, OnInit } from '@angular/core';
import { IonInput, NavController, AlertController, ModalController } from '@ionic/angular';
import { ApiRestService } from '../../api-rest.service';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AyudaContraComponent } from 'src/app/components/ayuda-contra/ayuda-contra.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  resultado:any;
  rut1 : any;
  pass : any;

  formLogin: FormGroup;

  constructor(
    private nav: NavController,
    private api : ApiRestService,
    private alertController : AlertController,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
  ) { 
    this.formLogin = this.fb.group({
      rut: ['', [Validators.required, Validators.minLength(9)]],
      contra: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit() {
    if(localStorage.getItem("rut_vet")){
      this.nav.navigateRoot("/home")
    }
  }
  

  readonly rutMask: MaskitoOptions = {
    mask: [
      ...Array(8).fill(/\d/),
      '-',
      ...Array(1).fill(/\d/)
    ],
  };
  

  readonly maskRut: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();


  async inicioDeSesion(rut: IonInput, contra: IonInput){
    let rut_storage: any = rut.value
    this.pass = contra.value
    //Mensajes de error:    
    const usuarioInactivo = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cuenta suspendida',
      message: 'Esta cuenta actualmente se encuentra suspendida',
      buttons: [{text: 'OK', role: 'cancel'}]
    });
    const datosIncorrectos = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Datos incorrectos',
      message: 'Ingresa nuevamente tu rut y contraseña para acceder',
      buttons: [{text: 'OK', role: 'cancel'}]
    });
    const errorDeServidor = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ha habído un problema',
      message: 'Comprueba tu conexión a internet o intenta ingresar tus claves de acceso más tarde',
      buttons: [{text: 'OK', role: 'cancel'}]
    });
  
    this.resultado = this.api.login(rut.value, contra.value, 'veterinario/login/').subscribe(async (response: any)=>{
      if(response=='Activo' || response=='Administrador'){
        localStorage.setItem('rut_vet', rut_storage)
        this.nav.navigateForward('/home')
      }
    }, async error=>{              
      if(error.status==401){
        await datosIncorrectos.present();
      }else
      if(error.status==403){
        await usuarioInactivo.present();
      }
      else{          
        await errorDeServidor.present();
      }
    })
  }


  async olvidada() {
    
    this.formLogin.reset();

    const modal = await this.modalCtrl.create({
      component: AyudaContraComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

}
