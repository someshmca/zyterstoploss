import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router';

import {WinAuthInterceptor} from '../app/shared/helpers/winauth-interceptor';
import { AppRoutingModule } from './app-routing.module';
import {AdminModule} from './admin/admin.module';
import {SharedModule} from './shared/shared.module';
import { AppComponent } from './app.component';
import { MainSideNavComponent } from './main-side-nav/main-side-nav.component';
import { LoginComponent } from './shared/login/login.component';
import { LoginService } from './shared/services/login.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BarChartComponent } from './dashboard/barchart/barchart.component';
import { AggregateChartComponent } from './dashboard/aggregate-chart/aggregate-chart.component';
import { MonthlyChartComponent } from './dashboard/monthly-chart/monthly-chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';
import { SSLReportComponent } from './reports/ssl-report/ssl-report.component';
import { ASLReportComponent } from './reports/asl-report/asl-report.component';
import { MAXLiabilityReportComponent } from './reports/max-liability-report/max-liability-report.component';
import { MatProgressBarModule } from '@angular/material/progress-bar'; //added by Venkatesh Enigonda

@NgModule({
  declarations: [
    AppComponent,
    MainSideNavComponent,
    LoginComponent,
    DashboardComponent,
    BarChartComponent,
    AggregateChartComponent,
    MonthlyChartComponent,
    SSLReportComponent,
    ASLReportComponent,
    MAXLiabilityReportComponent
  ],
  imports: [
    BrowserModule,  
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MDBBootstrapModule,
    SharedModule,
    AdminModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressBarModule
  ],
  providers: [
   // {provide: HTTP_INTERCEPTORS,useClass: WinAuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
