import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {
  datos: any;
  err: any | undefined;
  response: any | undefined
  private urlApi = environment.API_URL;
  private token = environment.API_KEY
  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private toastController : ToastController,
  ) { }

  agregarEntidad(urlID:any ,data: any){ 
    let url = this.urlApi+'/'+urlID+'/'
    let options = { headers: { 
      'Authorization': this.token,
      } };
    return this.http.post(url, data, options);
  }

  llamadaApi(url:any){ 
    let options = {
      headers:{'Authorization': this.token}
    }
    return new Promise((resolve, reject) =>{
      this.http.get(url, options).subscribe((data:any)=>{
        resolve(data);
        this.datos = data;
      },
      async error => {
        console.log(error.status)
        if(error.status===404){
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Sin registro',
            message: 'No se ha encontrado lo que buscabas',
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
      )
    })
  }

  traerDatosApi(urlID:any){
    
    let url = this.urlApi+urlID+'/'
    
    let options = {
      headers:{'Authorization': this.token}
    }
    return new Promise((resolve, reject) =>{
      this.http.get(url, options).subscribe((data:any)=>{
        resolve(data);
        this.datos = data;
      },
      error => {
      }
      )
    })
  }

  async datosAPI(urlID:any){
    
    let url = this.urlApi+urlID+'/'
    
    let options = {
      headers:{'Authorization': this.token}
    }
    return new Promise((resolve, reject) =>{
      this.http.get(url, options).subscribe((data:any)=>{
        resolve(data);
        this.datos = data;
      },
      async error => {
      
        this.err = error.status
        if(error.status===404){
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Sin registro',
            message: 'No se ha encontrado lo que buscabas',
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
            header: 'Ha habído un error',
            message: 'Es probable que nuestros servicios no esten disponible o que se haya perdido la conexión a internet',
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
      )
    })
  }

  cambiarDatos(id:any, urlID: any, data:any, topic: any){
    let url = this.urlApi+urlID+id+'/'
    let options = { headers: { 
      'Authorization': this.token,
      } };
      this.http.patch(url, data, options).subscribe(async (res)=>{
        if(res){
          if(topic === 1){
            const toast = await this.toastController.create({
              message: 'La contraseña fue cambiada con exito',
              duration: 2000,
              position: 'bottom',
              color : 'success'
            });
            await toast.present();
          }
          if(topic===2){
            const toast = await this.toastController.create({
              message: 'Los datos fueron actualizados con exito',
              duration: 2000,
              position: 'bottom',
              color: 'success'
            });
            await toast.present();
          }
        }
      }, async (error)=>{
        if(error){
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Algo salio mal',
            message: 'No se han podido cambiar los datos',
            buttons: [
              {
                text: 'OK',
                role: 'cancel'
              }
            ]
          });
          await alert.present();
      }
    });

  }

  enviarCorreo(correo: any, nombre: any){
    let url = this.urlApi+'correo/enviar_correo/'
    let options = { headers: { 
      'Authorization': this.token,
      } };
    let data = {
      "asunto": "Codigó de verificación",
      "mensaje": "Estimado " + nombre+
      ", Has solicitado un código de verificación para cambiar tu contraseña. Por favor, utiliza el siguiente código para completar el proceso de verificación:",
      "correo": "vict.vargass@duocuc.cl",
      "nombre": nombre
    }
    return this.http.post(url, data, options)
  }

  subirDatos(urlID: any, data:any, topic: any){
    let url = this.urlApi+urlID
    let options = { headers: { 
      'Authorization': this.token,
      } };
      this.http.post(url, data, options).subscribe(async (res)=>{
        if(res){
          if(topic === 1){
            const toast = await this.toastController.create({
              message: 'La contraseña fue cambiada con exito',
              duration: 2000,
              position: 'bottom',
            });
            await toast.present();
          }
          if(topic===2){
            const toast = await this.toastController.create({
              message: 'Los datos fueron cargados con exito',
              duration: 2000,
              position: 'bottom',
              color: 'success'
            });
            await toast.present();
          }
        }
      }, async (error)=>{
        if(error){
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Algo salio mal',
            message: 'No se ha podido agregar información',
            buttons: [
              {
                text: 'OK',
                role: 'cancel'
              }
            ]
          });
          await alert.present();
      }
    });

  }

  login(rut: any, password: any, urlID: any): Observable<any> {
    let url = this.urlApi + '/' + urlID;
    let options = {
      headers: {
        Authorization: this.token,
      },
    };
    let data = {
      user: rut,
      password: password,
    };
  
    return this.http.post(url, data, options);
  }
  
  traerDatosAPI2( urlID:any ){
    let url = this.urlApi+urlID+'/'
    let options = {
      headers:{'Authorization': this.token}
    }
    return this.http.get(url, options);
  }

}