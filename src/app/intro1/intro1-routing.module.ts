import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Intro1Page } from './intro1.page';

const routes: Routes = [
  {
    path: '',
    component: Intro1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Intro1PageRoutingModule {}
