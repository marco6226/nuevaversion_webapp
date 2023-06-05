import { Component, OnInit } from "@angular/core";

import { SistemaCausaRaiz } from "src/app/website/pages/comun/entities/sistema-causa-raiz";
import { SistemaCausaRaizService } from "src/app/website/pages/core/services/sistema-causa-raiz.service";
import { CausaRaiz } from "src/app/website/pages/comun/entities/causa-raiz";
import { Observacion } from "src/app/website/pages/observaciones/entities/observacion";
import { ObservacionService } from "src/app/website/pages/core/services/observacion.service";
import { SesionService } from "src/app/website/pages/core/services/session.service";
import { ParametroNavegacionService } from "src/app/website/pages/core/services/parametro-navegacion.service";
import { Router } from "@angular/router";

import { Message, TreeNode } from "primeng/api";
import { Filter, Criteria } from "../../../core/entities/filter";
import { FilterQuery } from "../../../core/entities/filter-query";
import { DirectorioService } from "src/app/website/pages/ado/services/directorio.service";
import { DomSanitizer } from "@angular/platform-browser";
import { AuthService } from 'src/app/website/pages/core/services/auth.service';

@Component({
  selector: 'app-gestion-observaciones',
  templateUrl: './gestion-observaciones.component.html',
  styleUrls: ['./gestion-observaciones.component.scss']
})
export class GestionObservacionesComponent implements OnInit {

  msgs?: Message[];
  observacion?: Observacion;
  visiblePnlDenegada?: boolean;
  visiblePnlAceptada?: boolean;
  causaRaizSelectList?: TreeNode[];
  causaRaizList?: TreeNode[];
  motivo?: string;
  visibleObservacion: boolean = true;
  msg?: string;
  consultar: boolean = true;
EstadoSeg: string = "Positivas";
  imagenesList: any = [];
  idEmpresa? : string | null;

  constructor(
      private domSanitizer: DomSanitizer,
      private directorioService: DirectorioService,
      private sistemaCausaRaizService: SistemaCausaRaizService,
      private observacionService: ObservacionService,
      private sesionService: SesionService,
      private router: Router,
      private paramNav: ParametroNavegacionService,
      private authService: AuthService
  ) {}

  ngOnInit() {

      this.idEmpresa = this.sesionService.getEmpresa()!.id;
      this.observacion = this.paramNav.getParametro<Observacion>();
      this.consultar = this.paramNav.getAccion() == "GET";

      if (this.observacion == null) {
          this.router.navigate(["app/auc/consultaObservaciones"]);
          return;
      }

      let filter = new Filter();
      filter.criteria = Criteria.EQUALS;
      filter.field = "id";
      filter.value1 = this.observacion.id;
      let filterQuery = new FilterQuery();
      filterQuery.filterList = [filter];

      this.observacionService
          .findByFilter(filterQuery)
          .then((resp:any) => (this.observacion = resp["data"][0]))
          .then((resp:any) => {
              this.observacion!.documentoList!.forEach((doc) => {
                  this.directorioService.download(doc.id).then((data?:any) => {
                      let urlData = this.domSanitizer.bypassSecurityTrustUrl(
                          URL.createObjectURL(data)
                      );
                      this.imagenesList.push({ source: urlData });
                      this.imagenesList = this.imagenesList.slice();
                  });
              });
              if (this.observacion!.aceptada != null) {
                  this.visiblePnlAceptada = <boolean>(
                      this.observacion!.aceptada
                  );
                  this.visiblePnlDenegada = !this.observacion!.aceptada;
              }
              if (this.visiblePnlAceptada) {
                  this.motivo = this.observacion!.motivo;
              } else if (this.visiblePnlDenegada) {
                  this.motivo = this.observacion!.motivo;
              }
          });
  }

  loadCausaRaiz() {
      if (this.causaRaizList == null) {
          this.sistemaCausaRaizService
              .findDefault()
              .then(
                  (data) =>
                      (this.causaRaizList = this.buildTreeNode(
                          (<SistemaCausaRaiz>data).causaRaizList!,
                          null
                      ))
              );
      }
  }

  buildTreeNode(crList: CausaRaiz[], parentNode: any): any {
      let treeNodeList: TreeNode[] = [];
      crList.forEach((cr) => {
          let node:any;
          node = {
              id: cr.id,
              label: cr.nombre,
              selectable: !this.consultar,
              parent: parentNode,
          };
          node.children =
              cr.causaRaizList == null || cr.causaRaizList.length == 0
                  ? null
                  : this.buildTreeNode(cr.causaRaizList, node);
          if (this.visiblePnlAceptada && this.causaRaizSelectList != null) {
              this.adicionarSeleccionados(node);
          }
          treeNodeList.push(node);
      });
      return treeNodeList;
  }

  adicionarSeleccionados(node: any) {
      for (
          let i = 0;
          i < this.observacion!.causaRaizAprobadaList!.length;
          i++
      ) {
          let crObser = this.observacion!.causaRaizAprobadaList![i];
          if (crObser.id == node.id) {
              this.expandParent(node);
              this.causaRaizSelectList!.push(node);
              return;
          }
      }
  }

  expandParent(node: any) {
      if (node.parent != null) {
          this.expandParent(node.parent);
      }
      node.expanded = true;
  }

  buildCausaRaizList(crTree: any[]): CausaRaiz[] | null{
      if (crTree == null) {
          return null;
      }
      let crList: CausaRaiz[] = [];
      crTree.forEach((imp) => {
          let crEntity = new CausaRaiz();
          crEntity.id = imp.id;
          crList.push(crEntity);
      });
      return crList;
  }

  guardarAceptar() {
      this.observacion!.motivo = this.motivo;
      this.observacionService
          .aceptarObservacion(this.observacion!)
          .then((data) => {
              this.visibleObservacion = false;
              this.msg = "La observación ha sido aceptada correctamente";
          });
  }

  guardarDenegar() {
      this.observacion!.motivo = this.motivo;
      this.observacionService
          .denegarObservacion(this.observacion!)
          .then((data) => {
              this.visibleObservacion = false;
              this.msg = "Se ha denegado la observación correctamente";

              this.authService.sendNotificationObservacionDenegada(
                  this.observacion!.usuarioReporta!.email!,
                  this.observacion
              );
          });
  }

  volver() {
      this.paramNav.setAccion(null);
      this.paramNav.setParametro<Observacion | null>(null);
      this.router.navigate(["app/auc/consultaObservaciones"]);
  }

  denegar() {
      this.visiblePnlAceptada = false;
      this.visiblePnlDenegada = true;
  }

  aceptar() {
      //this.loadCausaRaiz();
      this.visiblePnlAceptada = true;
      this.visiblePnlDenegada = false;
  }

}
