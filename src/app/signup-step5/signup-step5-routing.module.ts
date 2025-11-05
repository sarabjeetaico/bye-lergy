import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupStep5Page } from './signup-step5.page';

const routes: Routes = [
  {
    path: '',
    component: SignupStep5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupStep5PageRoutingModule {}
