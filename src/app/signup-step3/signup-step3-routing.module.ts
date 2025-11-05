import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupStep3Page } from './signup-step3.page';

const routes: Routes = [
  {
    path: '',
    component: SignupStep3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupStep3PageRoutingModule {}
