import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MycityPage } from './mycity.page';

const routes: Routes = [
  {
    path: '',
    component: MycityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MycityPageRoutingModule {}
