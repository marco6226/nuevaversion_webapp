import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { PermisosComponent } from './components/permisos/permisos.component';
import { ComunModule } from 'src/app/shared/modules/comun.module';
import { PerfilService } from './services/perfil.service';

@NgModule({
    imports: [
        ComunModule,
        AdminRoutingModule
    ],
    declarations: [AdminComponent, PerfilComponent, UsuarioComponent, PermisosComponent],
    providers: [PerfilService]
})
export class AdminModule { }
