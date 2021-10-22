import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ClaimReportService } from '../../services/claim-report.service';
import {IClaimAudit, IClaimReportsModel} from '../../models/claim-reports.model';
import { ClaimService } from '../../services/claim.service';
import {Router} from '@angular/router'
import { Route } from '@angular/compiler/src/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-claim-result',
  templateUrl: './claim-result.component.html',
  styleUrls: ['./claim-result.component.css']
})
export class ClaimResultComponent implements OnInit, AfterViewInit  {
 
  claimResults: IClaimReportsModel[] = [];
  displayedColumns: any[] = ['claimId', 'clientName', 'memberId', 'firstName', 'lastName', 'paidAmount', 'climReceivedOn','paidDate'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _claimReportService: ClaimReportService, private _claimService: ClaimService, private _route: Router){

  }
  ngOnInit(){
  }

  ngAfterViewInit(){    
    this._claimReportService.claimResultsVal.subscribe(
      (data) =>{
        this.claimResults = data;
        
        this.dataSource = new MatTableDataSource(this.claimResults);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }
}
