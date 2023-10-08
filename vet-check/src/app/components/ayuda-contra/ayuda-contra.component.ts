import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonInput, ModalController, NavController } from '@ionic/angular';
import { ApiRestService } from 'src/app/api-rest.service';

@Component({
  selector: 'app-ayuda-contra',
  templateUrl: './ayuda-contra.component.html',
  styleUrls: ['./ayuda-contra.component.scss'],
})
export class AyudaContraComponent  implements OnInit {

  correoSend=false;
  valid = false;
  isCodigo = false; 
  formCodigo: FormGroup;
  formContra: FormGroup;
  formCorreo: FormGroup;
  encontrado = false;
  rutVeterinarios: any;
  constructor(
    private api: ApiRestService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private nav: NavController,
    private modalCtrl: ModalController,
  ) {

    this.formCorreo = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    })

    this.formCodigo = this.fb.group({
      codigo : [{value:'', disabled: false}, Validators.required]
    })

    this.formContra = this.fb.group({
      contraNueva : ['', [Validators.required, Validators.minLength(8),Validators.maxLength(15), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[A-Za-z])\S{8,}$/)]],
    })

   }

  ngOnInit() {}


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


    //Se envia codigo a correo electronico
    async  enviarCodigo(correo: IonInput){
      //this.api.enviarCorreoDos( correo.value,'Personita');
      this.correoSend = true; 
    }
  
    //Comprobamos si el codigo es valido
    async setCodigo(cod: IonInput){
      this.isCodigo = true;
      this.valid = true;
      // let correo = await this.api.response 
      // if(cod.value===correo.codigo){
      //   this.isCodigo = true;
      //   this.valid = true
      // }else{
      //   const alert = await this.alertController.create({
      //     cssClass: 'my-custom-class',
      //     header: 'Código inválido',
      //     message: 'Por favor, ingrese el código enviado a su correo',
      //     buttons: [
      //       {
      //         text: 'OK',
      //         role: 'cancel'
      //       }
      //     ]
      //   });
      //   await alert.present();
      //   this.isCodigo = false;
      // }
    }
  
    async setContra(){
      
      let data = {}
      let ok = false;
      

      this.rutVeterinarios = await this.api.datosAPI('/veterinario')

      let id
      this.rutVeterinarios.forEach((e:any)=>{
        if(e.correo_vet==this.formCorreo.get('correo')?.value){
          id = e.rut_vet;
          ok = true;
        }
      })

      if(ok){
          //this.api.cambiarDatos(id, 'veterinario/', data, 1)
          this.cancel();
      }

    }


}
