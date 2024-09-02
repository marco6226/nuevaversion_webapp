import { formatDate } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Criteria } from 'src/app/website/pages/core/entities/filter';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { firmaservice } from 'src/app/website/pages/core/services/firmas.service';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { Empleado } from 'src/app/website/pages/empresa/entities/empleado';

@Component({
  selector: 'app-plantilla-anexo6-consentimiento',
  templateUrl: './plantilla-anexo6-consentimiento.component.html',
  styleUrl: './plantilla-anexo6-consentimiento.component.scss',
})
export class PlantillaAnexo6ConsentimientoComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('canvasAprobador', { static: false })
  canvasAprobador!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasMedico', { static: false })
  canvasMedico!: ElementRef<HTMLCanvasElement>;
  ctxAprobador!: CanvasRenderingContext2D;
  ctxMedico!: CanvasRenderingContext2D;
  drawingAprobador = false;
  drawingMedico = false;
  whoSignature: string = '';
  empleadoSelect?: Empleado | null;
  nombreSesion?: string;
  empleadoStorage?: any;
  seguimientoId?: string;

  constructor(
    private _firmaservice: firmaservice,
    private _sesionService: SesionService,
    @Inject(LOCALE_ID) private locale: string
  ) {}
  ngOnInit(): void {
    const storedSignature = localStorage.getItem('whoSignature');
    this.whoSignature = storedSignature ? storedSignature : '';
    const empleadoStorage: string | null = localStorage.getItem('empleado');
    let seguimientoIdStr: string | null = localStorage.getItem('seguimiento');
    if (seguimientoIdStr !== null) {
      this.seguimientoId = seguimientoIdStr
    } else {
      this.seguimientoId = "";
    }
    if (empleadoStorage) {
      try {
        const empleadoObj: Empleado = JSON.parse(empleadoStorage);
        this.empleadoSelect = empleadoObj;
        console.log('exitoso: ', this.empleadoSelect);
      } catch (error) {
        console.error('Error al parsear el JSON de empleado:', error);
        this.empleadoSelect = null;
      }
    } else {
      this.empleadoSelect = null;
    }
    this.anexo6seguimiento();
  }
  ngAfterViewInit() {
    if (this.canvasAprobador != undefined) {
      this.ctxAprobador = this.canvasAprobador.nativeElement.getContext('2d')!;
      this.initializeCanvas(this.ctxAprobador);
    }
    if (this.canvasMedico != undefined) {
      this.ctxMedico = this.canvasMedico.nativeElement.getContext('2d')!;
      this.initializeCanvas(this.ctxMedico);
    }
  }

  initializeCanvas(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
  }

  startDrawingAprobador(event: MouseEvent | TouchEvent) {
    this.drawingAprobador = true;
    this.draw(event, this.ctxAprobador);
  }

  startDrawingMedico(event: MouseEvent | TouchEvent) {
    this.drawingMedico = true;
    this.draw(event, this.ctxMedico);
  }

  draw(event: MouseEvent | TouchEvent, ctx: CanvasRenderingContext2D) {
    event.preventDefault();
    let x: number = 0;
    let y: number = 0;
    if (event instanceof MouseEvent) {
      x = event.offsetX;
      y = event.offsetY;
    } else if (event instanceof TouchEvent) {
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    }
    if (this.drawingAprobador || this.drawingMedico) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  stopDrawingAprobador() {
    this.drawingAprobador = false;
    this.ctxAprobador.beginPath();
  }

  stopDrawingMedico() {
    this.drawingMedico = false;
    this.ctxMedico.beginPath();
  }

  savePad() {
    console.log('Prueba 123');
  }

  clearPadDoctor() {
    this.ctxMedico.clearRect(
      0,
      0,
      this.canvasMedico.nativeElement.width,
      this.canvasMedico.nativeElement.height
    );
  }

  clearApprove() {
    this.ctxAprobador.clearRect(
      0,
      0,
      this.canvasAprobador.nativeElement.width,
      this.canvasAprobador.nativeElement.height
    );
  }

  async anexo6seguimiento() {
    let ele: any;
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];
    filterQuery.filterList.push({
      criteria: Criteria.EQUALS,
      field: 'idrelacionado',
      value1:this.seguimientoId,
    });
    await this._firmaservice
      .getfirmWithFilter(filterQuery)
      .then((elem: any) => {
        ele = elem['data'];
      });
    ele.sort(function (a: any, b: any) {
      if (a.id > b.id) {
        return 1;
      } else if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
    let template = document.getElementById('plantillaAnexo6');

    template
      ?.querySelector('#P_empresa_logo')
      ?.setAttribute('src', this._sesionService.getEmpresa()?.logo!);
    // template?.querySelector('#P_firma_aprueba')?.setAttribute('src', '../../../../../assets/png/imgwhite.png');
    // if(ele.length>0)if(ele[0].firma)template?.querySelector('#P_firma_aprueba')?.setAttribute('src', ele[0].firma);
    // template?.querySelector('#P_firma_medico')?.setAttribute('src', '../../../../../assets/png/imgwhite.png');
    // if(ele.length>0)if(ele[1].firma)template?.querySelector('#P_firma_medico')?.setAttribute('src', ele[1].firma);
    // template!.querySelector('#P_fechaseguiminto')!.textContent = formatDate(
    //   seguimiento.fechaSeg,
    //   'dd/MM/yyyy',
    //   this.locale
    // );
    if (ele.length > 0)
      template!.querySelector('#P_nombre_aprueba')!.textContent = ele[0].nombre;
    if (ele.length > 0)
      template!.querySelector('#P_nombre_medico')!.textContent = ele[1].nombre;

    if (ele.length > 0)
      template!.querySelector('#P_cedula_aprueba')!.textContent = ele[0].cedula;
    if (ele.length > 0)
      template!.querySelector('#P_cedula_medico')!.textContent = ele[1].cedula;
    setTimeout(() => {
      template!.querySelector('#P_nombreApellidos')!.textContent =
        (this.empleadoSelect?.primerNombre
          ? this.empleadoSelect?.primerNombre
          : '') +
        ' ' +
        (this.empleadoSelect?.segundoNombre
          ? this.empleadoSelect?.segundoNombre
          : '') +
        ' ' +
        (this.empleadoSelect?.primerApellido
          ? this.empleadoSelect?.primerApellido
          : '') +
        ' ' +
        (this.empleadoSelect?.segundoApellido
          ? this.empleadoSelect?.segundoApellido
          : '');
      template!.querySelector('#P_cedula')!.textContent =
        this.empleadoSelect?.numeroIdentificacion!;
      template!.querySelector('#P_ubicacion')!.textContent =
        this.empleadoSelect?.area.nombre!;
      template!.querySelector('#P_cargo')!.textContent =
        this.empleadoSelect?.cargo.nombre!;

      // template!.querySelector('#P_textseguimiento')!.textContent =
      //   seguimiento.seguimiento;
      template!.querySelector('#P_usuariosesion')!.textContent =
        this.nombreSesion!;

      var WinPrint = window.open('', '_blank');

      WinPrint?.document.write(
        '<style>@page{size:letter;margin: 10mm 0mm 10mm 0mm; padding:0mm;}</style>'
      );
      WinPrint?.document.write(template?.innerHTML!);

      WinPrint?.document.close();
      WinPrint?.focus();
      WinPrint?.print();
    }, 2000);
  }
}
