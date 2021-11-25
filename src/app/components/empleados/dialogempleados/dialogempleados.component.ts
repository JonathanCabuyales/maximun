import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UsuarioI } from 'src/app/models/usuario.interface';
import { UsuarioserService } from 'src/app/services/usuarioser.service';
import { DialogconfirmacionComponent } from '../../productosservicios/dialogconfirmacion/dialogconfirmacion.component';
import { DialogdocumentosComponent } from '../dialogdocumentos/dialogdocumentos.component';
import { DialogeditempleadoComponent } from '../dialogeditempleado/dialogeditempleado.component';
import { DialogempleadoComponent } from '../dialogempleado/dialogempleado.component';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dialogempleados',
  templateUrl: './dialogempleados.component.html',
  styleUrls: ['./dialogempleados.component.css']
})

export class DialogempleadosComponent implements OnInit {

  // <!-- usuario, nombres, ciruc, direccion, email, telefono -->
  displayedColumns: string[] = ['usuario', 'nombres', 'ciruc', 'direccion', 'editar'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // variables de combo box
  opcionSeleccionado: string = '0';
  verSeleccion: string = '';
  causas: any;

  listaEmpleados: UsuarioI[];
  empleadoNuevo: UsuarioI;
  empleadoActu: UsuarioI;

  token: any;
  
  constructor(private toastr: ToastrService,
    public dialog: MatDialog,
    private _empleado: UsuarioserService,
    private _cookie: CookieService) { }

  ngOnInit(): void {
    this.token = this._cookie.get('token');

    this.loadEmpleados();

  }

  loadEmpleados(){

  
    this._empleado.getAllEmpleados(this.token).subscribe(res=>{      
      if(res){
        this.listaEmpleados = res.data;
        this.dataSource = new MatTableDataSource(this.listaEmpleados);
        this.dataSource.paginator = this.paginator;
      }else{
        this.toastError("No existen datos registrados");
      } 
      
    });
  }

  createEmpleado() {

    // abro el dialogo para registrar al nuevo empleado....

    const dialogRef = this.dialog.open(DialogempleadoComponent, {
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(res => {

      if (res != undefined) {
        this.empleadoNuevo = res;
        this._empleado.createEmpleado(this.empleadoNuevo).subscribe(res=>{

          if(res== true){
            this.loadEmpleados();
            this.toastSuccess("grabado");
          }else{
            this.loadEmpleados();
            this.toastError("No se pudo registrar el Empleado");
          }
        });        
      }
    });
    
  }
  

  editEmpleado(empleadoUpdate: UsuarioI){

    const dialogRef = this.dialog.open(DialogeditempleadoComponent, {
      width: '650px',
      data: empleadoUpdate
    }
    );

    dialogRef.afterClosed().subscribe(res => {

      if (res != undefined) {
        this.empleadoActu = res;
        console.log(this.empleadoActu);

        this._empleado.updateEmpleado(this.empleadoActu).subscribe(res=>{
          if (res['resultado'] == 'OK') {
            this.loadEmpleados();
            this.toastSuccess("actualizado");
          }
        });
      }

    });
    
  }

  deleteEmpleado(id_usuario: any){
    
    const dialogRef = this.dialog.open(DialogconfirmacionComponent, {
      width: '350px'
    }
    );

    dialogRef.afterClosed().subscribe(res => {

      if (res != undefined) {        
        this._empleado.deleteEmpleado(id_usuario).subscribe(res=>{
          if (res['resultado'] == 'OK') {
            this.loadEmpleados();
            this.toastSuccess("borrado");
          }
        });
      }error =>{
        this.toastError(error);
      }
    });
    
  }

  documentos(usuario: any){
    

    this._empleado.getVerificarDocumentos(usuario).subscribe(res=>{

      if(res.length){
        Swal.fire({
          icon: 'error',
          confirmButtonColor: '#1d1d24',
          text: 'Ya estan registrados los documentos.'
        });
      }else{
        const dialogRef = this.dialog.open(DialogdocumentosComponent, {
          width: '750px',
          data: usuario
        }
        );
    
        dialogRef.afterClosed().subscribe(res => {
    
          if (res != undefined) {        
            
          }error =>{
            this.toastError(error);
          }
        });
      }
      
    }   
    );

  }

  // funcion para filtro de busqueda
  applyFilter(filtro: string){
    filtro = filtro.trim(); // Remove whitespace
    filtro = filtro.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filtro;
  }

  toastSuccess(mensaje: string) {
    this.toastr.success('Registro ' + mensaje + ' exitosamente!!!', 'Exito', {
      timeOut: 3000,
    });
  }

  toastError(mensaje: string) {
    this.toastr.error('Ha ocurrido un problema, intentelo nuevamente más tarde ' + mensaje, 'ERROR', {
      timeOut: 3000,
    });
  }

}
