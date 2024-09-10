import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './website/pages/core/components/login/login.component';
import { FirmaComponent } from './website/pages/comun/components/firma/firma.component';
import { ResetPasswordComponent } from './website/pages/core/components/reset-password/reset-password.component';
import { TerminosCondicionesComponent } from './website/pages/core/components/terminos-condiciones/terminos-condiciones.component';
import { AuthGuardService } from './website/pages/core/services/auth-guard.service';
import { PlantillaAnexo6ConsentimientoComponent } from './website/pages/scm/components/formulario-scm/plantilla-anexo6-consentimiento/plantilla-anexo6-consentimiento.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent,},
  {
    path: 'app/terminos',
    component: TerminosCondicionesComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'reset-password', component: ResetPasswordComponent,pathMatch: 'full'},
  {
    path: 'app',
    loadChildren: () => import('./website/website.module').then(m => m.WebsiteModule),    
    data: {
      preload: true,
    },
    canActivate: [AuthGuardService]
  },
  { path: 'firma/:id', component: FirmaComponent,},
  { path: 'plantillaAnexo6/:id', component: PlantillaAnexo6ConsentimientoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
