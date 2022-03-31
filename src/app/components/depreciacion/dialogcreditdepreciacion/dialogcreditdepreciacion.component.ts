import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { parse } from 'path';
import { DepreciacionI } from 'src/app/models/depreciacion/depreciacion';
import { DepreciacionService } from 'src/app/services/depreciaciones/depreciacion.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogcreditdepreciacion',
  templateUrl: './dialogcreditdepreciacion.component.html',
  styleUrls: ['./dialogcreditdepreciacion.component.css']
})
export class DialogcreditdepreciacionComponent implements OnInit {
  depreciacion: DepreciacionI;
  token: string = '';
  valor_residual = '1.10';
  depr: any;
  cuentas: any = [];
  constructor(
    private _cookie: CookieService,
    private _login: LoginService,
    private _toast: ToastrService,
    private _depr: DepreciacionService
  ) { }

  ngOnInit(): void {
    this.token = this._cookie.get('token');

    this.depreciacion = {
      id_usuario: '',
      descripcion: '',
      fecha_compra: '',
      valor_inicial:'',
      valor_anual:'',
      id_cuentas:'',
    }
    this.mostrarContables();
    
  }

  guardar(){
    
    if(this.depreciacion.valor_inicial.length == 0){
      this._toast.warning('El valor inicial es obligatorio', 'Error');
    }else if(this.depreciacion.fecha_compra.length == 0){
      this._toast.warning('Fecha de compra es obligatorio', 'Error');
    }else if(this.depreciacion.descripcion.length == 0){
      
      this._toast.warning('La categoria es obligatoria', 'Error');
    }else{

      this._login.getuserdata(this.token)
      .subscribe(resp =>{
        this.depr= (parseFloat(this.depreciacion.valor_inicial) - (parseFloat(this.depreciacion.valor_inicial)* parseFloat(this.valor_residual)));
        
        this.depreciacion.id_usuario = resp.data.id;
        
      });
    }

    
    
  }


  mostrarContables(){

    console.log(this.token);
    
    this._depr.getCuentasContables(this.token)
    .subscribe(resp => {
      console.log(resp);
      
      this.cuentas = (resp.data);

      console.log(this.cuentas);
      
      
    });
  }

  

}
