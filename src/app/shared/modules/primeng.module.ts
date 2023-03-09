import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {PanelModule} from 'primeng/panel';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {TabViewModule} from 'primeng/tabview';
import {TreeModule} from 'primeng/tree';
import {ProgressBarModule} from 'primeng/progressbar';
import {DragDropModule} from 'primeng/dragdrop';
import {FileUploadModule} from 'primeng/fileupload';

const modules=[
  DropdownModule,
  ScrollPanelModule,
  ProgressSpinnerModule,
  ToastModule,
  DialogModule,
  ConfirmDialogModule,  
  CardModule,
  TableModule,
  PanelModule,
  SidebarModule,
  ButtonModule,
  OrganizationChartModule,
  TabViewModule,
  TreeModule,
  DragDropModule,
  FileUploadModule,
  ProgressBarModule
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    modules
  ],
  exports:[
    modules
  ],
  providers:[
    MessageService,
    ConfirmationService
  ]
})
export class PrimengModule { }
