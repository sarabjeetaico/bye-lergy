import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupStep3PageRoutingModule } from './signup-step3-routing.module';

import { SignupStep3Page } from './signup-step3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupStep3PageRoutingModule
  ],
  declarations: [SignupStep3Page]
})
export class SignupStep3PageModule {}
