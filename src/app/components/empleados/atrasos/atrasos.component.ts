import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { AtrasosService } from 'src/app/services/atrasos/atrasos.service';
import { DialogatrasosjustificarComponent } from '../dialogatrasosjustificar/dialogatrasosjustificar.component';

@Component({
  selector: 'app-atrasos',
  templateUrl: './atrasos.component.html',
  styleUrls: ['./atrasos.component.css']
})
export class AtrasosComponent implements OnInit {

  // <!-- usuario, nombres, ciruc, direccion, email, telefono -->
  displayedColumns: string[] = ['nombres', 'ciruc', 'direccion', 'email', 'justificado', 'motivojusti','editar'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  token: string = '';
  listaAtrasos: any[];


  constructor(private _cookie: CookieService,
    private _atrasos: AtrasosService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.token = this._cookie.get("token");
    this.loadAtrasos();
  }

  loadAtrasos(){
    this._atrasos.getAtrasos(this.token).subscribe(res=>{
      if(res.data){
        this.listaAtrasos = res.data;
        this.dataSource = new MatTableDataSource(this.listaAtrasos);
        this.dataSource.paginator = this.paginator;
      }else{
        this.listaAtrasos = [];
        this.dataSource = new MatTableDataSource(this.listaAtrasos);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  justificar(atrasoupdate){

    const dialogRef = this.dialog.open(DialogatrasosjustificarComponent, {
      width: '450px',
      data: atrasoupdate
    });

    dialogRef.afterClosed().subscribe(res => {

      if(res){
        this.loadAtrasos();
      }else{
        this.loadAtrasos();
      }

    });

  }

  // funcion para filtro de busqueda
  applyFilter(filtro: string) {
    filtro = filtro.trim(); // Remove whitespace
    filtro = filtro.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filtro;
  }

}
