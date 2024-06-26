import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ComunModule } from 'src/app/shared/modules/comun.module';
import { PerfilService } from './services/perfil.service';

@NgModule({
    imports: [
        ComunModule,
        AdminRoutingModule
    ],
    declarations: [AdminComponent],
    providers: [PerfilService]
})
export class AdminModule { }
