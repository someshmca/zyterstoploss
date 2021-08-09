import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './shared/login/login.component';
import { AuthenticateUserComponent } from './shared/authenticate-user/authenticate-user.component';
import { AuthGuard } from './shared/helpers/auth.guard'

const routes: Routes = [  
  {path: 'login', component: LoginComponent},
  {path: 'authenticate-user', component: AuthenticateUserComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: '',   redirectTo: '/authenticate-user', pathMatch: 'full' }, 
  { path: '**', component: AuthenticateUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
