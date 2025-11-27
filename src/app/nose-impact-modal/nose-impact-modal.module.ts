import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NoseImpactModalPage } from './nose-impact-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [NoseImpactModalPage],
  exports: [NoseImpactModalPage]
})
export class NoseImpactModalPageModule {}
