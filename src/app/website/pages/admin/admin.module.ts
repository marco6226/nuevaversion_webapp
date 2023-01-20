import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ComunModule } from 'src/app/shared/modules/comun.module';
import { PerfilService } from './services/perfil.service';

@NgModule({
    imports: [
        ComunModule,
        AdminRoutingModule
    ],
    declarations: [AdminComponent, UsuarioComponent],
    providers: [PerfilService]
})
export class AdminModule { }
