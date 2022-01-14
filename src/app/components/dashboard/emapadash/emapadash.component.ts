import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { NovedadService } from 'src/app/services/novedad.service';

@Component({
  selector: 'app-emapadash',
  templateUrl: './emapadash.component.html',
  styleUrls: ['./emapadash.component.css']
})
export class EmapadashComponent implements OnInit {

  arregloNombres: any[];
  grupo: any[];
  totalgrupo: any[];

  // variables para la fecha
  dia: any;
  mes: any;
  anio: any;

  public chartOption: {};

  // variables para el grafico de cortes
  public cortesOption: {};
  totalgrupocortes: any[];


  // variables para el grafico de notificaciones 
  public notificacionesOption: {};
  totalNotificaciones: any[];

  // variable para el grafico en pastel
  option = {
    title: {
      text: 'Consumo de Agua',
      left: 'center',
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Total Clientes',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Enero' },
          { value: 735, name: 'Febrero' },
          { value: 580, name: 'Marzo' },
          { value: 484, name: 'Abril' },
          { value: 300, name: 'Mayo' }
        ]
      }
    ]
  };
  token: string;


  constructor(private _novedad: NovedadService,
    private _notificacion: NotificacionService,
    private _cookie: CookieService) { }

  ngOnInit(): void {
    
    this.token = this._cookie.get('token');

    this.arregloNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.grupo = ['Capurro', 'Ballesilla', 'Macias', 'Zambrano', '0'];
    this.totalgrupocortes = ['Capurro', 'Ballesilla', 'Macias', 'Zambrano', '0'];
    this.reconexiones();
    this.cortes();
    this.notificaciones();
    //   let dom: any = document.getElementById('main');
    //   let chart: any = echarts.init(dom);
    //   let option: any = {
    //     title: {
    //       texto: 'Ejemplo de introducción de ECharts'
    //     },
    //     tooltip: {},
    //     legend: {
    //       datos: ['Ventas']
    //     },
    //     xAxis: {
    //       datos: [ 'camisa', "suéter de lana", "camisa de gasa", "pantalones", "tacones altos", "calcetines"]
    //     },
    //     yAxis: {},
    //     series: [{
    //       nombre: 'Ventas',
    //       type: 'bar',
    //       data: [5, 20, 36, 19, 10, 20]
    //     }]
    //   }
    //   chart.setOption(option);
  }

  notificaciones() {
    this.totalNotificaciones = [];

    this._notificacion.getAll(this.token).subscribe(async res => {
      let totalnotifi = res.data.length;
      let capurro = 0;
      let ballesilla = 0;
      let macias = 0;
      let zambrano = 0;
      let grupocero = 0;

      for (let i = 0; i < res.data.length; i++) {

        if (res.data[i].grupoCorte == 'Capurro - Tejada') {
          capurro = capurro + 1;
        }
        if (res.data[i].grupoCorte == 'Ballesilla - Roman') {
          ballesilla = ballesilla + 1;
        }
        if (res.data[i].grupoCorte == 'Macias - Aveiga') {
          macias = macias + 1;
        }

        if (res.data[i].grupoCorte == 'Zambrano - Segura') {
          zambrano = zambrano + 1;
        }
        if (res.data[i].grupoCorte == '0') {
          grupocero = grupocero + 1;
        }
      }

      this.totalNotificaciones[0] = capurro;
      this.totalNotificaciones[1] = ballesilla;
      this.totalNotificaciones[2] = macias;
      this.totalNotificaciones[3] = zambrano;
      this.totalNotificaciones[4] = grupocero;



      this.dia = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
      this.mes = new Date().toLocaleDateString('es', { month: 'long' });
      this.anio = new Date().getFullYear();

      this.notificacionesOption = {
        title: {
          text: 'Notificaciones ' + '1' + ' de ' + this.mes + ' al ' + this.dia + ' de ' + this.mes + ' del ' + this.anio,
          subtext: 'Total notificaciones: ' + totalnotifi,
          left: 'center',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.grupo
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.1,
          formatter: function (params) {
            return `<b>${params['name']}</b> : ${params['value']}`;
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [{
          data: this.totalgrupocortes,
          type: 'line',
          smooth: true
          // areaStyle: {}
        }]
      };
    });

  }

  cortes() {

    this.totalgrupocortes = [];
    this._novedad.getCortes(this.token).subscribe(async res => {
      let totalcortes = res.data.length;
      let capurro = 0;
      let ballesilla = 0;
      let macias = 0;
      let zambrano = 0;
      let grupocero = 0;

      for (let i = 0; i < res.data.length; i++) {

        if (res.data[i].grupoCorte == 'Capurro - Tejada') {
          capurro = capurro + 1;
        }
        if (res.data[i].grupoCorte == 'Ballesilla - Roman') {
          ballesilla = ballesilla + 1;
        }
        if (res[i].data.grupoCorte == 'Macias - Aveiga') {
          macias = macias + 1;
        }

        if (res[i].data.grupoCorte == 'Zambrano - Segura') {
          zambrano = zambrano + 1;
        }
        if (res[i].data.grupoCorte == '0') {
          grupocero = grupocero + 1;
        }
      }

      this.totalgrupocortes[0] = capurro;
      this.totalgrupocortes[1] = ballesilla;
      this.totalgrupocortes[2] = macias;
      this.totalgrupocortes[3] = zambrano;
      this.totalgrupocortes[4] = grupocero;



      this.dia = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
      this.mes = new Date().toLocaleDateString('es', { month: 'long' });
      this.anio = new Date().getFullYear();

      this.cortesOption = {
        title: {
          text: 'Cortes del ' + '1' + ' de ' + this.mes + ' al ' + this.dia + ' de ' + this.mes + ' del ' + this.anio,
          subtext: 'Total cortes: ' + totalcortes,
          left: 'center',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.grupo
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.1,
          formatter: function (params) {
            return `<b>${params['name']}</b> : ${params['value']}`;
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [{
          data: this.totalgrupocortes,
          type: 'line',
          smooth: true
          // areaStyle: {}
        }]
      };

    });

  }

  reconexiones() {
    this.totalgrupo = [];
    this._novedad.getReconexiones(this.token).subscribe(async res => {
      let totalreconexiones = res.data.length;
      let capurro = 0;
      let ballesilla = 0;
      let macias = 0;
      let zambrano = 0;
      let grupocero = 0;

      for (let i = 0; i < res.length; i++) {

        if (res.data[i].grupoCorte == 'Capurro - Tejada') {
          capurro = capurro + 1;
        }
        if (res.data[i].grupoCorte == 'Ballesilla - Roman') {
          ballesilla = ballesilla + 1;
        }
        if (res.data[i].grupoCorte == 'Macias - Aveiga') {
          macias = macias + 1;
        }

        if (res.data[i].grupoCorte == 'Zambrano - Segura') {
          zambrano = zambrano + 1;
        }
        if (res.data[i].grupoCorte == '0') {
          grupocero = grupocero + 1;
        }
      }

      this.totalgrupo[0] = capurro;
      this.totalgrupo[1] = ballesilla;
      this.totalgrupo[2] = macias;
      this.totalgrupo[3] = zambrano;
      this.totalgrupo[4] = grupocero;

      this.dia = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      this.mes = new Date().toLocaleDateString('es', { month: 'long' });
      this.anio = new Date().getFullYear();

      this.chartOption = {
        title: {
          text: 'Reconexiones del ' + '1' + ' de ' + this.mes + ' al ' + this.dia + ' de ' + this.mes + ' del ' + this.anio,
          subtext: 'Total reconexiones: ' + totalreconexiones,
          left: 'center',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.grupo
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.1,
          formatter: function (params) {
            return `<b>${params['name']}</b> : ${params['value']}`;
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [{
          data: this.totalgrupo,
          type: 'line'
          // areaStyle: {}
        }]
      };

    });
  }

}
