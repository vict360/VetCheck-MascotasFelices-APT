import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiRestService } from '../../api-rest.service';
import { NavController, ModalController } from '@ionic/angular';
// componentes
import { AgregarHistorialCompComponent } from '../../components/agregar-historial-comp/agregar-historial-comp.component';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';

@Component({
  selector: 'app-ficha-mascota',
  templateUrl: './ficha-mascota.page.html',
  styleUrls: ['./ficha-mascota.page.scss'],
})
export class FichaMascotaPage implements OnInit {

  arg:any | undefined;
  resultado: any | undefined;
  especie: any | undefined;
  raza: any | undefined;
  cliente: any | undefined;
  rut_veterinarios: any[]=[];
  procedimientos: any
  isModMascota = false;
  formModMascota: FormGroup;
  mascota: any;
  checkbox = false;
  fecha_nacimiento: any;
  chip_mascota: any
  felinos: any;
  caninos: any;
  fechaModulo: any;
  rut_clientes: any[]=[];
  constructor(
    private actRoute: ActivatedRoute,
    private api: ApiRestService,
    private nav: NavController,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
  ) { 
    this.formModMascota = this.fb.group({
      rutDuenoMod: ['', [Validators.required]],
      nombreMod: ['', [Validators.required]],
      edadMod: ['', [Validators.required]],
      estaturaMod: ['', [Validators.required]],
      sexoMod: ['', [Validators.required]],
      colorMod: ['', [Validators.required]],
      especieMod: ['', [Validators.required]],
      razaMod: ['', [Validators.required]],
      chip: [''],
    })

  }

  async ngOnInit() {
    this.arg = this.actRoute.snapshot.paramMap.get('id')?.toString();
    this.resultado = await this.api.traerDatosApi('mascota/'+this.arg)
    this.especie = await this.api.traerDatosApi('especie/'+this.resultado.especie_masc);
    this.raza = await this.api.traerDatosApi('raza/'+this.resultado.raza_mascota)
    this.cliente = await this.api.traerDatosApi('cliente/'+this.resultado.rut_cliente)
    this.procedimientos = await this.api.traerDatosApi('procedimiento/')

    this.resultado.ficha.forEach(async (e:any, i:any)=>{
      let rut = await this.api.llamadaApi(e.rut_vet)
      this.rut_veterinarios.push(rut)
    })

    this.felinos = await this.api.traerDatosApi('felino/');
    this.caninos = await this.api.traerDatosApi('canino/');

    this.establecerValoresForm();

    let fecha_moment = moment(this.resultado?.fecha_nac, 'DD-MM-YYYY');
    this.fechaModulo = fecha_moment.format('YYYY-MM-DD');

    let ruts: any;

    ruts = await this.api.traerDatosApi('cliente/')

    ruts.forEach((e:any)=>{
      this.rut_clientes.push(e.rut_cliente);
    })

    this.formModMascota.get('rutDuenoMod')?.addValidators(this.rutExistenteValidator(this.rut_clientes))
  
  }


    rutExistenteValidator(rutArray: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rutValue = control.value;
  
      if (rutValue && !rutArray.includes(rutValue)) {
        return { rutNoExiste: true };
      }
  
      return null;
    };
  }
  

  establecerValoresForm(){
    let espe

    if(this.resultado?.especie_masc==2){
      espe = 'Felino'
    }else{
      espe = 'Canino'
    }
    
    let fel
    this.felinos.forEach((e:any)=>{
      if(e.id_raza==this.resultado?.raza_mascota){
        fel = e.nombre_raza
      }
    })

    let can
    this.caninos.forEach((e:any)=>{
      if(e.id_raza==this.resultado?.raza_mascota){
        can = e.nombre_raza
      }
    })

    //Se establecen valores default del form con los datos traidos.
    this.formModMascota.get('rutDuenoMod')?.setValue(this.resultado?.rut_cliente)
    this.formModMascota.get('nombreMod')?.setValue(this.resultado?.nombre_masc)
    this.formModMascota.get('colorMod')?.setValue(this.resultado?.color_masc)
    this.formModMascota.get('sexoMod')?.setValue(this.resultado?.sexo_masc)
    this.formModMascota.get('especieMod')?.setValue(espe)
    if(espe=='Felino'){
      this.formModMascota.get('razaMod')?.setValue(fel)
    }else{
      this.formModMascota.get('razaMod')?.setValue(can)
    }
    this.formModMascota.get('edadMod')?.setValue(this.resultado?.edad_masc)
    this.formModMascota.get('estaturaMod')?.setValue(this.resultado?.estatura_masc)
  }

  readonly cardMask: MaskitoOptions = {
    mask: [
      ...Array(8).fill(/\d/),
      '-',
      ...Array(1).fill(/\d/)
    ],
  };

  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();


  volver(){
    this.nav.navigateBack('/home')
  }

  async addProcedimiento() {
    const modal = await this.modalCtrl.create({
      component: AgregarHistorialCompComponent,
      componentProps: { data: this.resultado.url}
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  modificarProcedimiento(){
    this.nav.navigateForward(`/historial/${this.resultado.id_masc}`)   
  }



  cambiarCheckbox(event:any){
    this.checkbox = event.detail.checked;
    if(this.checkbox){
       this.formModMascota.get('chip')?.setValidators([Validators.minLength(10), Validators.required])
     }else{      
       this.formModMascota.get('chip')?.removeValidators(Validators.required)
       this.formModMascota.get('chip')?.reset()
     }
  }
  // Funcion que almacena los datos que sean ingresados en chip mascota, debido a que el objeto no existe si no esta checado
  async chipChange(event:any){
    this.chip_mascota = await event.detail.value
  }


  async fecha(event:any){
    let fecha_moment = await moment(event.detail.value); // fecha_nacimiento = "2023-07-10T22:04:00"
    this.fecha_nacimiento = fecha_moment.format('YYYY-MM-DD')    
  }



  async abrirModificar(is: boolean) {
     this.isModMascota = is;
     this.establecerValoresForm();
    }


  modificarMascota(){
    
    if(!this.fecha_nacimiento){
      console.log("fecha null o undefined");
      this.fecha_nacimiento = this.fechaModulo
    }
    

    let razaMas
    this.felinos.forEach((e:any)=>{
      if(e.nombre_raza==this.formModMascota.get('razaMod')?.value){
        razaMas = e.id_raza
      }else{
        this.caninos.forEach((canE:any)=>{
          if(canE.nombre_raza==this.formModMascota.get('razaMod')?.value){
            razaMas = canE.id_raza
          }
        })
      }
    })

    let especie
    if(this.formModMascota.get('especieMod')?.value=='Felino'){
      especie = 2
    }else{
      especie = 1
    }


    let data = {
      "chip_masc": this.formModMascota.get('chip')?.value,
      "nombre_masc": this.formModMascota.get('nombreMod')?.value,
      "edad_masc": this.formModMascota.get('edadMod')?.value,
      "especie_masc": especie,
      "sexo_masc": this.formModMascota.get('sexoMod')?.value,
      "estatura_masc": this.formModMascota.get('estaturaMod')?.value,
      "fecha_nac": this.fecha_nacimiento,
      "color_masc": this.formModMascota.get('colorMod')?.value,
      "rut_cliente": this.formModMascota.get('rutDuenoMod')?.value,
      "raza_mascota": razaMas,
    }

    this.api.cambiarDatos(this.resultado?.id_masc, 'mascota/', data, 2);
    

  }

}
