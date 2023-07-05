import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api'
import { Empleado } from '../../../entities/empleado';
import { HorasExtra } from '../../../entities/horas-extra';
import { HorasExtraService } from '../../../services/horas-extra.service';
import { PrimeNGConfig } from 'primeng/api';
import { locale_es, tipo_identificacion, tipo_vinculacion } from 'src/app/website/pages/rai/entities/reporte-enumeraciones';


@Component({
  selector: 's-horasExtraForm',
  templateUrl: './horas-extra-form.component.html',
  styleUrls: ['./horas-extra-form.component.scss'],
  providers: [HorasExtraService, ConfirmationService, MessageService]
})
export class HorasExtraFormComponent implements OnInit {

  @Input("value") empleado!: Empleado;
  horasExtraList!: HorasExtra[];
  localeES: any = locale_es;
  constructor(
    private horasExtraService: HorasExtraService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private config: PrimeNGConfig
  ) { }

  ngOnInit() {
    this.config.setTranslation(this.localeES);
    this.horasExtraList = [];
    if (this.empleado.horasExtraList != null) {
      this.empleado.horasExtraList.forEach(he => {
        let horasExtra = new HorasExtra();
        horasExtra.id = he.id;
        horasExtra.horas = he.horas;
        horasExtra.fecha = new Date(he.fecha);
        this.horasExtraList.push(horasExtra);
      });
    }
  }

  adicionarHorasExtra() {
    let he = new HorasExtra();
    he.codigo = new Date().getTime();
    this.horasExtraList.push(he);
    this.horasExtraList = this.horasExtraList.slice();
  }

  guardarHorasExtra(he: HorasExtra) {
    if (this.comprobarCampos(he)) {
      he.empleado = new Empleado();
      he.empleado.id = this.empleado.id;
      this.horasExtraService.create(he).then(
        data => {
          for (let i = 0; i < this.horasExtraList.length; i++) {
            if (this.horasExtraList[i].codigo == he.codigo) {
              this.horasExtraList[i].id = (<HorasExtra>data).id;
              break;
            }
          }
          this.messageService.add({severity: 'success', summary: 'Horas extra registradas', detail: 'Se han registrado correctamente las horas extra' });
        }
      );
    }
  }


  descartarHorasExtra(he: HorasExtra) {
    for (let i = 0; i < this.horasExtraList.length; i++) {
      if (this.horasExtraList[i].codigo == he.codigo) {
        this.horasExtraList.splice(i, 1);
        this.horasExtraList = this.horasExtraList.slice();
        break;
      }
    }
  }

  confirmarEliminar(he: HorasExtra) {
    this.confirmationService.confirm({
      header: '¿Esta seguro de continuar?',
      message: 'Esta acción eliminará permanentemente el registro',
      icon: 'fa fa-exclamation-triangle',
      accept: () => this.eliminarHorasExtra(he)
    });
  }

  eliminarHorasExtra(he: HorasExtra) {
    this.horasExtraService.delete(he.id!).then(
      data => {
        he = <HorasExtra>data;
        this.messageService.add({severity: 'success', summary: 'Registro eliminado', detail: 'Se han eliminado correctamente las horas extra' });
        this.descartarHorasExtra(he);
      }
    );
  }

  actualizarHorasExtra(he: HorasExtra) {
    if (this.comprobarCampos(he)) {
      he.empleado = new Empleado();
      he.empleado.id = this.empleado.id;
      this.horasExtraService.update(he).then(
        data => {
          he = <HorasExtra>data;
          this.messageService.add({severity: 'success', summary: 'Horas extra actualizadas', detail: 'Se han actualizado correctamente las horas extra' });
        }
      );
    }
  }

  comprobarCampos(he: HorasExtra): boolean {
    if (he.fecha == null) {
      this.messageService.add({severity: 'warn', summary: 'Campo fecha requerido', detail: 'Debe establecer la fecha a la que corresponden las horas extra' });
      return false;
    }
    if (he.horas == null) {
      this.messageService.add({severity: 'warn', summary: 'Campo horas requerido', detail: 'Debe establecer la cantidad de horas extra' });
      return false;
    }
    return true;
  }
}
