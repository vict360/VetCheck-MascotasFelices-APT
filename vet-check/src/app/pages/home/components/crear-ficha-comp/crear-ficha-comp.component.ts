import { Component, OnInit} from '@angular/core';
import { IonInput, IonSelect, ModalController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import * as moment from 'moment';
import { ApiRestService } from '../../../../api-rest.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-crear-ficha-comp',
  templateUrl: './crear-ficha-comp.component.html',
  styleUrls: ['./crear-ficha-comp.component.scss'],
})


export class CrearFichaCompComponent implements OnInit{
  // Variables  
  fecha_nacimiento: any | undefined;
  name: string | undefined;
  checkbox: boolean = false;
  chip_mascota : string | undefined;
  fecha_actual : string | undefined;
  felinos: any | undefined;
  caninos: any | undefined;
  formMascota: FormGroup;
  raza: any
  rut_clientes: any []=[]
  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private api: ApiRestService,
    private fb: FormBuilder,
    private toastController : ToastController
  ) { 
    this.formMascota = this.fb.group({
      rutDueno : ['',[Validators.required, Validators.minLength(8)]],
      nombreMasc : ['', [Validators.required, Validators.minLength(3)]],
      sexoMasc : ['',[Validators.required]],
      especieMasc : ['',[Validators.required]],
      razaMasc : ['', [Validators.required]],
      estaturaMasc : ['', [Validators.required]],
      edadMasc : ['', [Validators.required]],
      colorMasc : ['', [Validators.required]],
      chip : ['']
    })
  }
  
  // Se utiliza ngOnInit para extraer la fecha actual y formatearla a DD-MM-YYYY
  async ngOnInit() {
    let fecha = new Date().toISOString(); // Se obtiene la fecha actual
    this.fecha_actual= moment(fecha).format('YYYY-MM-DD')  // se aplica moment y se da formato a la fecha
    this.felinos = await this.api.traerDatosApi('felino/');
    this.caninos = await this.api.traerDatosApi('canino/');
    
    let ruts: any

    ruts = await this.api.traerDatosApi('cliente/')

    ruts.forEach((e:any)=>{
      this.rut_clientes.push(e.rut_cliente);
    })

    this.formMascota.get('rutDueno')?.addValidators(this.rutExistenteValidator(this.rut_clientes))

  }

  readonly cardMask: MaskitoOptions = {
    mask: [
      ...Array(8).fill(/\d/),
      '-',
      ...Array(1).fill(/[0-9Kk]/)
    ],
  };

  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  cambiarCheckbox(event:any){
    this.checkbox = event.detail.checked;
    if(this.checkbox){
      this.formMascota.get('chip')?.setValidators([Validators.minLength(10), Validators.required])
    }else{      
      this.formMascota.get('chip')?.removeValidators(Validators.required)
      this.formMascota.get('chip')?.reset()
    }
  }


  rutExistenteValidator(rutArray: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let rutValue = control.value;
  
      // Convertir el RUT a mayúsculas
      rutValue = rutValue ? rutValue.toUpperCase() : '';


      if (rutValue && !rutArray.includes(rutValue)) {
        return { rutNoExiste: true };
      }
  
      return null;
    };
  }






  // Funcion que almacena los datos que sean ingresados en chip mascota, debido a que el objeto no existe si no esta checado
  async chipChange(event:any){
    this.chip_mascota = await event.detail.value
  }


  async fecha(event:any){
    let fecha_moment = await moment(event.detail.value); // fecha_nacimiento = "2023-07-10T22:04:00"
    this.fecha_nacimiento = fecha_moment.format('YYYY-MM-DD')    
  }
  

    cancel() {
        return this.modalCtrl.dismiss(null, 'cancel');
    }

    async confirm(rut_dueno: IonInput, nombre_mascota: IonInput ,sexo_mascota: IonSelect, especie: IonSelect, estatura_mascota: IonSelect, edad: IonSelect) {

      let rutDuenoMas: any = rut_dueno.value?.toString().toUpperCase()

      let datos : any;

        // Si la variable chip es undefined, se cambia a ""
        if (!this.chip_mascota){
          this.chip_mascota = ""
        }
        // Si la fecha de nacimiento es la del día actual, reemplaza el valor "" del ion-date por la fecha actual
        if(!this.fecha_nacimiento){
          this.fecha_nacimiento = this.fecha_actual
        }
        // Verificamos que los campos no esten vacios
        if (!rut_dueno.value || !nombre_mascota || !sexo_mascota || !especie || !estatura_mascota){
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
          
        }else{
          // Guardamos todos los datos
          datos = {
            "chip_masc": this.chip_mascota,
            "nombre_masc": nombre_mascota.value,
            "especie_masc": parseInt(especie.value),
            "sexo_masc": sexo_mascota.value, 
            "estatura_masc": estatura_mascota.value,
            "fecha_nac": this.fecha_nacimiento,
            "img_masc": "",
            "rut_cliente": rutDuenoMas,
            "raza_mascota": parseInt(this.formMascota.get('razaMasc')?.value),
            "edad_masc": edad.value,
            "color_masc": this.formMascota.get('colorMasc')?.value
          }

          //this.api.crearMascota(datos);
          
          this.api.agregarEntidad('mascota', datos).subscribe(async (response: any)=>{
            const toast = await this.toastController.create({
              message: 'La mascota ha sido agregada al cliente: '+ rutDuenoMas,
              duration: 2000,
              position: 'bottom',
              color: 'success'
            });
            await toast.present();
          }, async error=>{
            console.log(error.error);
            console.log(error.status);
            
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
          })
          
          this.cancel()
        }
    }

}
