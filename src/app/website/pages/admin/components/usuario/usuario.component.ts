import { Component, OnInit } from '@angular/core';
import { PerfilService } from './../../services/perfil.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { Criteria } from '../../../core/entities/filter';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario, UsuarioEmpresa } from '../../../empresa/entities/usuario';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { SesionService } from '../../../core/services/session.service';
import { Perfil } from '../../../empresa/entities/perfil';
import { FilterQuery } from '../../../core/entities/filter-query';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [UsuarioService, PerfilService],
})
export class UsuarioComponent implements OnInit {

  empresaId!: string;
  usuarioList!: Usuario[];
  usuarioSelect!: Usuario;
  perfilList: SelectItem[] = [];
  visibleDlg!: boolean;
  Dlg!: boolean;
  // msgs: Message[] = [];
  isUpdate!: boolean;
  form: FormGroup;

  solicitando: boolean = false;
  loading!: boolean;
  downloading!: boolean;
  totalRecords!: number;
  fields: string[] = [
    'id',
    'email',
    'icon',
    'estado',
    'fechaModificacion',
    'fechaCreacion',
    'ultimoLogin',
    'ipPermitida',
    'mfa',
    'numeroMovil'
    //'usuarioEmpresaList_perfil_id'
  ];
  estadosList: SelectItem[] = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' }
  ];

  constructor(
    private sesionService: SesionService,
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    let mfaField = new FormControl();
    let numMovField = new FormControl();
    mfaField.valueChanges
      .subscribe(check => {
        if (check) {
          numMovField.setValidators([Validators.required, Validators.minLength(17), Validators.maxLength(17)]);
        } else {
          numMovField.setValidators(null);
        }
        numMovField.updateValueAndValidity();
      });
    this.form = fb.group({
      'id': [null],
      'email': [null, [Validators.required, Validators.email]],
      'perfilesId': [null, Validators.required],
      'ipPermitida':'{0.0.0.0/0}',
      'mfa': mfaField,
      'numeroMovil': numMovField,
      'estado': [null]
    }); 
  }

  ngOnInit() {
    this.perfilService.findAll()
      .then((resp:any) => {
        (<Perfil[]>resp['data']).forEach(perfil => {
          this.perfilList.push({ label: perfil.nombre, value: perfil.id })
        })
      });
    this.loading = true;
  }

  lazyLoad(event: any) {
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.groupBy = "id";
    filterQuery.sortField =  event.sortField ? event.sortField  : 'email', event.sortOrder = '-1';
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;
   

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    this.usuarioService.findByFilter(filterQuery).then(
      (resp:any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.usuarioList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.usuarioList.push(FilterQuery.dtoToObject(dto));
        });
      }
    );
  }
onClick(){
  }
  abrirDlg(isUpdate: boolean) {
    this.isUpdate = isUpdate;
    if (this.isUpdate) {
      this.form.controls['email'].disable() // .disable(); // cambios
      let filterQuery = new FilterQuery();
      filterQuery.filterList = [{
        field: 'usuarioEmpresaList.usuario.id',
        criteria: Criteria.EQUALS,
        value1: this.usuarioSelect.id,
        value2: null
      }];
      filterQuery.fieldList = ["id"];
      this.perfilService.findByFilter(filterQuery).then(
        (resp:any) => {
          let perfilesId: any[] = [];
          resp['data'].forEach((ident:any) => perfilesId.push(ident.id));
          this.form.patchValue({
            'id': this.usuarioSelect.id,
            'email': this.usuarioSelect.email,
            'perfilesId': perfilesId,
            'estado': this.usuarioSelect.estado,
            'ipPermitida': '{0.0.0.0/0}',
            'mfa': this.usuarioSelect.mfa,
            'numeroMovil': this.usuarioSelect.numeroMovil
          });
        }
      );
      this.visibleDlg = true;
    } else {
      this.form.reset();
      this.form.controls['email'].enable();
      this.visibleDlg = true;
    }
  }

  buildPerfilesIdList(usuario: Usuario) {
    let perfilesIdList:any[] = [];
    usuario.usuarioEmpresaList!.forEach((ue:UsuarioEmpresa) => {
      perfilesIdList.push(ue.perfil!.id);
    });
    return perfilesIdList;
  }

  eliminar() {
    if (this.usuarioSelect.estado == 'BLOQUEADO') {
      this.messageService.add({ severity: 'warn', summary: 'CAMBIO DE ESTADO NO VALIDO', detail: 'El usuario se encuentra BLOQUEADO' });
      return;
    }
    if (this.usuarioSelect.estado == 'ELIMINADO') {
      this.messageService.add({ severity: 'info', summary: 'USUARIO ELIMINADO', detail: 'El usuario ya se encuentra ELIMINADO' });
      return;
    }
    this.confirmationService.confirm({
      header: 'Confirmar acción',
      message: 'El usuario ' + this.usuarioSelect.email + ' será eliminado, no podrá deshacer esta acción, ¿Dese continuar?',
      accept: () =>
        this.usuarioService.delete(this.usuarioSelect.id!).then(data => this.manageOnDelete())
    });
  }

  manageOnDelete() {
    this.usuarioSelect.fechaModificacion = new Date();
    this.messageService.add({ severity: 'success', summary: 'Usuario eliminado', detail: 'Se ha eliminado el usuario ' + this.usuarioSelect.email });
    this.usuarioSelect.estado = 'ELIMINADO';
  }

  onSubmit() {
    
    if (this.form.value.estado == 'BLOQUEADO' || this.form.value.estado == 'ELIMINADO') {
      this.messageService.add({
        severity: 'warn',
        summary: 'MODIFICACION NO PERMITIDA',
        detail: 'No es posible modificar usuarios en estado BLOQUEADO o ELIMINADO'
      });
      return;
    }
    let usuario = new Usuario();
    usuario.id = this.form.value.id;
    usuario.email = this.form.value.email;
    usuario.usuarioEmpresaList = [];
    usuario.ipPermitida =['0.0.0.0/0'];
    usuario.mfa = this.form.value.mfa;
    usuario.numeroMovil = this.form.value.numeroMovil;
    if (this.form.value.estado == 'ACTIVO' || this.form.value.estado == 'INACTIVO') {
      usuario.estado = this.form.value.estado;
    }
    this.form.value.perfilesId.forEach((perfilId:any) => {
      let ue = new UsuarioEmpresa();
      ue.perfil = new Perfil();
      ue.perfil.id = perfilId;
      usuario.usuarioEmpresaList!.push(ue);
    });

    this.solicitando = true;
    if (this.isUpdate) {
      this.usuarioService.update(usuario)
        .then(resp => {
          this.manageResponse(<Usuario>resp, true);
          this.solicitando = false;
        })
        .catch(err => {
          this.solicitando = false;
        });;
    } else {
      this.usuarioService.create(usuario)
        .then(resp => {
          this.manageResponse(<Usuario>resp, false);
          this.solicitando = false;
        })
        .catch(err => {
          this.solicitando = false;
        });
    }
  }


  manageResponse(usuario: Usuario, isUpdate: boolean) {
    if (isUpdate) {
      this.usuarioSelect.email = usuario.email;
      this.usuarioSelect.usuarioEmpresaList = usuario.usuarioEmpresaList;
      this.usuarioSelect.fechaModificacion = usuario.fechaModificacion;
      this.usuarioSelect.estado = usuario.estado;
      this.usuarioSelect.ipPermitida = usuario.ipPermitida;
      this.usuarioSelect.mfa = usuario.mfa;
      this.usuarioSelect.numeroMovil = usuario.numeroMovil;
    } else {
      this.usuarioList.push(usuario);
      this.usuarioList = this.usuarioList.slice();
    }
    this.messageService.add({
      severity: 'success',
      summary: 'USUARIO ' + (isUpdate ? 'ACTUALIZADO' : 'CREADO'),
      detail: 'Se ha ' + (isUpdate ? 'actualizado' : 'creado') + ' correctamente el usuario ' + usuario.email
    });
    this.visibleDlg = false;
    this.form.reset();
  }

  descargarInvs() {
    this.downloading = true;
    this.usuarioService.consultarConsolidado()
      .then((resp:any) => {
        if (resp != null) {
          var blob = new Blob([<any>resp], { type: 'text/csv;charset=utf-8;' });
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink!.setAttribute("href", url);
          dwldLink!.setAttribute("download", "Consolidado usuarios_" + new Date().getTime() + ".csv");
          dwldLink!.click();
          this.downloading = false;
        }
      })
      .catch((err:any) => {
        this.downloading = false;
      });
  }

}
