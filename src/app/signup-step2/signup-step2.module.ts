import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupStep2PageRoutingModule } from './signup-step2-routing.module';

import { SignupStep2Page, ImpactSelectionModal } from './signup-step2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupStep2PageRoutingModule
  ],
  declarations: [SignupStep2Page, ImpactSelectionModal]
})
export class SignupStep2PageModule { }
