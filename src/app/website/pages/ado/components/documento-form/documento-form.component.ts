import { Component, OnInit, Input } from '@angular/core';

import { Documento } from 'src/app/website/pages/ado/entities/documento'
import { locale_es } from 'src/app/website/pages/comun/entities/reporte-enumeraciones'
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 's-documento-form',
  templateUrl: './documento-form.component.html',
  styleUrls: ['./documento-form.component.scss']
})
export class DocumentoFormComponent implements OnInit {

  @Input("documento") documento?: Documento;
  localeES = locale_es;

  constructor(public router: Router,
    private config: PrimeNGConfig) { }

  ngOnInit() {
    this.config.setTranslation(this.localeES);
  }

}
