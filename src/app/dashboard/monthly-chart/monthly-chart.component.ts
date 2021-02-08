import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';


@Component({
  selector: 'monthly-chart',
  templateUrl: './monthly-chart.component.html',
  styleUrls: ['./monthly-chart.component.css']
})
export class MonthlyChartComponent  {
  public chartType: string = 'bar';

  public chartDatasets: Array<any> = [
    { data: [40, 60, 50, 79, 58, 79]}
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
      backgroundColor: [
        '#009900', '#3973ac', '#00cc7a', '#F7464A', '#ff6600', '#ff0000'
      ],
      borderWidth: 4,
      barPercentage: 0.3,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

}
