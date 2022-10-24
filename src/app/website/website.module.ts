import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { MenuComponent } from './components/menu/menu.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './pages/core/components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './pages/core/components/dashboard/dashboard.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { WhatsappComponent } from './components/whatsapp/whatsapp.component';
import { LayoutMenuComponent } from './components/layout-menu/layout-menu.component';


@NgModule({
  declarations: [
    LayoutComponent,
    MenuComponent,
    NavComponent,
    LoginComponent,
    DashboardComponent,
    NavBarComponent,
    WhatsappComponent,
    LayoutMenuComponent
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    SharedModule,
  ]
})
export class WebsiteModule { }
