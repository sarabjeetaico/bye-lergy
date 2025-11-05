import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupStep5PageRoutingModule } from './signup-step5-routing.module';

import { SignupStep5Page } from './signup-step5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupStep5PageRoutingModule
  ],
  declarations: [SignupStep5Page]
})
export class SignupStep5PageModule {}
