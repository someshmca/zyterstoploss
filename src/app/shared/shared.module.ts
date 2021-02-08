import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { FocusDirective } from './focus.directive';


@NgModule({
  declarations: [FocusDirective],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
