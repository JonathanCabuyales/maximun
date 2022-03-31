import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DepreciacionI } from 'src/app/models/depreciacion/depreciacion';
import { DialogcreditdepreciacionComponent } from '../dialogcreditdepreciacion/dialogcreditdepreciacion.component';

@Component({
  selector: 'app-dialogdepreciacion',
  templateUrl: './dialogdepreciacion.component.html',
  styleUrls: ['./dialogdepreciacion.component.css']
})
export class DialogdepreciacionComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  depreciacion: DepreciacionI;
  displayedColumns: string[] = ['usuario', 'nombres', 'direccion', 'editar'];
  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    
  }

  createDepreciacion(){

  // abro el dialogo para registrar al nuevo empleado....
  const dialogRef = this.dialog.open(DialogcreditdepreciacionComponent, {
    width: '75vw',
    height: '50vh'
  });
  dialogRef.afterClosed().subscribe(res => {

  });

  }
  applyFilter(filtro: string) {
    filtro = filtro.trim(); // Remove whitespace
    filtro = filtro.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filtro;
  }

}
