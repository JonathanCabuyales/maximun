import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepreciacionService {
  baseUrl = environment.baseUrl;

  resultado: any;


  constructor(
    private _http: HttpClient
  ) { }


  getCuentasContables(token: any  ){
    this.resultado = this._http.get(`${this.baseUrl}/cuentas_contables/cuentas_contables_get.php?token=${token}`);
    return this.resultado;
  }

}
