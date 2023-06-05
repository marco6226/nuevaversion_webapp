import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import {  Chart, registerables } from 'chart.js';
// import Chart from 'chart.js/auto';

Chart.register(...registerables);

@Component({
  selector: 'sg-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {

  name: String='';
  @Input() tipo: string='bar';

  @Input("Name")
  set InName(name: any) {
    this.name = name
  }

  // @Input("tipo")
  // set InTipo(tipo: any) {
  //   this.tipo = tipo
  // }



  constructor() { }
  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnInit(): void {
  }
  myChart: any;
  renderChart(){
    this.myChart = new Chart(`myChart${this.name}`, {
      type: `bar`,
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    this.myChart.config.type = this.tipo
    this.myChart.update();
  }


}
