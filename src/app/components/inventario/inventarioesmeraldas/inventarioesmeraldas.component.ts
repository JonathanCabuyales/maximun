import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InventarioEI } from 'src/app/models/esmeraldas/inventario.interface';
import { BdemapaService } from 'src/app/services/bdemapa.service';
import { InventarioesmeService } from 'src/app/services/inventarioesme.service';

@Component({
  selector: 'app-inventarioesmeraldas',
  templateUrl: './inventarioesmeraldas.component.html',
  styleUrls: ['./inventarioesmeraldas.component.css']
})
export class InventarioesmeraldasComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'categoria', 'descripcion', 'cantidad', 'precio', 'editar', 'asignar'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  listaInventario: InventarioEI[];

  constructor(private _inventario: InventarioesmeService,
    private _bdemapa: BdemapaService) { }

  ngOnInit(): void {
    this._inventario.getAll().subscribe(res=>{      
      this.listaInventario = res;
      this.dataSource = new MatTableDataSource(this.listaInventario);
      this.dataSource.paginator = this.paginator;
    });
  }

  excel(){
    let dia = new Date().getUTCDate();
    let mes = new Date().getMonth() +1;
    let anio = new Date().getFullYear();

    let hora = new Date().getHours();
    let min = new Date().getMinutes();
    let seg = new Date().getSeconds();
        
    this._bdemapa.exportToExcel(this.listaInventario, "Inventario__" + 
    anio + '_' + mes + '_' + dia + '_' + hora + '_' + min + '_' + seg);
  }

  // funcion para filtro de busqueda
  applyFilter(filtro: string) {
    filtro = filtro.trim(); // Remove whitespace
    filtro = filtro.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filtro;
  }

}
