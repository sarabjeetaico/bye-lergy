import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
<<<<<<< HEAD
=======
    path: 'signup-step2',
    loadChildren: () => import('./signup-step2/signup-step2.module').then( m => m.SignupStep2PageModule)
  },
  {
    path: 'signup-step3',
    loadChildren: () => import('./signup-step3/signup-step3.module').then( m => m.SignupStep3PageModule)
  },
  {
    path: 'signup-step4',
    loadChildren: () => import('./signup-step4/signup-step4.module').then( m => m.SignupStep4PageModule)
  },
  {
    path: 'signup-step5',
    loadChildren: () => import('./signup-step5/signup-step5.module').then( m => m.SignupStep5PageModule)
  },
  {
>>>>>>> 1216593 (Add updates to dev branch)
    path: '',
    redirectTo: 'intro1',
    pathMatch: 'full'
  },
  {
    path: 'mycity',
    loadChildren: () => import('./mycity/mycity.module').then( m => m.MycityPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'score',
    loadChildren: () => import('./score/score.module').then( m => m.ScorePageModule)
  },
  {
    path: 'diary',
    loadChildren: () => import('./diary/diary.module').then( m => m.DiaryPageModule)
  },
  {
    path: 'intro1',
    loadChildren: () => import('./intro1/intro1.module').then( m => m.Intro1PageModule)
  },
  {
    path: 'intro2',
    loadChildren: () => import('./intro2/intro2.module').then( m => m.Intro2PageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
