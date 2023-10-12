import { Component, OnInit } from '@angular/core';
import { AlertController, IonInput, NavController, ToastController } from '@ionic/angular';
import { ApiRestService } from '../../api-rest.service';
import {CameraResultType, Camera, CameraSource} from '@capacitor/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage implements OnInit {
  veterinario: any | undefined;
  imagen :  any | undefined;
  rut: any | undefined;
  modalOpen = false;
  modalContra = false;
  correo: any;
  tel : any;
  public formContra : FormGroup;
  public formPersonal : FormGroup;
  public formCodigo : FormGroup;
  correoSend = false;
  isCodigo = false;
  valid = false;
  response: any
  isSent = false;
  constructor(
    private nav : NavController,
    private api : ApiRestService,
    private alertController: AlertController,
    private toastController: ToastController,
    private fb :  FormBuilder
  ) { 
    this.rut = localStorage.getItem('rut_vet')
    this.correo = localStorage.getItem('correo')
    this.tel = localStorage.getItem('tel')

    this.formCodigo = this.fb.group({
      codigo : [{value:'', disabled: false}, Validators.required]
    })

    this.formContra = this.fb.group({
      contraNueva : ['', [Validators.required, Validators.minLength(6),Validators.maxLength(12), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[A-Za-z])\S{6,}$/)]],
    })

    this.formPersonal = this.fb.group({
      email: [this.correo,[Validators.required, Validators.email]],
      tel: [this.tel, [Validators.required, Validators.minLength(11)]]
    })

    

  }


  async ngOnInit() {
    this.traerDatos();
  }

  async traerDatos(){
    this.veterinario = await this.api.datosAPI('veterinario/'+localStorage.getItem("rut_vet")+"/");
    this.formPersonal.get('email')?.setValue(this.veterinario?.correo_vet)
    this.formPersonal.get('tel')?.setValue(this.veterinario?.telefono_vet)
  }

  volver(){
    this.nav.navigateBack('/home')
  }

  async abrir() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });
    if(image){
      this.imagen = image.base64String;
    }else{
      this.imagen = this.veterinario.img_vet;
    }
  }

  setOpen(isOpen: boolean) {
    this.modalOpen = isOpen;
  }

  async modificar(correo: IonInput, telefono: IonInput){
    let data = {}
    if(!this.imagen){
      data = {
        'correo_vet': correo.value,
        'telefono_vet': telefono.value
      } 
    }else{
      data = {
        'img_vet': this.imagen,
        'correo_vet': correo.value,
        'telefono_vet': telefono.value
      }
    }
    this.api.cambiarDatos(this.rut, 'veterinario/', data, 2)
    await this.traerDatos();
    this.setOpen(false);
  }


  //FUNCIONES PARA CAMBIAR LA CONTRASEÑA

  //Se abre modal cambiar contra
  abrirContraModal(is: boolean){
    this.modalContra = is;
    this.formCodigo.get('codigo')?.reset();
    this.formContra.get('contraNueva')?.reset();
    this.isCodigo = false;
    this.correoSend = false;
    if(!is){
      this.isSent = false;
    }
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

  //Se envia codigo a correo electronico
  async  enviarCodigo(){
    this.isSent = true;
    this.api.enviarCorreo('vict.vargass@gmail.com', 'Víctor').subscribe(async(res:any)=>{
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
        message: 'Lo sentimos, se ha originado un problema para enviar tú código de verificación. Intentalo más tarde.',
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
      this.abrirContraModal(false);
    }
  }


}
