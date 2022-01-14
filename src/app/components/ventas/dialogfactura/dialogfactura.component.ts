import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ClienteI } from 'src/app/models/cliente.interface';
import { EmpleadoVentaI } from 'src/app/models/empleados/empleadoventa.interface';
import { EmpresaI } from 'src/app/models/empresa/empresa.interface';
import { ProsernuevoI } from 'src/app/models/prosernuevo.interface';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ProdservService } from 'src/app/services/prodserv.service';
import { DialogallclientesComponent } from '../../clientes/dialogallclientes/dialogallclientes.component';
import { DialogprodservComponent } from '../../productosservicios/dialogprodserv/dialogprodserv.component';
import { DialogempleadosventasComponent } from '../dialogempleadosventas/dialogempleadosventas.component';
import * as forge from 'node-forge'

@Component({
  selector: 'app-dialogfactura',
  templateUrl: './dialogfactura.component.html',
  styleUrls: ['./dialogfactura.component.css']
})
export class DialogfacturaComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'descripcion', 'cantidad', 'precio', 'eliminar'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  listaProSer: ProsernuevoI[];
  prodser: ProsernuevoI[];

  // variables para el cliente
  cliente: ClienteI;
  showCliente: boolean = false;

  // variable para cargar la informacion de la empresa
  empresa: EmpresaI;

  // variables para los empleados
  showVendedor: boolean = false;
  empleado: EmpleadoVentaI;

  // varibales para los items de la factura
  lastIndex: number = 0;
  subtotal12: string = '0.00';
  subtotal0: string = '0.00';
  iva: string = '0.00';
  ice: number = 0;
  propina: number = 0;
  totalFactura: string = '0.00';


  // variable para el token
  token: string = '';

  // variables para la firma
  p12password: string = '';
  file: any;

  constructor(public dialog: MatDialog,
    private _prodser: ProdservService,
    private _empresa: EmpresaService,
    private toastr: ToastrService,
    private _cookie: CookieService) { }

  ngOnInit(): void {
    this.token = this._cookie.get('token');

    this.cliente = {
      id_cli: 0,
      nombres_cli: '',
      apellidos_cli: '',
      ciruc_cli: '',
      direccion_cli: '',
      telefono_cli: '',
      email_cli: '',
      created_at: new Date()
    }

    this.loadEmpresa();

    this.listaProSer = [];

  }

  loadEmpresa() {

    this._empresa.getAll(this.token).subscribe(res => {
      if (res.data.length) {
        this.empresa = res.data;
      } else {
        this.toastWarning("No hay información de la empresa, por favor verifique e intente nuevamente más tarde");
      }
    });

  }

  loadProSer() {
    const dialogRef = this.dialog.open(DialogprodservComponent, {
      width: '70%'
    });

    dialogRef.afterClosed().subscribe(res => {

      if (res != undefined) {
        if (!this.listaProSer.length) {
          this.listaProSer[0] = res;
        } else {
          this.lastIndex = this.listaProSer.length;
          this.listaProSer[this.lastIndex] = res;
        }
      }

      this.dataSource = new MatTableDataSource(this.listaProSer);
      this.dataSource.paginator = this.paginator;

    });
  }

  cargarClientes() {

    const dialogRef = this.dialog.open(DialogallclientesComponent, {
      width: '70%'
    });

    dialogRef.afterClosed().subscribe(res => {

      console.log(res);

      if (res) {
        this.showCliente = true;
        this.cliente = res;
      } else {
        this.showCliente = false;
      }

      // if (res != undefined) {
      //   this.clienteSeleccionado = res;
      //   this.btnRegistrar = true;
      // }
    });

  }

  // funcion para cargar los empleados de ventas
  loadEmpleadosVentas() {
    const dialogRef = this.dialog.open(DialogempleadosventasComponent, {
      width: '70%'
    });

    dialogRef.afterClosed().subscribe(res => {


      if (res) {
        this.showVendedor = true;
        this.empleado = res;
      }

      // if (res != undefined) {

      //   this.listaProSer = [];
      //   this.listaProSer[0] = res;
      //   console.log(this.listaProSer);

      // this.dataSource = new MatTableDataSource(this.listaProSer);
      // this.dataSource.paginator = this.paginator;
      // }
    });
  }

  // funciones para la seccion de items

  borrarItems(item: any) {

    for (let i = 0; i < this.listaProSer.length; i++) {

      if (this.listaProSer[i].id_proser == item.id_proser) {
        this.listaProSer.splice(i, 1);
      }

    }

    this.dataSource = new MatTableDataSource(this.listaProSer);
    this.dataSource.paginator = this.paginator;
  }

  archivo_p12(archivo) {
    console.log(archivo.target.files[0]);
    this.file = archivo.target.files[0];

    let reader = new FileReader();

    reader.addEventListener("loadend", function (event) {
        archivo = event.target.result;
        console.log();
        var p12password = document.querySelector("#p12password");
    }, false);

    //reader.readAsDataURL(file);
    reader.readAsArrayBuffer(this.file);

  }

  archivo_comprobante(archivo) {
    console.log(archivo.target.files[0]);
    let arrayUint8 = new Uint8Array(archivo.target.files[0]);
    
    console.log(arrayUint8);


  }

  firmar() {

  }

  sha1_base64(txt) {
    var md = forge.md.sha1.create();
    md.update(txt);
    //console.log('Buffer in: ', Buffer);
    return new Buffer(md.digest().toHex(), 'hex').toString('base64');
  }

  hexToBase64(str) {
    var hex = ('00' + str).slice(0 - str.length - str.length % 2);

    return btoa(String.fromCharCode.apply(null,
      hex.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
  }

  bigint2base64(bigint) {
    var base64 = '';
    base64 = btoa(bigint.toString(16).match(/\w{2}/g).map(function (a) { return String.fromCharCode(parseInt(a, 16)); }).join(""));

    base64 = base64.match(/.{1,76}/g).join("\n");

    return base64;
  }

  p_obtener_aleatorio() {
    return Math.floor(Math.random() * 999000) + 990;
  }



  // p_comprobar_numero_cedula(cedula) {

  //   if (typeof (cedula) == 'string' && cedula.length == 10 && /^\d+$/.test(cedula)) {
  //     var digitos = cedula.split('').map(Number);
  //     var codigo_provincia = digitos[0] * 10 + digitos[1];

  //     if (codigo_provincia >= 1 && codigo_provincia <= 24 && digitos[2] < 6) {
  //       var digito_verificador = digitos.pop();

  //       var digito_calculado = digitos.reduce(function (valorPrevio, valorActual, indice) {
  //         return valorPrevio - (valorActual * (2 - indice % 2)) % 9 - (valorActual == 9) * 9;
  //       }, 1000) % 10;

  //       return (digito_calculado === digito_verificador);
  //     }
  //   }
  //   return false;
  // }


  // funcion para calcular el modulo 11
  p_calcular_digito_modulo11(numero) {
    var digito_calculado = -1;

    if (typeof (numero) == 'string' && /^\d+$/.test(numero)) {

      var digitos = numero.split('').map(Number); //arreglo con los dígitos del número

      digito_calculado = 11 - digitos.reduce(function (valorPrevio, valorActual, indice) {
        return valorPrevio + (valorActual * (7 - indice % 6));
      }, 0) % 11;

      digito_calculado = (digito_calculado == 11) ? 0 : digito_calculado; //según ficha técnica
      digito_calculado = (digito_calculado == 10) ? 1 : digito_calculado; //según ficha técnica
    }
    return digito_calculado;
  }


  // funcion para filtro de busqueda
  applyFilter(filtro: string) {
    filtro = filtro.trim(); // Remove whitespace
    filtro = filtro.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filtro;
  }

  toastSuccess(mensaje: string) {
    this.toastr.success('Registro ' + mensaje + ' exitosamente!!!', 'Exito', {
      timeOut: 3000,
    });
  }

  toastWarning(mensaje: string) {
    this.toastr.warning(mensaje + '!!!', 'Advertencia', {
      timeOut: 3000,
    });
  }

  toastError(mensaje: string) {
    this.toastr.error('Ha ocurrido un problema, intentelo nuevamente más tarde ' + mensaje, 'ERROR', {
      timeOut: 3000,
    });
  }

}