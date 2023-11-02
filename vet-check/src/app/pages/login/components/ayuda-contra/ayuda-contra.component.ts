import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonInput, ModalController, NavController, ToastController } from '@ionic/angular';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
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
  form: FormGroup;
  encontrado = false;
  rutVeterinarios: any;
  rut: any;
  isHidden = ''
  botonHidden = 'hidden'
  constructor(
    private api: ApiRestService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private nav: NavController,
    private modalCtrl: ModalController,
    private toastController :  ToastController
  ) {

    this.form = this.fb.group({
      rut: ['', [Validators.required, Validators.minLength(9)]]
    })

    this.formCodigo = this.fb.group({
      codigo : [{value:'', disabled: false}, Validators.required]
    })

    this.formContra = this.fb.group({
      contraNueva : ['', [Validators.required, Validators.minLength(6),Validators.maxLength(12), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[A-Za-z])\S{6,}$/)]],
    })

   }

  ngOnInit() {}


  readonly rutMask: MaskitoOptions = {
    mask: [
      ...Array(8).fill(/[0-9]/),
      '-',
      ...Array(1).fill(/[0-9Kk]/)
    ],
  };

  readonly maskRut: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

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

  async enviarCodigo(rut : IonInput){
    let cliente: any = await this.api.traerDatosApi('veterinario/'+rut.value);    
    this.isSent = true;
    this.botonHidden = ''
    this.rut = cliente?.rut_vet;
    this.api.enviarCorreo(cliente?.correo_vet, cliente?.nombre_vet).subscribe(async(res:any)=>{
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
    this.alertInput();
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
          'password_cliente': this.formContra.get('contraNueva')?.value
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
