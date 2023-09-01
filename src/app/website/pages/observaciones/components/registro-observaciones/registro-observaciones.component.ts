import { Component, OnInit } from '@angular/core';
import { TarjetaService } from 'src/app/website/pages/core/services/tarjeta.service'
import { Tarjeta } from 'src/app/website/pages/observaciones/entities/tarjeta'
import { Observacion } from 'src/app/website/pages/observaciones/entities/observacion'
import { Message } from 'primeng/api';

@Component({
  selector: 'app-registro-observaciones',
  templateUrl: './registro-observaciones.component.html',
  styleUrls: ['./registro-observaciones.component.scss']
})
export class RegistroObservacionesComponent implements OnInit {

  tarjetaList?: Tarjeta[];
  tarjetaSelect?: Tarjeta | null;
  msgs: Message[] = [];

  constructor(
    private tarjetaService: TarjetaService,
  ) { }

  ngOnInit() {
    this.tarjetaService.findAll().then(
      (data:any) => this.tarjetaList = <Tarjeta[]>data
    );
  }

  selectTarjeta(tarjeta: Tarjeta) {
    console.log(tarjeta)
    this.tarjetaSelect = tarjeta;
    this.tarjetaSelect.campos = JSON.parse(tarjeta.campos);
  }

  onSave(observacion: Observacion) {
    this.msgs = [];
    this.msgs.push({
      severity: 'success',
      summary: 'REPORTE REALIZADO',
      detail: 'Se ha registrado correctamente el reporte'
    });
    this.tarjetaSelect = null;
  }

}
