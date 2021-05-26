import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';


import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { AdminRoutingModule } from './admin-routing.module';
import { ClaimSearchComponent } from './claims/claim-search/claim-search.component';
import { ClaimResultComponent } from './claims/claim-result/claim-result.component';
import { ClaimComponent } from './claims/claim/claim.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { ProgramsComponent } from './programs/programs.component';
import { ContractsComponent } from './contracts/contracts.component';
import { RoleComponent } from './role/role.component';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { ClaimReportService } from './services/claim-report.service';
import { BenefitService} from './services/benefit.service';
import { RulesComponent } from './rules/rules.component';
import { ClientComponent } from './client/client.component';
import { AttributesComponent } from './attributes/attributes.component';
import {  UsersSecurityComponent} from './users-security/users-security.component';
import { BatchSettingsComponent } from './batch-settings/batch-settings.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatStepperModule} from '@angular/material/stepper';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import { MemberComponent } from './member/member.component';
import { AlertComponent } from './alert/alert.component';
import { HealthPlanComponent } from './health-plan/health-plan.component';
import { ProductComponent } from './product/product.component';
import { MatSelectModule } from '@angular/material/select';
import { ExcelUploadComponent } from '../admin/excel-upload/excel-uplaod.component';
import { Nl2brPipe } from '../nl2br.pipe';

@NgModule({
  declarations: [BatchSettingsComponent, ClaimSearchComponent, ClaimResultComponent, ClaimComponent, BenefitsComponent, ProgramsComponent, ContractsComponent, RoleComponent, RulesComponent, ClientComponent, AttributesComponent, UsersSecurityComponent, MemberComponent, AlertComponent, HealthPlanComponent, ProductComponent, ExcelUploadComponent, Nl2brPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatStepperModule,
    MatIconModule,
    AdminRoutingModule
  ],
  providers: [
    ClaimReportService,
    BenefitService
  ]
})
export class AdminModule { }
