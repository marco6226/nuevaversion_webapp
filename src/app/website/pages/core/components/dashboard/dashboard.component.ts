import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { Area, Estructura } from 'src/app/website/pages/empresa/entities/area';
import { ModeloGraficaService } from 'src/app/website/pages/core/services/modelo-grafica.service';
import { FilterQuery } from '../../entities/filter-query';
import { Criteria } from '../../entities/filter';
import { AreaService } from 'src/app/website/pages/empresa/services/area.service';
import { TreeNode } from 'primeng/api';
import { locale_es } from 'src/app/website/pages/rai/entities/reporte-enumeraciones';
import * as moment from 'moment';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [UsuarioService]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {


  desde: Date;
  desdes: String;
  hastas: String;
  arrayIds:any = [];
  hasta: Date;
  options2: any;
  options3: any;
  options4: any;
  options5: any;
  options6: any;
  showData:boolean = false;
  testing :boolean= false;

  data:any;
  data2: any;
  data3: any;
  data4: any;
  data5: any;
  data6: any;
  data7: any;
  data8: any;
  data9: any;
  data10: any;
  data11: any;

  planeadas: any;
  ejecutadas: any;
  inptotal: any;
  planeadasat: any;
  ejecutadasat: any;
  inptotalat: any;
  planeadasauc: any;
  ejecutadasauc: any;
  inptotalauc: any;
  evtLogList?: any[];
  cities1?: any[];
  areaSelected: any;
  cities2?: any[];
  show :boolean= false;
  mostrar = 2000;
  localeES = locale_es;
  value?: Date;
  idEmpresa?:string | null;

  colorScheme = {
    domain: ['#00BCD4', '#37474F']
  };
  colorScheme2 = {
    domain: ['#efb810', '#81D8D0']
  };
  colorScheme3 = {
    domain: ['#747874', '#6CA752']
  };
  colorScheme4 = {
    domain: ['#d9c077', '#09A0B6']
  };
  colorScheme5 = {
    domain: ['#377DC0', '#FF60CA']
  };
  colorScheme6= {
    domain: ['#d9c077', '#7790d9']
  };

  constructor(
      private usuarioService: UsuarioService,
      private indicadorService: ModeloGraficaService,
      private areaService: AreaService,
      private sesionService: SesionService,
      private config: PrimeNGConfig
  ) {

      var date = new Date();
      date.setFullYear(date.getFullYear() - 1);



      this.desde = date;

      this.hasta = new Date;

      this.desdes = moment(this.desde).utc().format('YYYY-MM-DD');
      this.hastas = moment(this.hasta).utc().format('YYYY-MM-DD');

      setTimeout(() => {
          this.testing = true;
      }, 3000);
    
      this.data7 = {
          labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
          datasets: [
              {
                  label: 'Tareas planeadas',
                  backgroundColor: '#d9c077',
                  borderColor: '#1E88E5',
                  data: []
              },
              {
                  label: 'Tareas gestionadas',
                  backgroundColor: '#7790d9',
                  borderColor: '#7CB342',
                  data: []
              }
          ],
          options: {
              scales: {
                  yAxes: [{
                      stacked: false,
                      ticks: {
                          beginAtZero: true
                      }
                  }],
                  xAxes: [{
                      stacked: false,
                  }]
              }
          }
      }
      this.data11 = {
          labels: ['CENTRAL', 'CARIBE', 'NOROCCIDENTAL', 'EJE CAFETERO', 'CENTRO SUR', 'NORORIENTAL', 'DEL PACIFICO', 'ORINOQUIA'],
          datasets: [
              {
                  label: 'Tareas planeadas',
                  backgroundColor: '#d9c077',
                  borderColor: '#1E88E5',
                  data: []
              },
              {
                  label: 'Tareas gestionadas',
                  backgroundColor: '#7790d9',
                  borderColor: '#7CB342',
                  data: []
              }
          ],
          options: {
              scales: {
                  yAxes: [{
                      stacked: false,
                      ticks: {
                          beginAtZero: true
                      }
                  }],
                  xAxes: [{
                      stacked: false,
                  }]
              }
          }
      }
      // this.data7 = 42 + 4 ;
      this.data8 = 42 + 4;
      this.data9 = 41 + 4;

      this.data10 = "textosss";

  }
  ngOnDestroy(): void {
      localStorage.removeItem('url');
  }
  ngAfterViewInit(): void {



  }
  async ngOnInit() {
    this.config.setTranslation(this.localeES);

      setTimeout(() => {
          this.idEmpresa = this.sesionService.getEmpresa()!.id;
          this.testing = false;
          this.show = true
          this.showData = true;            
          this.loadAreas();
      }, 2000); 
      //let arrtest = [1, 2, 4, 5, 4];


      // this.usuarioService.consultarHistoriaLogin().then(
      //     resp => this.evtLogList = resp['data']
      // );

      
  }

  actualizarArea(areas:any) {
      this.arrayIds = [];

      for (const area of areas) {
          this.arrayIds.push(area.id)
      }
    //  this.testing = false;
      this.updateCharts();
      this.updateCharts2();
      this.updateCharts3();
      this.updateCharts4();
      this.updateCharts5();
      this.updateCharts6();
      this.cumplimientoinp();
      this.cumplimientoAT();
      this.cumplimientoauc();
      setTimeout(() => {
          this.testing = true;
      }, 1000);

      

  }

  async updateCharts() {
      this.showData = false;

      let data: any = await this.indicadorService.findInpN(this.arrayIds, this.desdes, this.hastas)
      let date = new Date();

      // if (data.length < 0) return false;
      this.data=[]
      let datauno:any=[]
      for (const iterator of data) {

        datauno=
          {
            "name": iterator[2],
            "series": [
              {
                "name": 'Inspecciones programadas',
                "value": iterator[1]
              },
              {
                "name": 'Inspecciones realizadas',
                "value": iterator[0]
              }
            ]
          }
          this.data.push(datauno)
      }

      this.showData = true;
  }
  async cumplimientoinp() {

      let data7: any = await this.indicadorService.findInptotal(this.arrayIds, this.desdes, this.hastas)


      if (data7[0][0] != null) {
          this.ejecutadas = data7[0][0];
          this.planeadas = data7[0][1];
          this.inptotal = (this.ejecutadas / this.planeadas) * 100;
          

      } else { 
          this.data7 == null;
          this.inptotal = 0;
          
      }

  }
  async cumplimientoAT() {

      let data8: any = await this.indicadorService.findAttotal(this.arrayIds, this.desdes, this.hastas)


      if (data8[0][0] != null) {
          this.ejecutadasat = data8[0][0];
          this.planeadasat = data8[0][1];
          this.inptotalat = (this.ejecutadasat / this.planeadasat) * 100;


      }
      else
          this.data8 == null;

  }
  async cumplimientoauc() {

      let data9: any = await this.indicadorService.findAuctotal(this.arrayIds, this.desdes, this.hastas)


      if (data9[0][0] != null) {
          this.ejecutadasauc = data9[0][0];
          this.planeadasauc = data9[0][1];
          this.inptotalauc = (this.ejecutadasauc / this.planeadasauc) * 100;



      }
      else
          this.data9 == null;
  }
  async updateCharts2() {
      this.showData = false;


      let data2: any = await this.indicadorService.findInpCobertura(this.arrayIds, this.desdes, this.hastas)


      // if (data2.length < 0) return false;

      
      this.data2=[
      
          {
            "name": 'Sedes programadas',
            "value": data2[0]
          },
          {
            "name": 'Sedes Inspeccionadas',
            "value": data2[1]
          }]

      this.showData = true;

  }
  async updateCharts3() {
      this.showData = false;

      let data3: any = await this.indicadorService.findInpEfectividad(this.arrayIds, this.desdes, this.hastas)

      this.data3=[]
      let datauno:any=[]
      // if (data3.length < 0) return false;
      for (const iterator of data3) {

        datauno=
        {
          "name": iterator[2],
          "series": [
            {
              "name": 'Hallazgos encontrados',
              "value": iterator[1]
            },
            {
              "name": 'Hallazgos gestionados',
              "value": iterator[0]
            }
          ]
        }
        this.data3.push(datauno)
         

        this.showData = true;
      }
  }
  async updateCharts4() {
      this.showData = false;

      let data4: any = await this.indicadorService.findInpCoberturaAt(this.arrayIds, this.desdes, this.hastas)

      this.data4=[]
      let datauno:any=[]
      // if (data4.length < 0) return false;
      for (const iterator of data4) {
        datauno=
        {
          "name": iterator[2],
          "series": [
            {
              "name": 'AT ocurridos',
              "value": iterator[1]
            },
            {
              "name": 'AT investigados',
              "value": iterator[0]
            }
          ]
        }
        this.data4.push(datauno)

        this.showData = true;
      }
      
  }
  async updateCharts5() {
      this.showData = false;

      let data5: any = await this.indicadorService.findInpEficaciaAuc(this.arrayIds, this.desdes, this.hastas)

      this.data5=[]
      let datauno:any=[]

      // if (data5.length < 0) return false;
      for (const iterator of data5) {
          
        datauno=
        {
          "name": iterator[2],
          "series": [
            {
              "name": 'Observaciones reportadas',
              "value": iterator[1]
            },
            {
              "name": 'Observaciones aceptadas',
              "value": iterator[0]
            }
          ]
        }
        this.data5.push(datauno)

        this.showData = true;
      }
  }

  async updateCharts6() {
      this.showData = false;

      let data6: any = await this.indicadorService.findInpEfectividadAt(this.arrayIds, this.desdes, this.hastas)
      this.data6=[]
      let datauno:any=[]
      // if (data6.length < 0) return false;
      for (const iterator of data6) {
        datauno=
        {
          "name": iterator[2],
          "series": [
            {
              "name": 'Tareas planeadas',
              "value": iterator[1]
            },
            {
              "name": 'Tareas gestionadas',
              "value": iterator[0]
            }
          ]
        }
        this.data6.push(datauno)

        this.showData = true;
      }
  }


  selecFromDate(date: Date) {
      this.desdes = date.toISOString().slice(0, 10)
      date.toISOString().slice(.1)
      
  }

  selectToDate(date: Date) {
      this.hastas = date.toISOString().slice(0, 10);
      
      this.testing = false;
      this.updateCharts();
      this.updateCharts2();
      this.updateCharts3();
      this.updateCharts4();
      this.updateCharts5();
      this.updateCharts6();
      this.cumplimientoinp();
      this.cumplimientoAT();
      this.cumplimientoauc();
      setTimeout(() => {
          this.testing = true;
      }, 1000);


  }

  loadAreas() {
      let allComplete = {
          organi: false,
          fisica: false
      };

      // Consulta las areas de estructura organizacional
      let filterAreaQuery = new FilterQuery();
      filterAreaQuery.filterList = [
          { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
          { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.ORGANIZACIONAL.toString(), value2: null }
      ];
      this.areaService.findByFilter(filterAreaQuery)
          .then(data => {
              let root: TreeNode = {
                  label: '',
                  selectable: false,
                  expanded: true,
              };
              let areasArry: any = data;


              for (const nivel1 of areasArry.data) {
                  this.arrayIds.push(nivel1)

                  for (const nivel2 of nivel1.areaList) {
                      this.arrayIds.push(nivel2)


                  }

              }


              let areasArray = [];

              for (let index = 0; index < 35; index++) {
                  let i = Math.floor(Math.random() * this.arrayIds.length)
                  areasArray.push(this.arrayIds[i]);

              }

              this.actualizarArea(areasArray)

              allComplete.organi = true;
              if (allComplete.organi == true && allComplete.fisica == true) {

              }
          })
          .catch(err => {

          });

      // Consulta las areas de estructura fisica
      let filterSedesQuery = new FilterQuery();
      filterSedesQuery.filterList = [
          { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
          { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.FISICA.toString(), value2: null }
      ];
      this.areaService.findByFilter(filterSedesQuery)
          .then(data => {
              let root: TreeNode = {
                  label: '',
                  selectable: false,
                  expanded: true,
              };
              allComplete.fisica = true;
              if (allComplete.organi == true && allComplete.fisica == true) {

              }
          })
          .catch(err => {

          });
  }

}
