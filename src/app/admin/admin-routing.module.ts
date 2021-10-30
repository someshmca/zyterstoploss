import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClaimSearchComponent} from './claims/claim-search/claim-search.component';
import {ClaimResultComponent} from './claims/claim-result/claim-result.component';
import {ClaimComponent} from './claims/claim/claim.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { ProgramsComponent } from './programs/programs.component';
import { ContractsComponent } from './contracts/contracts.component';
import { RoleComponent } from './role/role.component';
import { RulesComponent } from './rules/rules.component';
import { ClientComponent } from './client/client.component';
import { AttributesComponent } from './attributes/attributes.component';
import { UsersSecurityComponent } from './users-security/users-security.component';
import { BatchSettingsComponent } from './batch-settings/batch-settings.component';
import { AuthGuard } from '../shared/helpers/auth.guard'
import { MemberComponent } from './member/member.component';
import { HealthPlanComponent } from './health-plan/health-plan.component';
import { ProductComponent } from './product/product.component';
import { SSLReportComponent } from '../reports/ssl-report/ssl-report.component';
import { ASLReportComponent } from '../reports/asl-report/asl-report.component';
import { MAXLiabilityReportComponent } from '../reports/max-liability-report/max-liability-report.component';
import { ExcelUploadComponent } from '../admin/excel-upload/excel-uplaod.component';
import { LaseringComponent } from './lasering/lasering.component';
import {LaseringSearchComponent} from './lasering-search/lasering-search.component';
import { ReimbursementComponent } from './reimbursement/reimbursement.component';
const routes: Routes = [
  {path: 'claim-search', component: ClaimSearchComponent, canActivate: [AuthGuard] },
  {path: 'claim-result', component: ClaimResultComponent, canActivate: [AuthGuard] },
  {path: 'claim', component: ClaimComponent, canActivate: [AuthGuard] },
  {path: 'attributes', component: AttributesComponent, canActivate: [AuthGuard] },
  {path: 'benefits', component: BenefitsComponent, canActivate: [AuthGuard] },
  {path: 'programs', component: ProgramsComponent, canActivate: [AuthGuard] },
  {path: 'contracts', component: ContractsComponent, canActivate: [AuthGuard] },
  {path: 'clients', component: ClientComponent, canActivate: [AuthGuard] },
  {path: 'users-security', component: UsersSecurityComponent, canActivate: [AuthGuard] },
  {path: 'batch-settings', component: BatchSettingsComponent, canActivate: [AuthGuard] },
  {path: 'roles', component: RoleComponent, canActivate: [AuthGuard] },
  {path: 'rules', component: RulesComponent, canActivate: [AuthGuard] },
  {path: 'member', component: MemberComponent, canActivate: [AuthGuard]},
  {path: 'lasering-search',component:LaseringSearchComponent},
  {path: 'lasering', component: LaseringComponent},
  {path: 'health-plan', component: HealthPlanComponent, canActivate: [AuthGuard]},
  {path: 'product', component: ProductComponent, canActivate: [AuthGuard]},
  {path: 'excel-upload', component: ExcelUploadComponent, canActivate: [AuthGuard]},
  {path: 'specific-stoploss-report', component: SSLReportComponent},
  {path: 'aggregate-stoploss-report', component: ASLReportComponent, canActivate: [AuthGuard]},
  {path: 'max-liability-report', component: MAXLiabilityReportComponent, canActivate: [AuthGuard]},
  {path: 'reimbursement', component: ReimbursementComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
