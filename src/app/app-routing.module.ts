import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './website/pages/core/components/login/login.component';
import { FirmaComponent } from './website/pages/comun/components/firma/firma.component';
import { ResetPasswordComponent } from './website/pages/core/components/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent,},
  { path: 'reset-password', component: ResetPasswordComponent,pathMatch: 'full'},
  {
    path: 'app',
    loadChildren: () => import('./website/website.module').then(m => m.WebsiteModule),    
    data: {
      preload: true,
    },
    
  },
  { path: 'firma/:id', component: FirmaComponent,}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
