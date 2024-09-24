import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MessageService } from 'primeng/api';
import { CambioPasswdService } from '../../pages/comun/services/cambio-passwd.service';
import { AuthService } from '../../pages/core/services/auth.service';
import { SesionService } from '../../pages/core/services/session.service';
import { Empresa } from '../../pages/empresa/entities/empresa';
import { Usuario } from '../../pages/empresa/entities/usuario';
import { EmpresaService } from '../../pages/empresa/services/empresa.service';
import { MisTareasComponent } from '../../pages/sec/components/mis-tareas/mis-tareas.component';
import { UsuarioService } from '../../pages/admin/services/usuario.service';
import { FilterQuery } from '../../pages/core/entities/filter-query';
import { Criteria } from '../../pages/core/entities/filter';
import { PlantasService } from '../../pages/core/services/Plantas.service';
import { Subscription } from 'rxjs';
import { ViewMatrizPeligrosLogService } from '../../pages/core/services/view-matriz-peligros-log.service';
import { ViewMatrizPeligrosService } from '../../pages/core/services/view-matriz-peligros.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [MisTareasComponent, UsuarioService],
})
export class NavComponent implements OnInit {
  @Input() usuario!: Usuario;
  @Input() empresasItems: SelectItem[] = [];
  @Input() empresaSelect!: Empresa;
  @Input() empresaSelectOld!: Empresa;
  @Output() reloadEmpresa = new EventEmitter();
  @ViewChild('imgAvatar', { static: false }) imgAvatar!: HTMLImageElement;
  @ViewChild('inputFile', { static: false }) inputFile!: HTMLInputElement;

  uploadedFiles: any[] = [];

  selectedItem!: SelectItem;
  listItems!: SelectItem[];
  display: boolean = false;
  displaySideBar: boolean = false;
  visibleDlg: boolean = false;
  imageChangedEvent: any;
  croppedImage: any;
  visbleChangePasw: boolean = false;
  public tareasPendientes: any;
  tareasPendientesTotal: number = 0;
  BadgeColor: string = 'null';
  canvas: any;
  changePasswordRequired: boolean = false;

  matricezPendientesTotal: number = 0;
  public matricezPendientes: any = [];

  notificacionesPendientes: number = 0;

  private subscription: Subscription;
  private subscription2: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private cambioPasswdService: CambioPasswdService,
    private sesionService: SesionService,
    private empresaService: EmpresaService,
    private sessionService: SesionService,
    private usuarioService: UsuarioService,
    private mistareas: MisTareasComponent,
    private plantasService: PlantasService,
    private viewMatrizPeligrosService: ViewMatrizPeligrosService,
    private viewMatrizPeligrosLogService: ViewMatrizPeligrosLogService
  ) {
    cambioPasswdService.getObservable().subscribe((value) => {
      if (value) {
        this.visbleChangePasw = true;
        this.changePasswordRequired = true;
      } else {
        this.visbleChangePasw = false;
        this.changePasswordRequired = false;
      }
    });

    this.canvas = document.createElement('canvas');
    this.canvas.width = 48;
    this.canvas.height = 48;
    this.subscription = this.viewMatrizPeligrosService
      .obtenerNotificadorEvento()
      .subscribe(() => {
        this.mouseCampana();
      });
    this.subscription2 = this.viewMatrizPeligrosLogService
      .obtenerNotificadorEvento()
      .subscribe(() => {
        this.mouseCampana();
      });
  }

  async ngOnInit(): Promise<void> {
    // debugger
    await this.reloadEmpresa.emit();
    await this.cargartareas();
    await this.cargarNotificacionesMatrizConsolidado();
    await this.cargarNotificacionesMatrizHistorico();
  }

  showDialog() {
    if (this.empresasItems.length > 1) {
      this.display = true;
    }
  }

  showDialogSideBar() {
    this.displaySideBar = !this.displaySideBar;
  }

  async confirmEmpresa(event: SelectItem) {
    await this.empresaService
      .findByUsuario(this.usuario!.id)
      .then((resp: any) => {
        resp.find((element: Empresa) => {
          if (element.nombreComercial == event.label) {
            this.empresaSelect = element;
          }
        });
      });

    await this.sesionService.setEmpresa(this.empresaSelect);
    await this.router.navigate(['/app/home']);
    await location.reload();
  }

  async logout() {
    await this.authService
      .logout()
      .then((resp) => this.router.navigate(['/login']))
      .catch((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'CREDENCIALES INCORRECTAS',
          detail: 'Se produjo un error al cerrar sesión, intente nuevamente',
        });
      });
  }

  abrirCambioPasswd() {
    this.visbleChangePasw = true;
  }

  async onCloseChangePassword() {
    if (this.changePasswordRequired) {
      await this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  abrirDlg() {
    this.visibleDlg = true;
  }

  aceptarImg() {
    this.visibleDlg = false;
    this.usuario.avatar = this.croppedImage;
    this.actualizarUsuario();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      this.croppedImage = this.uploadedFiles[0].base64;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }

  async cargartareas() {
    //: void {

    await this.mistareas.ngOnInit();

    //this.nom= this.mistareas.ngOnInit() as any;
    // setTimeout(() => {
    this.tareasPendientes = await this.mistareas.devolverEstados();
    // }, 500);
    var cantidad = Object.values(this.tareasPendientes);
    this.tareasPendientesTotal = 0;
    cantidad.forEach((element: any) => {
      this.tareasPendientesTotal += element;
    });

    this.notificacionesPendientes =
      this.tareasPendientesTotal + this.matricezPendientesTotal;

    if (this.tareasPendientesTotal > 0) {
      this.BadgeColor = 'warn';
    } else {
      this.BadgeColor = 'primary';
    }

    return this.tareasPendientes;
  }

  irtareas(): void {
    this.router.navigate(['app//sec/misTareas']);
  }

  irmatriz(): void {
    this.router.navigate(['app/ipr/listadomatrizPeligros']);
  }

  dashBoard() {
    this.router.navigate(['/app/home']);
  }

  ler() {
    this.router.navigate(['/app/home']);
  }

  async actualizarUsuario() {
    let ctx = await this.canvas.getContext('2d');
    ctx.drawImage(await (<any>this.imgAvatar!).nativeElement, 0, 0, 48, 48);
    this.usuario.icon = this.canvas.toDataURL();
    // debugger
    this.usuarioService.edit(this.usuario).then(async (resp) => {
      let usuario = await this.sessionService.getUsuario();
      usuario!.email = this.usuario.email;
      usuario!.avatar = this.usuario.avatar;
      usuario!.icon = this.usuario.icon;
      this.sessionService.setUsuario(usuario!);
      this.messageService.add({
        summary: 'Usuario actualizado',
        detail: 'Se han actualizado correctamente los datos de usuario',
        severity: 'success',
      });
    });
  }
  public async mouseCampana() {
    this.matricezPendientesTotal = 0;
    this.matricezPendientes = [];
    await this.cargartareas();
    await this.cargarNotificacionesMatrizConsolidado();
    await this.cargarNotificacionesMatrizHistorico();
  }
  async cargarNotificacionesMatrizConsolidado() {
    let filterPlanta = new FilterQuery();
    filterPlanta.filterList = [
      {
        field: 'usuarioConsolidado.id',
        criteria: Criteria.EQUALS,
        value1: JSON.parse(localStorage.getItem('session')!).usuario.id,
      },
    ];
    filterPlanta.filterList.push({
      field: 'descargaConsolidado',
      criteria: Criteria.EQUALS,
      value1: 'false',
    });
    filterPlanta.filterList.push({
      field: 'plantas.id_empresa',
      criteria: Criteria.EQUALS,
      value1: JSON.parse(localStorage.getItem('session')!).empresa.id,
    });
    // await this.plantasService.getPlantaWithFilter(filterPlanta).then((resp:any)=>{
    await this.empresaService
      .getLocalidadesRWithFilter(filterPlanta)
      .then((resp: any) => {
        resp.data.forEach((element: any) => {
          this.matricezPendientes.push({
            nombre: element.nombre,
            tipo: 'Consolidado',
          });
        });
        this.matricezPendientesTotal += resp.data.length;
      });
    this.notificacionesPendientes =
      this.tareasPendientesTotal + this.matricezPendientesTotal;
  }
  async cargarNotificacionesMatrizHistorico() {
    let filterPlanta = new FilterQuery();
    filterPlanta.filterList = [
      {
        field: 'usuarioHistorico.id',
        criteria: Criteria.EQUALS,
        value1: JSON.parse(localStorage.getItem('session')!).usuario.id,
      },
    ];
    filterPlanta.filterList.push({
      field: 'descargaHistorico',
      criteria: Criteria.EQUALS,
      value1: 'false',
    });
    filterPlanta.filterList.push({
      field: 'plantas.id_empresa',
      criteria: Criteria.EQUALS,
      value1: JSON.parse(localStorage.getItem('session')!).empresa.id,
    });
    // await this.plantasService.getPlantaWithFilter(filterPlanta).then((resp:any)=>{
    await this.empresaService
      .getLocalidadesRWithFilter(filterPlanta)
      .then((resp: any) => {
        resp.data.forEach((element: any) => {
          this.matricezPendientes.push({
            nombre: element.nombre,
            tipo: 'Historico',
          });
        });
        this.matricezPendientesTotal += resp.data.length;
      });
    this.notificacionesPendientes =
      this.tareasPendientesTotal + this.matricezPendientesTotal;
  }
}

interface SelectItem {
  label: string;
  value: string;
}
