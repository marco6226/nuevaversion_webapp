import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { isNullOrUndefined } from '@syncfusion/ej2/base';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MessageService } from 'primeng/api';
import { CambioPasswdService } from '../../pages/comun/services/cambio-passwd.service';
import { AuthService } from '../../pages/core/services/auth.service';
import { SesionService } from '../../pages/core/services/session.service';
import { Empresa } from '../../pages/empresa/entities/empresa';
import { Usuario } from '../../pages/empresa/entities/usuario';
import { EmpresaService } from '../../pages/empresa/services/empresa.service';
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
  @ViewChild('imgAvatar', { static: false }) imgAvatar!: HTMLImageElement;
  @ViewChild('inputFile', { static: false }) inputFile!: HTMLInputElement;
  
  selectedItem!: SelectItem;
  listItems!: SelectItem[]
  display: boolean = false;
  displaySideBar: boolean = false;
  visibleDlg: boolean = false;
  imageChangedEvent: any;
  croppedImage: any;
  visbleChangePasw: boolean = false;

  constructor(
		private authService: AuthService,
		private router: Router,
    private messageService: MessageService,
    private cambioPasswdService: CambioPasswdService,
		private sesionService: SesionService,
    private empresaService: EmpresaService
    ) {}

  async ngOnInit(): Promise<void> {  
    // debugger
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

    async confirmEmpresa(event: SelectItem){
      debugger

      // this.empresaService.findByUsuario(this.usuario!.id).then(
      //   resp => this.loadItems(<Empresa[]>resp)
      // );
      // var x = this.empresasItems.find(x=>x.)
      await this.empresaService.findByUsuario(this.usuario!.id).then(
        resp => {
          console.log(resp);
        }       
      );

      
      await this.empresaService.findByUsuario(this.usuario!.id).then((resp: any)=>{
        resp.find((element: Empresa)=>{
          if (element.nombreComercial == event.label) {
            this.empresaSelect = element
          }
        })
      })
      debugger
      await this.sesionService.setEmpresa(this.empresaSelect);				
      await this.router.navigate([('/app/home')]);
      await location.reload();
      
    }

    async logout() {
      await this.authService.logout().then(
        resp => this.router.navigate(['/login'])
      ).catch(
        err => {
          this.messageService.add({severity:'error', summary: 'CREDENCIALES INCORRECTAS', detail: 'Se produjo un error al cerrar sesión, intente nuevamente'});
        }
      );
    }
    
    abrirCambioPasswd(){
      // this.cambioPasswdService.setVisible(true);
      this.visbleChangePasw = true
    }

    abrirDlg() {
      debugger
      this.visibleDlg = true;
      (<any>this.inputFile).nativeElement.click();
    }

    aceptarImg() {
      this.visibleDlg = false;
      this.usuario.avatar = this.croppedImage;
    }

    fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
    }
}

interface SelectItem{
  label: string,
  value: string
}