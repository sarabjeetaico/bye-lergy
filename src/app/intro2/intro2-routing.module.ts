import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Intro2Page } from './intro2.page';

const routes: Routes = [
  {
    path: '',
    component: Intro2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Intro2PageRoutingModule {}
