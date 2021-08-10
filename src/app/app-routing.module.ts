import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './shared/login/login.component';
import { AuthGuard } from './shared/helpers/auth.guard'
import { AuthenticateUserComponent } from './shared/authenticate-user/authenticate-user.component';

const routes: Routes = [  
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'authenticate-user', component: AuthenticateUserComponent},
  { path: '',   redirectTo: '/login', pathMatch: 'full' }, 
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
