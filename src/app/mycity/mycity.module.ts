import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MycityPageRoutingModule } from './mycity-routing.module';

import { MycityPage } from './mycity.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MycityPageRoutingModule,
    MycityPage // Import the standalone component
  ]
})
export class MycityPageModule {}
