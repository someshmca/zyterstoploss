import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { FocusDirective } from './focus.directive';
import { AuthenticateUserComponent } from './authenticate-user/authenticate-user.component';

@NgModule({
  declarations: [FocusDirective, AuthenticateUserComponent],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
