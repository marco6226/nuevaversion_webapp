import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { PerfilComponent } from './pages/admin/components/perfil/perfil.component';
import { PermisosComponent } from './pages/admin/components/permisos/permisos.component';
import { UsuarioComponent } from './pages/admin/components/usuario/usuario.component';
import { GestionDocumentalComponent } from './pages/ado/components/gestion-documental/gestion-documental.component';
import { ConsultaAusentismoComponent } from './pages/aus/components/consulta-ausentismo/consulta-ausentismo.component';
import { ReporteAusentismoComponent } from './pages/aus/components/reporte-ausentismo/reporte-ausentismo.component';
import { ManualesComponent } from './pages/ayuda/components/manuales/manuales.component';
import { ConsultaActasComponent } from './pages/cop/components/consulta-actas/consulta-actas.component';
import { DashboardComponent } from './pages/core/components/dashboard/dashboard.component';
import { AdminContratistasComponent } from './pages/ctr/components/admin-contratistas/admin-contratistas.component';
import { AliadosActualizarComponent } from './pages/ctr/components/aliados-actualizar/aliados-actualizar.component';
import { AliadosListComponent } from './pages/ctr/components/aliados-list/aliados-list.component';
import { AliadosComponent } from './pages/ctr/components/aliados/aliados.component';
import { SeguimientoContratistasComponent } from './pages/ctr/components/seguimiento-contratistas/seguimiento-contratistas.component';
import { AreaComponent } from './pages/empresa/components/area/area.component';
import { CargoComponent } from './pages/empresa/components/cargo/cargo.component';
import { CargueDatosComponent } from './pages/empresa/components/cargue-datos/cargue-datos.component';
import { ContextoOrganizacionComponent } from './pages/empresa/components/contexto-organizacion/contexto-organizacion.component';
import { EmpleadoComponent } from './pages/empresa/components/empleado/empleado.component';
import { EmpresaAdminComponent } from './pages/empresa/components/empresa-admin/empresa-admin.component';
import { EvaluacionDesempenoFormComponent } from './pages/empresa/components/evaluacion-desempeno-form/evaluacion-desempeno-form.component';
import { EvaluacionDesempenoComponent } from './pages/empresa/components/evaluacion-desempeno/evaluacion-desempeno.component';
import { HhtComponent } from './pages/empresa/components/hht/hht.component';
import { TipoAreaComponent } from './pages/empresa/components/tipo-area/tipo-area.component';
import { UsuarioPreferenciasComponent } from './pages/empresa/components/usuario-preferencias/usuario-preferencias.component';
import { AccidentalidadComponent } from './pages/ind/components/accidentalidad/accidentalidad.component';
import { IndCaracterizacionComponent } from './pages/ind/components/ind-caracterizacion/ind-caracterizacion.component';
import { ConsultaTableroComponent } from './pages/ind/components/consulta-tablero/consulta-tablero.component';
import { HoraHombresTrabajadaComponent } from './pages/ind/components/hora-hombres-trabajada/hora-hombres-trabajada.component';
import { IndicadoresAusentismoComponent } from './pages/ind/components/indicadores-ausentismo/indicadores-ausentismo.component';
import { IndicadoresEmpComponent } from './pages/ind/components/indicadores-emp/indicadores-emp.component';
import { IndicadoresInpComponent } from './pages/ind/components/indicadores-inp/indicadores-inp.component';
import { IndicadoresRaiComponent } from './pages/ind/components/indicadores-rai/indicadores-rai.component';
import { IndicadoresSgeComponent } from './pages/ind/components/indicadores-sge/indicadores-sge.component';
import { ConsultaInspeccionesComponent } from './pages/inspecciones/components/consulta-inspecciones/consulta-inspecciones.component';
import { ElaboracionInspeccionesComponent } from './pages/inspecciones/components/elaboracion-inspecciones/elaboracion-inspecciones.component';
import { ElaboracionListaComponent } from './pages/inspecciones/components/elaboracion-lista/elaboracion-lista.component';
import { ListasInspeccionComponent } from './pages/inspecciones/components/listas-inspeccion/listas-inspeccion.component';
import { ProgramacionComponent } from './pages/inspecciones/components/programacion/programacion.component';
import { ConsultaIpecrComponent } from './pages/ipr/components/consulta-ipecr/consulta-ipecr.component';
import { FormularioIpecrComponent } from './pages/ipr/components/formulario-ipecr/formulario-ipecr.component';
import { ParametrizacionPeligrosComponent } from './pages/ipr/components/parametrizacion-peligros/parametrizacion-peligros.component';
import { ConsultaObservacionesComponent } from './pages/observaciones/components/consulta-observaciones/consulta-observaciones.component';
import { GestionObservacionesComponent } from './pages/observaciones/components/gestion-observaciones/gestion-observaciones.component';
import { RegistroObservacionesComponent } from './pages/observaciones/components/registro-observaciones/registro-observaciones.component';
import { TarjetaComponent } from './pages/observaciones/components/tarjeta/tarjeta.component';
import { CargaArchivoComponent } from './pages/rai/components/carga-archivo/carga-archivo.component';
import { ConsultaReportesComponent } from './pages/rai/components/consulta-reportes/consulta-reportes.component';
import { ConsultarReporteTemporalComponent } from './pages/rai/components/consultar-reporte-temporal/consultar-reporte-temporal.component';
import { RegistroReporteTemporalComponent } from './pages/rai/components/registro-reporte-temporal/registro-reporte-temporal.component';
import { RegistroReportesComponent } from './pages/rai/components/registro-reportes/registro-reportes.component';
import { FormularioScmComponent } from './pages/scm/components/formulario-scm/formulario-scm.component';
import { ScmComponent } from './pages/scm/components/scm/scm.component';
import { ScmpermisosComponent } from './pages/scm/components/scmpermisos/scmpermisos.component';
import { AnalisisDesviacionComponent } from './pages/sec/components/analisis-desviacion/analisis-desviacion.component';
import { AsignacionTareasComponent } from './pages/sec/components/asignacion-tareas/asignacion-tareas.component';
import { ConsultaDesviacionComponent } from './pages/sec/components/consulta-desviacion/consulta-desviacion.component';
import { GestionTareasComponent } from './pages/sec/components/gestion-tareas/gestion-tareas.component';
import { MisTareasComponent } from './pages/sec/components/mis-tareas/mis-tareas.component';
import { TareaComponent } from './pages/sec/components/tarea/tarea.component';
import { ConsultaEvaluacionComponent } from './pages/sg/components/consulta-evaluacion/consulta-evaluacion.component';
import { EvaluacionComponent } from './pages/sg/components/evaluacion/evaluacion.component';
import { SgeFormComponent } from './pages/sg/components/sge-form/sge-form.component';
import { SistemaGestionComponent } from './pages/sg/components/sistema-gestion/sistema-gestion.component';
import {IndCasosMedicosComponent} from 'src/app/website/pages/ind/components/ind-casos-medicos/ind-casos-medicos.component';
import {IndCasosMedicosGestionComponent} from 'src/app/website/pages/ind/components/ind-casos-medicos-gestion/ind-casos-medicos-gestion.component';
import { RegistroReporteCtrComponent } from './pages/rai/components/registro-reporte-ctr/registro-reporte-ctr.component';
import { ConsultaReportesAliadoComponent } from './pages/rai/components/consulta-reportes-aliado/consulta-reportes-aliado.component';
import { ElaboracionInspeccionesCtrComponent } from './pages/ctr/components/inspecciones-ctr/elaboracion-inspecciones-ctr/elaboracion-inspecciones-ctr.component';
import { ElaboracionListaCtrComponent } from './pages/ctr/components/inspecciones-ctr/elaboracion-lista-ctr/elaboracion-lista-ctr.component';
import { ListasInspeccionCtrComponent } from './pages/ctr/components/inspecciones-ctr/listas-inspeccion-ctr/listas-inspeccion-ctr.component';
import { ProgramacionCtrComponent } from './pages/ctr/components/inspecciones-ctr/programacion-ctr/programacion-ctr.component';
import { ConsultaInspeccionesCtrComponent } from './pages/ctr/components/inspecciones-ctr/consulta-inspecciones-ctr/consulta-inspecciones-ctr.component';
import { MatrizPeligrosComponent } from './pages/ipr/components/matriz-peligros/matriz-peligros.component';

const routes: Routes = [
  {
   path:'',
   component: LayoutComponent,
   children:[
    { 
      path: '', 
      redirectTo: '/home', 
      pathMatch: 'full'
    },
      { 
        path: 'home', 
        component: DashboardComponent,
      },
      { 
        path: 'admin', 
        children:[
          {path: 'perfil', component: PerfilComponent},
          {path: 'permisos', component: PermisosComponent},
          {path: 'usuario', component: UsuarioComponent}
        ]
      },
      { 
        path: 'empresa', 
        children:[
          { path: 'empresa', component: EmpresaAdminComponent},
          { path: 'contextoOrganizacion', component: ContextoOrganizacionComponent},
          { path: 'area',  component: AreaComponent},
          { path: 'tipoArea', component: TipoAreaComponent},
          { path: 'cargo', component: CargoComponent},
          { path: 'empleado', component: EmpleadoComponent},
          { path: 'evaluacionDesempeno', component: EvaluacionDesempenoComponent},
          { path: 'evaluacionDesempenoForm', component: EvaluacionDesempenoFormComponent},
          { path: 'cargueDatos', component: CargueDatosComponent},
          { path: 'usuarioPreferencias', component: UsuarioPreferenciasComponent},
          { path: 'hht', component: HhtComponent}
        ]
      },
      {
        path:'ctr',
        children: [
          { path: 'adminContratistas', component: AdminContratistasComponent },
          { path: 'aliado', component: AliadosComponent },
          { path: 'listadoAliados', component: AliadosListComponent },
          { path: 'actualizarAliado/:id', component: AliadosActualizarComponent },
          { path: 'actualizarAliado/:id/:onEdit', component: AliadosActualizarComponent },
          { path: 'seguimientoContratistas', component: SeguimientoContratistasComponent },
          { path: 'listasAuditoriaCicloCorto', component: ListasInspeccionCtrComponent},
          { path: 'elaborarListaCicloCorto', component: ElaboracionListaCtrComponent},
          { path: 'calendario', component: ProgramacionCtrComponent},
          { path: 'elaboracionAuditoriaCicloCorto', component: ElaboracionInspeccionesCtrComponent},
          { path: 'elaboracionAuditoriaCicloCorto/:id', component: ElaboracionInspeccionesCtrComponent},
          { path: 'elaboracionAuditoriaCicloCorto/:id/:version', component: ElaboracionInspeccionesCtrComponent},
          { path: 'auditoriasRealizadas', component: ConsultaInspeccionesCtrComponent},
          { path: 'elaborarListaCicloCorto/:id/:version', component: ElaboracionListaCtrComponent}
        ]
      },
      {
        path: 'inspecciones',
        children: [
          { path: 'listasInspeccion', component: ListasInspeccionComponent },
          { path: 'elaboracionLista', component: ElaboracionListaComponent },
          { path: 'programacion', component: ProgramacionComponent },
          { path: 'elaboracionInspecciones', component: ElaboracionInspeccionesComponent },
          { path: 'elaboracionInspecciones/:id', component: ElaboracionInspeccionesComponent},
          { path: 'elaboracionInspecciones/:id/:version', component: ElaboracionInspeccionesComponent},
          { path: 'consultaInspecciones', component: ConsultaInspeccionesComponent },
          { path: 'elaboracionLista/:id/:version', component: ElaboracionListaComponent}
        ]
      },
      {
        path: 'sg',
        children: [
          { path: 'sgeForm', component: SgeFormComponent },
          { path: 'sistemasGestion', component: SistemaGestionComponent },
          { path: 'evaluacion', component: EvaluacionComponent },
          { path: 'consultaEvaluaciones', component: ConsultaEvaluacionComponent }
        ]
      },
      {
        path: 'sec',
        children: [
          { path: 'desviaciones', component: ConsultaDesviacionComponent },
          { path: 'analisisDesviacion', component: AnalisisDesviacionComponent },
          { path: 'tareas', component: GestionTareasComponent },
          { path: 'tareasAsignadas', component: AsignacionTareasComponent },
          { path: 'misTareas', component: MisTareasComponent },
          { path: 'tarea/:id', component: TareaComponent }
      ]
      },
      {
        path: 'auc',
        children: [
          { path: 'tarjeta', component: TarjetaComponent },
          { path: 'observaciones', component: RegistroObservacionesComponent },
          { path: 'consultaObservaciones', component: ConsultaObservacionesComponent },
          { path: 'gestionObservaciones', component: GestionObservacionesComponent }
        ]
      },
      {
        path: 'rai',
        children: [
          { path: 'cargaArchivo', component: CargaArchivoComponent },
          { path: 'registroReporte', component: RegistroReportesComponent },
          { path: 'registroReporteTemporal', component: RegistroReporteTemporalComponent },
          { path: 'consultaReportes', component: ConsultaReportesComponent },
          { path: 'consultaReportestemporal', component: ConsultarReporteTemporalComponent },
          { path: 'registroReporteCtr', component: RegistroReporteCtrComponent },
          { path: 'actualizarReporteCtr/:id', component: RegistroReporteCtrComponent},
          { path: 'consultarReportesAliados', component: ConsultaReportesAliadoComponent},
          { path: 'consultarReporteCtr/:id', component: RegistroReporteCtrComponent}
        ]
      },
      {
        path: 'ado',
        children: [
          { path: 'gestionDocumental', component: GestionDocumentalComponent },
        ]
      },
      {
        path: 'scm',
        children: [
          { path: 'creacion', component: FormularioScmComponent },
          { path: 'list', component: ScmComponent },
          { path: 'case/:id', component: FormularioScmComponent },
          { path: 'permisos', component: ScmpermisosComponent },
        ]
      },
      {
        path: 'aus',
        children: [
          { path: 'reporteAusentismo', component: ReporteAusentismoComponent },
          { path: 'consultaAusentismo', component: ConsultaAusentismoComponent },
        ]
      },
      {
        path: 'ind',
        children: [
          { path: 'horahombrestrabajada', component: HoraHombresTrabajadaComponent },
          { path: 'consultaTablero', component: ConsultaTableroComponent },
          { path: 'emp', component: IndicadoresEmpComponent },
          { path: 'ausentismo', component: IndicadoresAusentismoComponent },
          { path: 'sge', component: IndicadoresSgeComponent },
          { path: 'rai', component: IndicadoresRaiComponent },
          { path: 'inp', component: IndicadoresInpComponent },
          { path: 'accidentalidad', component: AccidentalidadComponent },
          { path: 'indcasosmedicos', component: IndCasosMedicosComponent },
          { path: 'indcasosmedicosgestion', component: IndCasosMedicosGestionComponent },
          { path: 'indcaracterizacion', component: IndCaracterizacionComponent }
        ]
      },
      {
        path: 'ipr',
        children: [
          { path: 'peligros', component: ParametrizacionPeligrosComponent },
          { path: 'formularioIpecr', component: FormularioIpecrComponent },
          { path: 'consultaIpecr', component: ConsultaIpecrComponent },
          { path: 'matrizPeligros', component: MatrizPeligrosComponent },
        ]
      },
      {
        path: 'cop',
        children: [
          { path: 'consultaActas', component: ConsultaActasComponent },
        ]
      },      
      {
        path: 'ayuda',
        children: [
          { path: 'manuales', component: ManualesComponent },
        ]
      }
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
