import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/core/components/dashboard/dashboard.component';

const routes: Routes = [
  {
   path:'',
   component: LayoutComponent,
   children:[
    { 
      path: '', 
      redirectTo: '/app', 
      pathMatch: 'full'
    },
      { 
        path: 'app', 
        component: DashboardComponent,
      },
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
