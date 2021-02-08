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
import { ReactiveFormsModule } from '@angular/forms';
import { ClaimReportService } from './services/claim-report.service';
import { BenefitService} from './services/benefit.service';
import { RulesComponent } from './rules/rules.component';
import { ClientComponent } from './client/client.component';
import { AttributesComponent } from './attributes/attributes.component';
import {  UsersSecurityComponent} from './users-security/users-security.component';
import { BatchSettingsComponent } from './batch-settings/batch-settings.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MemberComponent } from './member/member.component';
import { AlertComponent } from './alert/alert.component';
@NgModule({
  declarations: [BatchSettingsComponent, ClaimSearchComponent, ClaimResultComponent, ClaimComponent, BenefitsComponent, ProgramsComponent, ContractsComponent, RoleComponent, RulesComponent, ClientComponent, AttributesComponent, UsersSecurityComponent, MemberComponent, AlertComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    ClaimReportService,
    BenefitService
  ]
})
export class AdminModule { }
