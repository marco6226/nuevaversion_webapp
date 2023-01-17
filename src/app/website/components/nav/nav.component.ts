import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../pages/core/services/auth.service';
import { SesionService } from '../../pages/core/services/session.service';
import { Empresa } from '../../pages/empresa/entities/empresa';
import { Usuario } from '../../pages/empresa/entities/usuario';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  
  @Input() usuario!: Usuario
  @Input() empresasItems: SelectItem[] = [];
	@Input() empresaSelect!: Empresa;
	@Input() empresaSelectOld!: Empresa;
  @Output() reloadEmpresa = new EventEmitter();
  
  selectedItem!: SelectItem;
  listItems!: SelectItem[]
  display: boolean = false;
  displaySideBar: boolean = false;

  constructor(
		private authService: AuthService,
		private router: Router,
    private messageService: MessageService,
		private sesionService: SesionService,
    ) {}

  async ngOnInit(): Promise<void> {  
    debugger
    await this.reloadEmpresa.emit();
  }

  test(){
    console.log(this.empresasItems, this.empresaSelect, this.empresaSelectOld);
    
  }


    showDialog() {
      if (this.empresasItems.length > 1) {
        this.display = true;        
      }
    }

    showDialogSideBar() {
      this.displaySideBar = !this.displaySideBar;
    }

    async confirmEmpresa(event: Empresa){
      debugger
      // var x = this.empresasItems.find(x=>x.)
      await this.sesionService.setEmpresa(event);				
      await this.router.navigate([('/app/home')]);
      // await location.reload();
      console.log(event);
      
    }

    async logout() {
      await this.authService.logout().then(
        resp => this.router.navigate(['/login'])
      ).catch(
        err => {
          this.messageService.add({severity:'error', summary: 'CREDENCIALES INCORRECTAS', detail: 'Se produjo un error al cerrar sesión, intente nuevamente'});
          
          // alert("Se produjo un error al cerrar sesión, ingresar nuevamente")
        }
      );
    }
}

interface SelectItem{
  label: string,
  value: string
}