import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { MenuComponent } from './components/menu/menu.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './pages/core/components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './pages/core/components/dashboard/dashboard.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { WhatsappComponent } from './components/whatsapp/whatsapp.component';
import { LayoutMenuComponent } from './components/layout-menu/layout-menu.component';
import { PerfilComponent } from './pages/admin/components/perfil/perfil.component';
import { PermisosComponent } from './pages/admin/components/permisos/permisos.component';
import { UsuarioComponent } from './pages/admin/components/usuario/usuario.component';
import { ConsultaAusentismoComponent } from './pages/aus/components/consulta-ausentismo/consulta-ausentismo.component';
import { ReporteAusentismoComponent } from './pages/aus/components/reporte-ausentismo/reporte-ausentismo.component';
import { ManualesComponent } from './pages/ayuda/components/manuales/manuales.component';
import { CambioPasswdComponent } from './pages/comun/components/cambio-passwd/cambio-passwd.component';
import { ConsultactasComponent } from './pages/cop/components/consultactas/consultactas.component';
import { DashboardCoronaComponent } from './pages/core/components/dashboard-corona/dashboard-corona.component';
import { TerminosCondicionesComponent } from './pages/core/components/terminos-condiciones/terminos-condiciones.component';
import { InicioComponent } from './pages/core/components/inicio/inicio.component';
import { ActividadesContratadasComponent } from './pages/ctr/components/actividades-contratadas/actividades-contratadas.component';
import { AdminContratistasComponent } from './pages/ctr/components/admin-contratistas/admin-contratistas.component';
import { AliadosComponent } from './pages/ctr/components/aliados/aliados.component';
import { AliadosActualizarComponent } from './pages/ctr/components/aliados-actualizar/aliados-actualizar.component';
import { AliadosListComponent } from './pages/ctr/components/aliados-list/aliados-list.component';
import { AsignacionColiderComponent } from './pages/ctr/components/asignacion-colider/asignacion-colider.component';
import { CalificacionComponent } from './pages/ctr/components/calificacion/calificacion.component';
import { CargueDocumentosComponent } from './pages/ctr/components/cargue-documentos/cargue-documentos.component';
import { EquipoSstComponent } from './pages/ctr/components/equipo-sst/equipo-sst.component';
import { EquipoSstListComponent } from './pages/ctr/components/equipo-sst-list/equipo-sst-list.component';
import { InformacionGeneralComponent } from './pages/ctr/components/informacion-general/informacion-general.component';
import { LocalidadesComponent } from './pages/ctr/components/localidades/localidades.component';
import { SeguimientoContratistasComponent } from './pages/ctr/components/seguimiento-contratistas/seguimiento-contratistas.component';
import { AreaComponent } from './pages/empresa/components/area/area.component';
import { CargoComponent } from './pages/empresa/components/cargo/cargo.component';
import { CargueDatosComponent } from './pages/empresa/components/cargue-datos/cargue-datos.component';
import { CompetenciaComponent } from './pages/empresa/components/competencia/competencia.component';
import { ContextoOrganizacionComponent } from './pages/empresa/components/contexto-organizacion/contexto-organizacion.component';
import { EmpleadoComponent } from './pages/empresa/components/empleado/empleado.component';
import { EmpresaAdminComponent } from './pages/empresa/components/empresa-admin/empresa-admin.component';
import { EvaluacionDesempenoComponent } from './pages/empresa/components/evaluacion-desempeno/evaluacion-desempeno.component';
import { EvaluacionDesempenoFormComponent } from './pages/empresa/components/evaluacion-desempeno-form/evaluacion-desempeno-form.component';
import { HhtComponent } from './pages/empresa/components/hht/hht.component';
import { TipoAreaComponent } from './pages/empresa/components/tipo-area/tipo-area.component';
import { UsuarioPreferenciasComponent } from './pages/empresa/components/usuario-preferencias/usuario-preferencias.component';
import { ConsultaTableroComponent } from './pages/ind/components/consulta-tablero/consulta-tablero.component';
import { ElaboracionTableroComponent } from './pages/ind/components/elaboracion-tablero/elaboracion-tablero.component';
import { HoraHombresTrabajadaComponent } from './pages/ind/components/hora-hombres-trabajada/hora-hombres-trabajada.component';
import { IndicadoresAusentismoComponent } from './pages/ind/components/indicadores-ausentismo/indicadores-ausentismo.component';
import { IndicadoresEmpComponent } from './pages/ind/components/indicadores-emp/indicadores-emp.component';
import { IndicadoresInpComponent } from './pages/ind/components/indicadores-inp/indicadores-inp.component';
import { IndicadoresRaiComponent } from './pages/ind/components/indicadores-rai/indicadores-rai.component';
import { IndicadoresSgeComponent } from './pages/ind/components/indicadores-sge/indicadores-sge.component';
import { PanelGraficaComponent } from './pages/ind/components/panel-grafica/panel-grafica.component';
import { ConsultaInspeccionesComponent } from './pages/inspecciones/components/consulta-inspecciones/consulta-inspecciones.component';
import { ElaboracionInspeccionesComponent } from './pages/inspecciones/components/elaboracion-inspecciones/elaboracion-inspecciones.component';
import { ElaboracionListaComponent } from './pages/inspecciones/components/elaboracion-lista/elaboracion-lista.component';
import { ListaInspeccionFormComponent } from './pages/inspecciones/components/lista-inspeccion-form/lista-inspeccion-form.component';
import { ListasInspeccionComponent } from './pages/inspecciones/components/listas-inspeccion/listas-inspeccion.component';
import { ProgramacionComponent } from './pages/inspecciones/components/programacion/programacion.component';
import { ConsultaIpecrComponent } from './pages/ipr/components/consulta-ipecr/consulta-ipecr.component';
import { FormularioIpecrComponent } from './pages/ipr/components/formulario-ipecr/formulario-ipecr.component';
import { FormularioPeligroComponent } from './pages/ipr/components/formulario-peligro/formulario-peligro.component';
import { ParametrizacionPeligrosComponent } from './pages/ipr/components/parametrizacion-peligros/parametrizacion-peligros.component';
import { ConsultaObservacionesComponent } from './pages/observaciones/components/consulta-observaciones/consulta-observaciones.component';
import { FormularioTarjetaComponent } from './pages/observaciones/components/formulario-tarjeta/formulario-tarjeta.component';
import { GestionObservacionesComponent } from './pages/observaciones/components/gestion-observaciones/gestion-observaciones.component';
import { RegistroObservacionesComponent } from './pages/observaciones/components/registro-observaciones/registro-observaciones.component';
import { TarjetaComponent } from './pages/observaciones/components/tarjeta/tarjeta.component';
import { CargaArchivoComponent } from './pages/rai/components/carga-archivo/carga-archivo.component';
import { ConsultaReportesComponent } from './pages/rai/components/consulta-reportes/consulta-reportes.component';
import { ConsultarReporteTemporalComponent } from './pages/rai/components/consultar-reporte-temporal/consultar-reporte-temporal.component';
import { RegistroReporteTemporalComponent } from './pages/rai/components/registro-reporte-temporal/registro-reporte-temporal.component';
import { RegistroReportesComponent } from './pages/rai/components/registro-reportes/registro-reportes.component';
import { DiagnosticoFormComponent } from './pages/scm/components/diagnostico-form/diagnostico-form.component';
import { FormularioScmComponent } from './pages/scm/components/formulario-scm/formulario-scm.component';
import { LogmodalComponent } from './pages/scm/components/logmodal/logmodal.component';
import { PclComponent } from './pages/scm/components/pcl/pcl.component';
import { RecomendationsFormComponent } from './pages/scm/components/recomendations-form/recomendations-form.component';
import { ScmComponent } from './pages/scm/components/scm/scm.component';
import { ScmPermisosComponent } from './pages/scm/components/scm-permisos/scm-permisos.component';
import { SeguimientosFormComponent } from './pages/scm/components/seguimientos-form/seguimientos-form.component';
import { AnalisisCostosComponent } from './pages/sec/components/analisis-costos/analisis-costos.component';
import { AnalisisDesviacionComponent } from './pages/sec/components/analisis-desviacion/analisis-desviacion.component';
import { AsignacionTareasComponent } from './pages/sec/components/asignacion-tareas/asignacion-tareas.component';
import { ConsultaAnalisisDesviacionComponent } from './pages/sec/components/consulta-analisis-desviacion/consulta-analisis-desviacion.component';
import { ConsultaDesviacionComponent } from './pages/sec/components/consulta-desviacion/consulta-desviacion.component';
import { ConsultaDesviacionInspeccionComponent } from './pages/sec/components/consulta-desviacion-inspeccion/consulta-desviacion-inspeccion.component';
import { ChartComponent } from './components/chart/chart.component';
import { ChartsComponent } from './components/charts/charts.component';
import { SistemaGestionComponent } from './pages/sg/components/sistema-gestion/sistema-gestion.component';
import { SgeFormComponent } from './pages/sg/components/sge-form/sge-form.component';
import { EvaluacionComponent } from './pages/sg/components/evaluacion/evaluacion.component';
import { ConsultaEvaluacionComponent } from './pages/sg/components/consulta-evaluacion/consulta-evaluacion.component';
import { GestionTareasComponent } from './pages/sec/components/gestion-tareas/gestion-tareas.component';
import { MisTareasComponent } from './pages/sec/components/mis-tareas/mis-tareas.component';
import { TareaComponent } from './pages/sec/components/tarea/tarea.component';
import { GestionDocumentalComponent } from './pages/ado/components/gestion-documental/gestion-documental.component';
import { AccidentalidadComponent } from './pages/ind/components/accidentalidad/accidentalidad.component';
import { ConsultaActasComponent } from './pages/cop/components/consulta-actas/consulta-actas.component';
import { LoadingComponent } from './components/loading/loading.component';
import { EmpresaListComponent } from './components/empresa-list/empresa-list.component';
import { TienePermisoDirective } from './pages/comun/directives/tiene-permiso.directive';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { RangoFechaSelectorComponent } from './pages/comun/components/rango-fecha-selector/rango-fecha-selector.component';
import { CalendarModule } from 'primeng/calendar';
import { PerfilService } from './pages/admin/services/perfil.service';

@NgModule({
  declarations: [
    LayoutComponent,
    MenuComponent,
    NavComponent,
    LoginComponent,
    DashboardComponent,
    NavBarComponent,
    WhatsappComponent,
    LayoutMenuComponent,
    PerfilComponent,
    PermisosComponent,
    UsuarioComponent,
    ConsultaAusentismoComponent,
    ReporteAusentismoComponent,
    ManualesComponent,
    CambioPasswdComponent,
    ConsultactasComponent,
    DashboardCoronaComponent,
    TerminosCondicionesComponent,
    InicioComponent,
    ActividadesContratadasComponent,
    AdminContratistasComponent,
    AliadosComponent,
    AliadosActualizarComponent,
    AliadosListComponent,
    AsignacionColiderComponent,
    CalificacionComponent,
    CargueDocumentosComponent,
    EquipoSstComponent,
    EquipoSstListComponent,
    InformacionGeneralComponent,
    LocalidadesComponent,
    SeguimientoContratistasComponent,
    AreaComponent,
    CargoComponent,
    CargueDatosComponent,
    CompetenciaComponent,
    ContextoOrganizacionComponent,
    EmpleadoComponent,
    EmpresaAdminComponent,
    EvaluacionDesempenoComponent,
    EvaluacionDesempenoFormComponent,
    HhtComponent,
    TipoAreaComponent,
    UsuarioPreferenciasComponent,
    ConsultaTableroComponent,
    ElaboracionTableroComponent,
    HoraHombresTrabajadaComponent,
    IndicadoresAusentismoComponent,
    IndicadoresEmpComponent,
    IndicadoresInpComponent,
    IndicadoresRaiComponent,
    IndicadoresSgeComponent,
    PanelGraficaComponent,
    ConsultaInspeccionesComponent,
    ElaboracionInspeccionesComponent,
    ElaboracionListaComponent,
    ListaInspeccionFormComponent,
    ListasInspeccionComponent,
    ProgramacionComponent,
    ConsultaIpecrComponent,
    FormularioIpecrComponent,
    FormularioPeligroComponent,
    ParametrizacionPeligrosComponent,
    ConsultaObservacionesComponent,
    FormularioTarjetaComponent,
    GestionObservacionesComponent,
    RegistroObservacionesComponent,
    TarjetaComponent,
    CargaArchivoComponent,
    ConsultaReportesComponent,
    ConsultarReporteTemporalComponent,
    RegistroReporteTemporalComponent,
    RegistroReportesComponent,
    DiagnosticoFormComponent,
    FormularioScmComponent,
    LogmodalComponent,
    PclComponent,
    RecomendationsFormComponent,
    ScmComponent,
    ScmPermisosComponent,
    SeguimientosFormComponent,
    AnalisisCostosComponent,
    AnalisisDesviacionComponent,
    AsignacionTareasComponent,
    ConsultaAnalisisDesviacionComponent,
    ConsultaDesviacionComponent,
    ConsultaDesviacionInspeccionComponent,
    ChartComponent,
    ChartsComponent,
    SistemaGestionComponent,
    SgeFormComponent,
    EvaluacionComponent,
    ConsultaEvaluacionComponent,
    GestionTareasComponent,
    MisTareasComponent,
    TareaComponent,
    GestionDocumentalComponent,
    AccidentalidadComponent,
    ConsultaActasComponent,
    LoadingComponent,
    EmpresaListComponent,
    TienePermisoDirective,
    RangoFechaSelectorComponent
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    SharedModule,
    MultiSelectModule,
    CheckboxModule,
    InputMaskModule,
    RadioButtonModule,
    InputTextModule,
    PanelModule,
    CalendarModule
  ],
  providers: [
    PerfilService
  ]
})
export class WebsiteModule { }
