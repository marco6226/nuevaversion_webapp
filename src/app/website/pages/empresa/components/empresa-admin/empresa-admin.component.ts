import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Empresa } from './../../entities/empresa';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { config } from 'src/app/config';
import { Usuario } from 'src/app/website/pages/empresa/entities/usuario';
import { Arl } from 'src/app/website/pages/comun/entities/arl';
import { Ciiu } from 'src/app/website/pages/comun/entities/ciiu';
import { EmpresaService } from './../../services/empresa.service';
import { ComunService } from 'src/app/website/pages/comun/services/comun.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SelectItem, Message } from 'primeng/api';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-empresa-admin',
  templateUrl: './empresa-admin.component.html',
  styleUrls: ['./empresa-admin.component.scss']
})
export class EmpresaAdminComponent implements OnInit,AfterViewInit  {

  @ViewChild('dt', { static: false }) table!: Table;
  scrollableContainer!: HTMLElement;

  @ViewChild('imgAvatar', { static: false }) imgAvatar?: HTMLImageElement;
    @ViewChild('inputFile', { static: false }) inputFile?: HTMLInputElement;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    visibleDlg?: boolean;
    msgs: Message[] = [];
    empresaSelect?: Empresa;
    arlList: SelectItem[] = [];
    ciiuList: SelectItem[] = [];
    empresasList?: Empresa[];
    visibleForm?: boolean;
    form?: FormGroup;
    isUpdate?: boolean;
    canvas: any;
    tableScroll!:any;
    isScrollRigth: boolean = true;
    isScrollLeft: boolean = false;

    loading?: boolean;
    testing!: boolean;
    totalRecords?: number;
    fields: string[] = [
        'logo',
        'id',
        'razonSocial',
        'nombreComercial',
        'nit',
        'direccion',
        'telefono',
        'numeroSedes',
        'email',
        'web',
        'arl_id',
        'arl_nombre',
        'ciiu_codigo',
        'ciiu_nombre',
        'ciiu_id',
    ];

  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private comunService: ComunService,
    private sesionService: SesionService,
  ) { 
    this.canvas = document.createElement('canvas');
        this.canvas.width = 256;
        this.canvas.height = 256;
        this.form = fb.group({
            'logo': [null],
            'id': [null],
            'nombreComercial': [null, Validators.required],
            'razonSocial': [null, Validators.required],
            'nit': [null],
            'direccion': [null],
            'telefono': [null],
            'numeroSedes': [null],
            'email': [null],
            'web': [null],
            'arlId': [null],
            'ciiuId': [null]
        });
  }

  ngOnInit(): void {
    this.testing = true;
    this.loading = true;
        this.arlList.push({ label: '--Seleccione--', value: null });
        this.ciiuList.push({ label: '--Seleccione--', value: null });
        this.comunService.findAllArl().then(
            data => {
                (<Arl[]>data).forEach(arl => {
                    this.arlList.push({ label: arl.nombre, value: arl.id });
                });
            }
        );
        this.comunService.findAllCiiu().then(
            data => {
                (<Ciiu[]>data).forEach(ciiu => {
                    this.ciiuList.push({ label: ciiu.codigo + ' - ' + ciiu.nombre, value: ciiu.id });
                });
            }
        );
  }
  ngAfterViewInit() {
    this.tableWrapper();
    this.addScrollEventListener();
  }

  private tableWrapper() {
    this.tableScroll = this.table.el.nativeElement.querySelector(".p-datatable-wrapper");
  }

  private addScrollEventListener() {
    if (this.tableScroll) {
      this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
    }
  }

  private onManualScroll() {

    if(this.tableScroll.scrollLeft === 0){
      this.isScrollLeft = false;
      this.isScrollRigth = true;
    }else{
      this.isScrollLeft = true;
      this.isScrollRigth = false;
    }

  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const buttons = document.querySelector('.floating-buttons-scroll') as HTMLElement;
    if (buttons) {
      buttons.style.top = `${scrollTop + 50}px`; // Adjust 16px as needed for margin
    }
  }

  

  lazyLoad(event: any) {
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;
    filterQuery.groupBy = "nit";
    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

    this.empresaService.findByFilter(filterQuery).then(
        (resp : any) => {
            this.totalRecords = resp.count;
            this.loading = false;
            this.testing = false;
            this.empresasList = [];
            (<any[]>resp['data']).forEach(dto => this.empresasList?.push(FilterQuery.dtoToObject(dto)));
        }
    );
  }

  showAddForm() {
    this.form?.reset();
    this.visibleForm = true;
    this.isUpdate = false;
}

  showUpdateForm() {

    this.visibleForm = true;
    this.isUpdate = true;
  // let ctx = this.canvas.getContext("2d");
  // ctx.drawImage((<any>this.imgAvatar).nativeElement, 0, 0, 48, 48);
    //this.empresaSelect.logo = this.canvas.toDataURL();
    this.form?.patchValue({
        'logo': this.empresaSelect?.logo,
        'id': this.empresaSelect?.id,
        'nombreComercial': this.empresaSelect?.nombreComercial,
        'razonSocial': this.empresaSelect?.razonSocial,
        'nit': this.empresaSelect?.nit,
        'direccion': this.empresaSelect?.direccion,
        'telefono': this.empresaSelect?.telefono,
        'numeroSedes': this.empresaSelect?.numeroSedes,
        'email': this.empresaSelect?.email,
        'web': this.empresaSelect?.web,
        'arlId': this.empresaSelect?.arl == null ? null : this.empresaSelect.arl.id,
        'ciiuId': this.empresaSelect?.ciiu == null ? null : this.empresaSelect.ciiu.id
    });
  }
  onDelete() {

  }

  onSubmit() {
    let empresa = new Empresa();
    let ctx = this.canvas.getContext("2d");
    empresa.logo = this.canvas.toDataURL();
    empresa.id = this.form?.value.id;
    empresa.nombreComercial = this.form?.value.nombreComercial;
    empresa.razonSocial = this.form?.value.razonSocial;
    empresa.nit = this.form?.value.nit;
    empresa.direccion = this.form?.value.direccion;
    empresa.telefono = this.form?.value.telefono;
    empresa.numeroSedes = this.form?.value.numeroSedes;
    empresa.email = this.form?.value.email;
    empresa.web = this.form?.value.web;

    if (this.form?.value.arlId != null) {
        empresa.arl = new Arl();
        empresa.arl.id = this.form.value.arlId;
    }
    if (this.form?.value.ciiuId != null) {
        empresa.ciiu = new Ciiu();
        empresa.ciiu.id = this.form.value.ciiuId;
    }

    if (this.isUpdate) {
        let ctx = this.canvas.getContext("2d");
        ctx.drawImage((<any>this.imgAvatar).nativeElement, 0, 0, 200 , 200);
        empresa.logo = this.canvas.toDataURL();
        this.empresaService.update(empresa).then(
            (resp:any) => this.manageResponse(<Empresa>resp)
        );
    } else {
        this.empresaService.create(empresa).then(
            resp => this.manageResponse(<Empresa>resp)
        );
    }
}
  manageResponse(empresa: Empresa) {
    if (!this.isUpdate) {
        this.empresasList?.push(empresa);
        this.empresasList = this.empresasList?.slice();
    } else {
        if(this.empresasList)
        for (let i = 0; i < this.empresasList.length; i++) {
            if (this.empresasList[i].id === empresa.id) {
                this.empresasList[i].nit = empresa.nit;
                this.empresasList[i].direccion = empresa.direccion;
                this.empresasList[i].telefono = empresa.telefono;
                this.empresasList[i].numeroSedes = empresa.numeroSedes;
                this.empresasList[i].email = empresa.email;
                this.empresasList[i].web = empresa.web;
                this.empresasList[i].logo = empresa.logo;
                this.empresasList[i].nombreComercial = empresa.nombreComercial;
                this.empresasList[i].razonSocial = empresa.razonSocial;
                this.empresasList[i].arl = empresa.arl;
                this.empresasList[i].ciiu = empresa.ciiu;
                break;
            }
        }
    }
    this.msgs = [];
    this.msgs.push({
        severity: 'success',
        summary: 'Empresa ' + (this.isUpdate ? 'actualizada' : 'creada'),
        detail: 'Se ha ' + (this.isUpdate ? 'actualizado' : 'creado') + ' correctamente la empresa ' + empresa.razonSocial
    });
    this.visibleForm = false;
    this.empresaSelect = undefined;
  }

  abrirDlg() {
    this.visibleDlg = true;
    (<any>this.inputFile).nativeElement.click();
  }

  closeForm() {
    this.visibleForm = false;
  }

  aceptarImg() {
    this.visibleDlg = false;
    if (this.isUpdate) {
        this.empresaSelect!.logo = this.croppedImage;
    }
    else {
        let empresa = new Empresa();
        empresa.logo = this.croppedImage;
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  scrollLeft() {
    if (this.tableScroll) {
      this.tableScroll.scrollLeft -= 10000;
      this.isScrollLeft = false;
      this.isScrollRigth = true;
      this.tableScroll.removeEventListener('scroll', this.onManualScroll.bind(this));
      setTimeout(() => {
        this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
      }, 50);
    }
  }
  
  scrollRight() {
    if (this.tableScroll) {
      this.tableScroll.scrollLeft += 10000;
      this.isScrollRigth = false;
      this.isScrollLeft = true;
      this.tableScroll.removeEventListener('scroll', this.onManualScroll.bind(this));
      setTimeout(() => {
        this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
      }, 50);
    }
  }
}
