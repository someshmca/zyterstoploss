import { Component, OnInit } from '@angular/core';
import {ReportsService} from '../../admin/services/reports.service';
import {Paths} from '../../admin/admin-paths';
@Component({
  selector: 'app-ssl-report',
  templateUrl: './ssl-report.component.html',
  styleUrls: ['./ssl-report.component.css']
})
export class SSLReportComponent implements OnInit {
  sslReport: any;

  sslReportStaticURL: any;

  constructor(private _reportService: ReportsService) { }

  ngOnInit() {
    this.sslReportStaticURL = Paths.sslReportURL;
   //this.getSSLReport();
  }
  getSSLReport(){
    debugger;
    this._reportService.getSSLReport().subscribe(
      (data)=>{
        this.sslReport = data;
        debugger;
      }
    )
  }


}
