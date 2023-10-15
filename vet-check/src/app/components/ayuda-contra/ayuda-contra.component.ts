import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonInput, ModalController, NavController, ToastController } from '@ionic/angular';
import { ApiRestService } from 'src/app/api-rest.service';

@Component({
  selector: 'app-ayuda-contra',
  templateUrl: './ayuda-contra.component.html',
  styleUrls: ['./ayuda-contra.component.scss'],
})
export class AyudaContraComponent  implements OnInit {

  correoSend=false;
  valid = false;
  isSent = false;
  isCodigo = false;
  modalContra = false;
  response : any
  formCodigo: FormGroup;
  formContra: FormGroup;
  formCorreo: FormGroup;
  encontrado = false;
  rutVeterinarios: any;
  rut: any;
  isHidden = '';
  constructor(
    private api: ApiRestService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private nav: NavController,
    private modalCtrl: ModalController,
    private toastController :  ToastController
  ) {

    this.formCorreo = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    })

    this.formCodigo = this.fb.group({
      codigo : [{value:'', disabled: false}, Validators.required]
    })

    this.formContra = this.fb.group({
      contraNueva : ['', [Validators.required, Validators.minLength(6),Validators.maxLength(12), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[A-Za-z])\S{6,}$/)]],
    })

   }

  ngOnInit() {}


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async alertInput(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Se te ha enviado un código',
      message: 'Abre tú correo e ingresa el código que te enviamos',
      buttons: [
        {
          text: 'Ok',
          role: 'confirm',
          handler: async (codigo: any)=>{
            if(codigo.Codigo==this.response.codigo){
              this.isCodigo = true;
              this.valid = true
            }else{
              const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'Código inválido',
                message: 'Por favor, ingrese el código enviado a su correo',
                buttons: [
                  {
                    text: 'OK',
                    role: 'cancel', 
                    handler: ()=>{
                      this.alertInput()
                    }
                  }
                ]
              });
              await alert.present();
              this.isCodigo = false;
            }
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: ()=>{
            this.isSent = false;
            this.isHidden = '';
          }
        }],
        inputs : [{
          placeholder: 'Código de verificación',
          name: 'Codigo',
          id: 'codigo',
        }]
      });
    await alert.present();
  }

  //Se envia codigo a correo electronico
  async enviarCodigo(correo : IonInput){
    let vets: any = await this.api.traerDatosApi('/veterinario')

    vets.forEach((e: any)=>{
      if(e?.correo_vet==correo?.value){
        this.rut = e?.rut_vet
      }
    })

    this.isSent = true;
    this.isHidden = 'hidden'
    this.api.enviarCorreo(correo.value, 'Víctor').subscribe(async(res:any)=>{
      this.response = res
      const toast = await this.toastController.create({
        message: 'Se ha envíado el correo, revisa tú email',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
    }, async error=>{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Ha habído un problema',
        message: 'Lo sentimos, se ha originado un problema al enviar tú código de verificación. Intentalo más tarde.',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
    });
    this.correoSend = false;
    this.alertInput()
  }

  async setContra(){
    
    let data = {}
    let ok = false;
    
    if(!this.formContra.get('contraNueva')?.value){
        // Si no hay datos en uno de los dos campos se lanza alerta.
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Campos incompletos',
          message: 'Por favor, ingrese valores en los campos',
          buttons: [
            {
              text: 'OK',
              role: 'cancel'
            }
          ]
        });
        await alert.present();
    }else{
      if(this.valid){        
        ok = true
        data = {
          'password_vet': this.formContra.get('contraNueva')?.value
        }
      }else{
      // Si las contraseñas son diferentes.
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Algo ha salido mal',
        message: 'Intenta nuevamente o prueba mas tarde',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
      }
    }
    if(ok){
      this.api.cambiarDatos(this.rut, 'veterinario/', data, 1)
      this.cancel();
    }
  }

}
