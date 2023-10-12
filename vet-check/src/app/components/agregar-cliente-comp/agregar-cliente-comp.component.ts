import { Component, OnInit} from '@angular/core';
import { IonInput, IonSelect, ModalController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import * as moment from 'moment';
import { ApiRestService } from '../../api-rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-cliente-comp',
  templateUrl: './agregar-cliente-comp.component.html',
  styleUrls: ['./agregar-cliente-comp.component.scss'],
})


export class AgregarClienteCompComponent implements OnInit{
  // Variables  
  fecha_nacimiento: any | undefined;
  name: string | undefined;
  comunas: any | undefined;
  rutContra: any | undefined;
  form: FormGroup
  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private api: ApiRestService,
    private fb: FormBuilder,
    private toastController: ToastController
  ) {

      this.form = this.fb.group({
        rut: ['', [Validators.minLength(8), Validators.required]],
        nombre: ['', [Validators.minLength(3), Validators.required]],
        apellido : ['', [Validators.required, Validators.minLength(4)]],
        email: ['',[Validators.required, Validators.email]],
        tel: ['+569',[Validators.required, Validators.minLength(10)]],
        comuna: ['', [Validators.required]],
        dir: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]]
      })

   }
  
  // Se utiliza ngOnInit para llamar a la api y traer los datos de las comunas
  async ngOnInit() {
    this.comunas = await this.api.traerDatosApi('comuna');
  }

  readonly rutMask: MaskitoOptions = {
    mask: [
      ...Array(8).fill(/\d/),
      '-',
      ...Array(1).fill(/\d/)
    ],
  };

  
  readonly maskRut: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();


  readonly telMask: MaskitoOptions = {
    mask: [
      ...Array(0).fill(/\d/),
      '+',
      ...Array(12).fill(/\d/)
    ],
  };

  readonly maskTel: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  

  cancel() {
        return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm(rut: IonInput, nombre: IonInput, apellido: IonInput, telefono: IonInput, correo: IonInput, comuna: IonSelect, direccion: IonInput) {
      let datos : any;
      // Verificamos que los campos no esten vacios
      if (!rut.value || !nombre.value|| !apellido.value || !telefono.value || !correo.value || !comuna.value || !direccion.value){
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Campos requeridos',
            message: 'Por favor, complete y seleccione todos los campos requeridos',
            buttons: [
              {
                text: 'OK',
                role: 'cancel'
              }
            ]
          });
          await alert.present();
          
      }
      else{
        this.rutContra = rut.value
        // Guardamos todos los datos
        datos = {
            "rut_cliente": rut.value,
            "nombre_cliente": nombre.value,
            "apellido_cliente": apellido.value,
            "telefono_cliente": telefono.value, 
            "correo_cliente": correo.value,
            "direc_cliente": direccion.value,
            "password_cliente": this.rutContra.replace('-',''),
            "comuna": comuna.value,
            "mascotas": null
        }

        this.api.agregarEntidad('cliente', datos).subscribe(async (response: any)=>{
          console.log(response);
          const toast = await this.toastController.create({
            message: 'El cliente: '+rut.value+' fue agregado correctamente',
            duration: 2000,
            position: 'bottom',
            color: 'success'
          });
          await toast.present();
          this.cancel();
        }, async error=>{
          
          console.log(error.error);
          console.log(error.status);

          if(error.status==400){
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              header: 'Datos inválidos',
              message: 'La información enviada es incorrecta',
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
              header: 'Algo ha salido mal',
              message: 'Intentalo nuevamente',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel'
                }
              ]
            });
            await alert.present();
          }
          
        })
      }
    }


}