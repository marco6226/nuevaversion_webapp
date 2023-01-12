import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/core/services/auth.service';
import { Empresa } from '../../pages/empresa/entities/empresa';
import { Usuario } from '../../pages/empresa/entities/usuario';

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

  selectedItem!: SelectItem;
  listItems!: SelectItem[]
  display: boolean = false;
  displaySideBar: boolean = false;

  constructor(
		private authService: AuthService,
		private router: Router,
    ) { 
      }

  ngOnInit(): void {

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

    confirmEmpresa(event: Event){
      console.log(event);
      
    }

    async logout() {
      await this.authService.logout().then(
        resp => this.router.navigate(['/login'])
      ).catch(
        err => {
          
          alert("Se produjo un error al cerrar sesión, ingresar nuevamente")
        }
      );
    }
}

interface SelectItem{
  label: string,
  value: string
}