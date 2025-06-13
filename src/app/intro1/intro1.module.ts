import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Intro1PageRoutingModule } from './intro1-routing.module';

import { Intro1Page } from './intro1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Intro1PageRoutingModule
  ],
  declarations: [Intro1Page]
})
export class Intro1PageModule {}
