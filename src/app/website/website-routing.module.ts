import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { PerfilComponent } from './pages/admin/components/perfil/perfil.component';
import { PermisosComponent } from './pages/admin/components/permisos/permisos.component';
import { UsuarioComponent } from './pages/admin/components/usuario/usuario.component';
import { DashboardComponent } from './pages/core/components/dashboard/dashboard.component';

const routes: Routes = [
  {
   path:'',
   component: LayoutComponent,
   children:[
    { 
      path: '', 
      redirectTo: '/home', 
      pathMatch: 'full'
    },
      { 
        path: 'home', 
        component: DashboardComponent,
      },
      { 
        path: 'admin', 
        children:[
          {
            path: 'perfil', 
            component: PerfilComponent
          },
          {
            path: 'permisos', 
            component: PermisosComponent
          },
          {
            path: 'usuario', 
            component: UsuarioComponent
          }
        ]
      },
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
