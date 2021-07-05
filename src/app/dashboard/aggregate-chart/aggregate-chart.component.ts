import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aggregate-chart',
  templateUrl: './aggregate-chart.component.html',
  styleUrls: ['./aggregate-chart.component.css']
})
export class AggregateChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
    public chartType: string = 'pie';

    public chartDatasets: Array<any> = [
      { data: [9, 0, 0, 22, 15, 54, 0], label: 'YTD' }
    ];

    public chartLabels: Array<any> = ['Molina', 'Medica', 'Bosch', 'NY', 'OH', 'MSHP', 'MetLife'];

    public chartColors: Array<any> = [
      {
        backgroundColor: ['#FFC870', '#4D5360', '#4D5360', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1' ],
        hoverBackgroundColor: ['#FFC870', '#4D5360', '#4D5360', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1' ],
        borderWidth: 2,
      }
    ];

    public chartOptions: any = {
      responsive: true
    };
    public chartClicked(e: any): void { }
    public chartHovered(e: any): void { }

}  

