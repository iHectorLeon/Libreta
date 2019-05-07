import { environment } from './../../../environments/environment';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Roles } from './../../models/userlms/roles';
import 'rxjs/add/operator/map';
 ;

//permitimos con este decorador inyectar a otras dependencias
@Injectable()
export class UserService{

  public url: string;
  public identiti: any;
  public token: any;
  public roles: any;


  constructor(private http: HttpClient) {
    this.url = environment.url;
  }

  //metodo para aplicar el login al usuario
  singUp(usertologin: any): Observable<any> {
    const json = JSON.stringify(usertologin);
    return this.http.post(this.url + 'login', json);
  }

  /*
  metodo para obtener la informacion del usuario
  */
  getUser(username): Observable<any> {
    return this.http.get(this.url + 'api/v1/user/getdetails?name=' + username);
  }

  /*
  metodo para obtener la informacion del usuario cuando inicia por primera ves sesion
  */
  getUserDetails(username: any): Observable<any> {
    return this.http.get(this.url + 'api/user/getdetails?name=' + username);
  }

  /*
  metodo para traer los datos del usuario logueado
  */
  getIdentiti() {
    const identiti = JSON.parse(localStorage.getItem('identiti'));
    if (identiti !== 'undefined') {
      this.identiti = identiti;
    } else {
      this.identiti = null;
    }
    return this.identiti;
  }

  /*
  metodo para poner el token del usuario logueado donde el api lo requiera
  */
  getToken() {
    const token = localStorage.getItem('token');
    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  /*
  Metodo para obtener los roles del usuario
  */
  getRoles():Observable<any>{
    let isOrg:any=[];
    /*
    let headers = {headers:new HttpHeaders({
      'x-access-token':this.getToken()
    })};
    */
    return this.http.get(this.url+'api/v1/user/myroles');
  }

  /*
  Metodo para imprimir los errores que se generen en API
  */
  parserErrors(error:string):string{
    if(error.match("Not Found")){
      return "Usuario o contraseña invalido, favor de validar que los datos proporcionados sean las correctos";
    }
    return "Error desconocido";
  }

  /*
  Metodo para validar al usuario que se acaba de registrar
  */
  userConfirm(confirm):Observable<any>{
    console.log(confirm);
    let params = JSON.stringify(confirm);
    /*
    let headers = {headers:new HttpHeaders({
      'Content-Type':'application/json',
    })};
    */
    return this.http.put(this.url+'api/user/confirm',params)//,headers)//.map(res=>res.json());
    //return this.http.get(this.url+'api/user/confirm?email='+emailuser+'&token='+tokentemp+'&password='+password).map(res=>res.json());;
  }

  /*
  funcion para usar el api de recuperacion de contraseña (envio de email al usuario)
  */
  /*
  recoverPassword(email:any){
    return this.http.get(this.url+"api/user/validateemail?email="+email).map(res=>res.json());
  }
  */
  /*
  funcion para el cambio de contraseña
  */
  changePassword(newpassword){
    let params = JSON.stringify(newpassword);
    let headers ={headers: new HttpHeaders(
      {
        'Content-Type':'application/json',
        'x-access-token':this.token
      }
    )};
    return this.http.put(this.url+'api/v1/user/passwordchange',params,headers)//.map(res=>res.json());
  }

  /*
  funcion para la recuperacion de contraseña (cambio de contraseña formulario support);
  */
  recoverPass(passwordrecover){
    let params = JSON.stringify(passwordrecover);
    let headers = {headers:new HttpHeaders(
      {
        'Content-Type':'application/json',
      }
    )};
    return this.http.put(this.url+'api/user/passwordrecovery',params,headers)//.map(res=>res.json());
  }

  /*
  metodo para devolver el total de notificaciones nuevas
  */
  getNotifications():Observable<any>{
    let headers = { headers:new HttpHeaders(
      {
        'Content-Type':'application/json',
        'x-access-token':this.token
      }
    )};
    return this.http.get(this.url+'api/v1/user/message/new',headers)//.map(res=>res.json());
  }

  /*
  metodo para obtener mis notificaciones
  */
  getMyNotificationsBell():Observable<any>{
    let headers ={headers:new HttpHeaders(
      {
        'Content-Type':'application/json',
        'x-access-token':this.token
      })
    };
    return this.http.get(this.url+'api/v1/user/message/my?read=false',headers)//.map(res=>res.json());
  }

  /*
  metodo para obtener mis notificaciones
  */
  getMyNotifications():Observable<any>{
    let headers = {headers: new HttpHeaders(
      {
        'Content-Type':'application/json',
        'x-access-token':this.token
      }
    )};
    return this.http.get(this.url+'api/v1/user/message/my', headers)//.map(res=>res.json());
  }

  /*
  meotodo para agregar una notificacion
  */
  setNotification(message){
    let params = JSON.stringify(message);
    let headers = {headers: new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    })}
    return this.http.post(this.url+'api/v1/user/message/create', params, headers)//.map(res=>res.json());
  }

  /*
  metodo para cerrar notificaciones
  */
  closeNotification(notificationid){
    let params = JSON.stringify(notificationid)
    let headers = {headers : new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    })}
    return this.http.put(this.url+'api/v1/user/message/close', params, headers);
  }

  /*
  crear un follos a determinado elemento
  */
  setFollow(follow){
    const params = JSON.stringify(follow);
    const headers = {headers : new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    })}
    return this.http.post(this.url+'api/v1/user/follow/create', params, headers);
  }

  /*
  quitar el follos a determinado elemento
  */
  quitFollow(followid: any) {
    const params = JSON.stringify(followid);
    const headers = {headers: new HttpHeaders
      ({
      'Content-Type': 'application/json',
      'x-access-token': this.token
      })
    };
    return this.http.put(this.url + 'api/v1/user/follow/delete', params, headers);
  }
  /*
  metodo para modificar los datos del usuario
  */
  userModify(person: any) {
    const params = JSON.stringify(person);
    const headers = {headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.token
      })
    };
    return this.http.put(this.url + 'api/v1/user/modify', params, headers);
  }
}
