import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LoteI } from 'src/app/models/inventario/lote.interface';
import { ProsernuevoI } from 'src/app/models/prosernuevo.interface';
import { ProdservService } from 'src/app/services/prodserv.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-pro-ser',
  templateUrl: './dialog-pro-ser.component.html',
  styleUrls: ['./dialog-pro-ser.component.css']
})
export class DialogProSerComponent implements OnInit {

  // variables de combo box
  opcionSeleccionado: string = '0';
  verSeleccion: string = '';
  causas: any;

  // variables para registro de un nuevo PROD/SERV
  nuevoProductoServicio: ProsernuevoI;
  showguardar: boolean = false;

  // variable para capturar los datos del lote
  lote: LoteI;

  // variable para habilitar campos
  showlote: boolean = false;
  disableiva: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogProSerComponent>, @Inject(MAT_DIALOG_DATA)
  public prodserUpdate: ProsernuevoI,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.showlote = false;
    this.disableiva = true;

    this.nuevoProductoServicio = {
      id_prove: '',
      id_proser: 0,
      codigo_proser: '',
      categoria_proser: '0',
      nombre_proser: '',
      descripcion_proser: '',
      precio_proser: 0,
      cantidad_proser: 1,
      cantidadfinal_proser: 0,
      preciosugerido_proser: '',
      lote_proser: '',
      IVA_proser: '1',
      token: ''
    }

    if (this.prodserUpdate == null) {
      
      this.prodserUpdate = {
        id_proser: 0,
        codigo_proser: '',
        categoria_proser: '0',
        nombre_proser: '',
        descripcion_proser: '',
        precio_proser: 0,
        cantidad_proser: 1,
        cantidadfinal_proser: 0,
        preciosugerido_proser: '',
        lote_proser: '',
        IVA_proser: '0',
        token: ''
      }

    } else {
      this.nuevoProductoServicio = this.prodserUpdate;
    }

    this.lote = {
      numero_lote: '',
      fechaelabo_lote: '',
      fechavenci_lote: '',
      cantidad_lote: '',
      precio: ''
    }
  }

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.nuevoProductoServicio.categoria_proser;
    if (this.verSeleccion == '0') {

      this.showlote = false;
      this.disableiva = true;

    } else if (this.verSeleccion == 'PRODUCTO') {

      this.showlote = true;
      this.disableiva = false;

    } else if (this.verSeleccion == 'SERVICIO') {

      this.showlote = false;
      this.disableiva = true;
      this.nuevoProductoServicio.IVA_proser = '0';

    } else if (this.verSeleccion == 'SUMINISTROS') {

      this.showlote = false;
      this.disableiva = true;

    } else if (this.verSeleccion == 'SUJETOCONTROL') {

      this.showlote = false;
      this.disableiva = true;

    }
  }

  guardar() {
    if (this.verSeleccion == "" || this.verSeleccion == '0') {
      Swal.fire({
        icon: 'warning',
        confirmButtonColor: '#1d1d24',
        text: 'Debe seleccionar la categoria'
      });
    } else if (this.nuevoProductoServicio.codigo_proser == "") {
      Swal.fire({
        icon: 'warning',
        confirmButtonColor: '#1d1d24',
        text: 'Debe escanear el codigo de barras del producto a registrar'
      });
    } else if (this.nuevoProductoServicio.nombre_proser == '') {
      Swal.fire({
        icon: 'warning',
        confirmButtonColor: '#1d1d24',
        text: 'Debe ingresar el nombre del Producto/servicio'
      });
    } else if (this.nuevoProductoServicio.descripcion_proser == '') {
      Swal.fire({
        icon: 'warning',
        confirmButtonColor: '#1d1d24',
        text: 'Debe ingresar la descripci??n del Producto/servicio'
      });
    } else if (this.nuevoProductoServicio.precio_proser <= 0) {
      Swal.fire({
        icon: 'warning',
        confirmButtonColor: '#1d1d24',
        text: 'El precio no puede ser menor a 0'
      });
    } else if (this.nuevoProductoServicio.cantidad_proser <= 0) {
      Swal.fire({
        icon: 'warning',
        confirmButtonColor: '#1d1d24',
        text: 'La cantidad debe ser mayor a 0'
      });
    } else {
      this.nuevoProductoServicio.categoria_proser = this.verSeleccion;
      this.nuevoProductoServicio.cantidadfinal_proser = this.nuevoProductoServicio.cantidad_proser;
    
      let hoy = '';

      let dia = new Date().getUTCDate();
      let mes = new Date().getMonth() + 1;
      let anio = new Date().getFullYear();

      if (mes < 10 && dia < 10) {
        hoy = anio + '-0' + mes + '-0' + dia;
      } else if (mes < 10) {
        hoy = anio + '-0' + mes + '-' + dia;
      } else if (dia < 10) {
        hoy = anio + '-' + mes + '-0' + dia;
      } else {
        hoy = anio + '-' + mes + '-' + dia;
      }

      if (this.verSeleccion == 'PRODUCTO') {

        if (this.nuevoProductoServicio.IVA_proser == '1') {

          this.toastWarning("Debe seleccionar el IVA del producto para continuar");

        } else {

          // cantidad del lote
          this.lote.cantidad_lote = this.nuevoProductoServicio.cantidad_proser + '';

          // fecha del lote
          if (this.lote.fechaelabo_lote == '' && this.lote.fechavenci_lote !== '') {

            this.lote.fechaelabo_lote = hoy;

          } else if (this.lote.fechaelabo_lote !== '' && this.lote.fechavenci_lote == '') {

            this.lote.fechavenci_lote = hoy;

          } else {

            this.lote.fechaelabo_lote = hoy;
            this.lote.fechavenci_lote = hoy;

          }

          if (this.lote.numero_lote == null) {

            this.lote.numero_lote = '';

          } else {

            this.lote.precio = this.nuevoProductoServicio.precio_proser + '';

            this.nuevoProductoServicio.lote_proser = JSON.stringify(this.lote);
            this.nuevoProductoServicio.preciosugerido_proser = this.nuevoProductoServicio.precio_proser + '';

            if (this.prodserUpdate == null) {
              delete this.nuevoProductoServicio.id_proser;
              this.dialogRef.close(this.nuevoProductoServicio);
            } else {
              this.dialogRef.close(this.nuevoProductoServicio);
            }

          }

        }


      } else if (this.verSeleccion == 'SERVICIO') {

        this.lote.fechaelabo_lote = hoy;
        this.lote.fechavenci_lote = hoy;
        this.lote.numero_lote = 'SIN LOTE';
        this.lote.cantidad_lote = 'S/C';

        this.lote.precio = this.nuevoProductoServicio.precio_proser + '';

        this.nuevoProductoServicio.lote_proser = JSON.stringify(this.lote);
        this.nuevoProductoServicio.preciosugerido_proser = this.nuevoProductoServicio.precio_proser + '';

        console.log(this.nuevoProductoServicio);

        if (this.prodserUpdate == null) {
          delete this.nuevoProductoServicio.id_proser;
          this.dialogRef.close(this.nuevoProductoServicio);
        } else {
          this.dialogRef.close(this.nuevoProductoServicio);
        }
        
      }else if (this.verSeleccion == 'SUMINISTROS') {

        this.lote.fechaelabo_lote = hoy;
        this.lote.fechavenci_lote = hoy;
        this.lote.numero_lote = 'SIN LOTE';
        this.lote.cantidad_lote = 'S/C';

        this.lote.precio = this.nuevoProductoServicio.precio_proser + '';

        this.nuevoProductoServicio.lote_proser = JSON.stringify(this.lote);
        this.nuevoProductoServicio.preciosugerido_proser = this.nuevoProductoServicio.precio_proser + '';

        console.log(this.nuevoProductoServicio);

        if (this.prodserUpdate == null) {
          delete this.nuevoProductoServicio.id_proser;
          this.dialogRef.close(this.nuevoProductoServicio);
        } else {
          this.dialogRef.close(this.nuevoProductoServicio);
        }
        
      }else if (this.verSeleccion == 'SUJETOCONTROL') {

        this.lote.fechaelabo_lote = hoy;
        this.lote.fechavenci_lote = hoy;
        this.lote.numero_lote = 'SIN LOTE';
        this.lote.cantidad_lote = 'S/C';

        this.lote.precio = this.nuevoProductoServicio.precio_proser + '';

        this.nuevoProductoServicio.lote_proser = JSON.stringify(this.lote);
        this.nuevoProductoServicio.preciosugerido_proser = this.nuevoProductoServicio.precio_proser + '';

        console.log(this.nuevoProductoServicio);

        if (this.prodserUpdate == null) {
          delete this.nuevoProductoServicio.id_proser;
          this.dialogRef.close(this.nuevoProductoServicio);
        } else {
          this.dialogRef.close(this.nuevoProductoServicio);
        }
        
      }

    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  toastSuccess(mensaje: string) {
    this.toastr.success(mensaje, 'Exito', {
      timeOut: 3000,
    });
  }

  toastError(mensaje: string) {
    this.toastr.error(mensaje, 'ERROR', {
      timeOut: 3000,
    });
  }

  toastWarning(mensaje: string) {
    this.toastr.warning(mensaje, 'Advertencia', {
      timeOut: 5000,
    });
  }

}