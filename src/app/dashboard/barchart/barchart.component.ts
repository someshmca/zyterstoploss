
import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'bar-chart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})

export class BarChartComponent {
  public chartType: string = 'bar';

  public chartDatasets: Array<any> = [
    { data: [65, 35, 50, 81, 56, 55], label: 'Monthly Paid Claims' }
  ];

  public chartLabels: Array<any> = 
  [
    'Jun 2020', 
    'Jul 2020', 
    'Aug 2020', 
    'Sep 2020', 
    'Oct 2020', 
    'Nov 2020'
  ];

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#009900', '#3973ac', '#00cc7a', '#F7464A', '#ff6600', '#800040'],
      borderWidth: 1,
      barPercentage: 0.8
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

}
