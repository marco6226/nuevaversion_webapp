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
import { MisTareasComponent } from '../../pages/sec/components/mis-tareas/mis-tareas.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers:[MisTareasComponent]
})
export class NavComponent implements OnInit {
  
  @Input() usuario!: Usuario
  @Input() empresasItems: SelectItem[] = [];
	@Input() empresaSelect!: Empresa;
	@Input() empresaSelectOld!: Empresa;
  @Output() reloadEmpresa = new EventEmitter();
  @ViewChild('imgAvatar', { static: false }) imgAvatar!: HTMLImageElement;
  @ViewChild('inputFile', { static: false }) inputFile!: HTMLInputElement;
  
  uploadedFiles: any[] = [];

  selectedItem!: SelectItem;
  listItems!: SelectItem[]
  display: boolean = false;
  displaySideBar: boolean = false;
  visibleDlg: boolean = false;
  imageChangedEvent: any;
  croppedImage: any;
  visbleChangePasw: boolean = false;
	public tareasPendientes: any;
  tareasPendientesTotal: number = 0 ;
  BadgeColor: string = 'null'

  constructor(
		private authService: AuthService,
		private router: Router,
    private messageService: MessageService,
    private cambioPasswdService: CambioPasswdService,
		private sesionService: SesionService,
    private empresaService: EmpresaService,
		private mistareas: MisTareasComponent,
    ) {}

  async ngOnInit(): Promise<void> {  
    // debugger
    await this.reloadEmpresa.emit();
    await this.cargartareas()
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
      this.visibleDlg = true;
      // (<any>this.inputFile).nativeElement.click();
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

    onUpload(event: any) {
      for(let file of event.files) {
          this.uploadedFiles.push(file);
          this.croppedImage = this.uploadedFiles[0].base64;
      }

      this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  async cargartareas(){//: void {
		
		await this.mistareas.ngOnInit();
        
		//this.nom= this.mistareas.ngOnInit() as any;
		// setTimeout(() => {           
			this.tareasPendientes= await this.mistareas.devolverEstados()
        // }, 500);
      var cantidad = Object.values(this.tareasPendientes)
      this.tareasPendientesTotal = 0;
      cantidad.forEach((element:any) => {
        this.tareasPendientesTotal += element
      });

      if (this.tareasPendientesTotal > 0) {
        this.BadgeColor = 'warn'
      } else {
        this.BadgeColor = 'primary'
      }
		
		
		return this.tareasPendientes
	}

	irtareas(): void {
	this.router.navigate(['app//sec/misTareas']);
	}

  test(){
    console.log(this.tareasPendientes)
    console.log(this.tareasPendientes.length)

    var cantidad = Object.values(this.tareasPendientes)
    cantidad.forEach((element:any) => {
      this.tareasPendientesTotal += element
    });
    console.log(this.tareasPendientesTotal)

    
  }

  dashBoard(){
    this.router.navigate([('/app/home')]);
  }
}


interface SelectItem{
  label: string,
  value: string
}