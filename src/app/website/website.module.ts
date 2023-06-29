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
import { AsignacionColiderComponent } from './pages/ctr/components/asignacion-colider/asignacion-colider.component';
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
import { FormularioScmComponent } from './pages/scm/components/formulario-scm/formulario-scm.component';
import { LogmodalComponent } from './pages/scm/components/logmodal/logmodal.component';
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
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {FieldsetModule} from 'primeng/fieldset';
import {TreeTableModule} from 'primeng/treetable';
import { EmpleadoComponent } from './pages/empresa/components/empleado/empleado.component';
import { EmpleadoFormComponent } from './pages/empresa/components/empleado/empleado-form/empleado-form.component';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CiudadSelectorComponent } from './pages/comun/components/ciudad-selector/ciudad-selector.component';
import { GaleriaComponent } from './pages/comun/components/galeria/galeria.component';
import { JornadaFormComponent } from './pages/empresa/components/empleado/jornada-form/jornada-form.component';
import { AccordionModule } from 'primeng/accordion';
import { HorasExtraFormComponent } from './pages/empresa/components/empleado/horas-extra-form/horas-extra-form.component';
import { DocumentosEmpleadoFormComponent } from './pages/empresa/components/empleado/documentos-empleado-form/documentos-empleado-form.component';
import { DocumentoUploadComponent } from './pages/ado/components/documento-upload/documento-upload.component';
import { FileUploadModule } from 'primeng/fileupload';
import { DataNotFoundComponent } from './pages/comun/components/data-not-found/data-not-found.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AreaSelectorComponent } from './pages/empresa/components/area/area-selector/area-selector.component';
import { EmpleadoSelectorComponent } from './pages/comun/components/empleado-selector/empleado-selector.component';
import { FormularioAccidenteComponent } from './pages/rai/components/registro-reportes/formulario-accidente/formulario-accidente.component';
import { FormularioIncidenteComponent } from './pages/rai/components/registro-reportes/formulario-incidente/formulario-incidente.component';
import { AliadosActualizarComponent } from './pages/ctr/components/aliados-actualizar/aliados-actualizar.component';
import { AliadosListComponent } from './pages/ctr/components/aliados-list/aliados-list.component';
import { CalificacionComponent } from './pages/ctr/components/calificacion/calificacion.component';
import { CargueDocumentosComponent } from './pages/ctr/components/cargue-documentos/cargue-documentos.component';
import { DialogModule } from 'primeng/dialog';
import { ControlRiesgoComponent } from './pages/ctr/components/control-riesgo/control-riesgo.component';
import { FormSubcontratistaComponent } from './pages/ctr/components/subcontratistas/form-subcontratista/form-subcontratista.component';
import { SubcontratistasComponent } from './pages/ctr/components/subcontratistas/subcontratistas.component';
import { FlowChartComponent } from './pages/sec/components/analisis-desviacion/flow-chart/flow-chart.component';
import { DocumentosAnalisisDesviacionComponent } from './pages/sec/components/documentos-analisis-desviacion/documentos-analisis-desviacion.component';
import { FactorCausalComponent } from './pages/sec/components/analisis-desviacion/factor-causal/factor-causal.component';
import { IncapacidadesComplementariaComponent } from './pages/sec/components/analisis-desviacion/factor-causal/incapacidades-complementaria/incapacidades-complementaria.component';
import { CieSelectorComponent } from './pages/comun/components/cie-selector/cie-selector.component';
import { MiembrosEquipoComponent } from './pages/sec/components/analisis-desviacion/miembros-equipo/miembros-equipo.component';
import { EvidenciasComponent } from './pages/sec/components/analisis-desviacion/evidencias/evidencias.component';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { IdentificacionFactoresCausalesComponent } from './pages/sec/components/analisis-desviacion/factor-causal/identificacion-factores-causales/identificacion-factores-causales.component';
import { IdentificacionFactorCausalComponent } from './pages/sec/components/analisis-desviacion/factor-causal/identificacion-factor-causal/identificacion-factor-causal.component';
import { ListadoCausasComponent } from './pages/sec/components/analisis-desviacion/listado-causas/listado-causas.component';
import { PlanAccionListComponent } from './pages/sec/components/analisis-desviacion/factor-causal/plan-accion-list/plan-accion-list.component';
import { InformeComponent } from './pages/sec/components/analisis-desviacion/factor-causal/informe/informe.component';
import { PlanAccionComponent } from './pages/sec/components/analisis-desviacion/factor-causal/plan-accion/plan-accion.component';
import { DiagramModule, SymbolPaletteModule } from '@syncfusion/ej2-angular-diagrams';
import { NumericTextBoxModule, TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { EmpleadoBasicSelectorComponent } from './pages/comun/components/empleado-basic-selector/empleado-basic-selector.component';
import { DiagnosticoFormComponent } from './pages/scm/components/diagnostico-form/diagnostico-form.component';
import { ReintegroComponent } from './pages/scm/components/formulario-scm/reintegro/reintegro.component';
import { ReintegroListComponent } from './pages/scm/components/formulario-scm/reintegro-list/reintegro-list.component';
import { PclComponent } from './pages/scm/components/pcl/pcl.component';
import { RecomendationsformComponent,RecomendationStatusPipe} from './pages/scm/components/recomendationsform/recomendationsform.component';
import { ScmComponent } from './pages/scm/components/scm/scm.component';
import { ScmpermisosComponent } from './pages/scm/components/scmpermisos/scmpermisos.component';
import { SeguimientosformComponent } from './pages/scm/components/seguimientosform/seguimientosform.component';
import { FormularioConstructorComponent } from './pages/comun/components/formulario-constructor/formulario-constructor.component';
import { DirectorioService } from './pages/ado/services/directorio.service';
import { UsuarioService } from './pages/admin/services/usuario.service';
import { IdleTimeoutComponent } from './pages/comun/components/idle-timeout/idle-timeout.component';
import { IndCaracterizacionComponent } from './pages/ind/components/ind-caracterizacion/ind-caracterizacion.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'primeng/chart';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {MatTooltipModule} from '@angular/material/tooltip';
import { IndCasosMedicosComponent } from './pages/ind/components/ind-casos-medicos/ind-casos-medicos.component';
import { IndCasosMedicosGestionComponent } from './pages/ind/components/ind-casos-medicos-gestion/ind-casos-medicos-gestion.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CapitalizePipe } from '../website/pages/sec/components/utils/pipes/capitalize.pipe';
import { SeguimientosTareasComponent } from './pages/sec/components/seguimientos-tareas/seguimientos-tareas.component';
import { FileUploaderComponent } from './pages/comun/components/file-uploader/file-uploader.component';
import { VerificacionTareaComponent } from './pages/sec/components/verificacion-tarea/verificacion-tarea.component';
import { ConfiguracionGeneralDirective } from './pages/comun/directives/configuracion-general.directive';
import { DocumentoFormComponent } from './pages/ado/components/documento-form/documento-form.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FormularioAccidenteTemporalComponent } from './pages/rai/components/registro-reporte-temporal/formulario-accidente-temporal/formulario-accidente-temporal.component';
import { IncapacidadesComplementariaTemporalComponent } from './pages/rai/components/registro-reporte-temporal/formulario-accidente-temporal/incapacidades-complementaria-temporal/incapacidades-complementaria-temporal.component';
import { ListadoCausasTemporalComponent } from './pages/rai/components/registro-reporte-temporal/formulario-accidente-temporal/listado-causas-temporal/listado-causas-temporal.component';
import { FormularioIncidenteTemporalComponent } from './pages/rai/components/registro-reporte-temporal/formulario-incidente-temporal/formulario-incidente-temporal.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MensajeUsuarioComponent } from './components/mensaje-usuario/mensaje-usuario.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ElementoInspeccionNodeComponent } from './pages/inspecciones/components/lista-inspeccion-form/elemento-inspeccion-node/elemento-inspeccion-node.component';
import { RemisionComponent } from './pages/scm/components/formulario-scm/remision/remision.component';
import { FormularioAccidenteCtrComponent } from './pages/rai/components/registro-reporte-ctr/formulario-accidente/formulario-accidente-ctr.component';
import { IncapacidadesCtrComponent } from './pages/rai/components/registro-reporte-ctr/formulario-accidente/incapacidades-ctr/incapacidades-ctr.component';
import { ConsultaReportesAliadoComponent } from './pages/rai/components/consulta-reportes-aliado/consulta-reportes-aliado.component';
import { RegistroReporteCtrComponent } from './pages/rai/components/registro-reporte-ctr/registro-reporte-ctr.component';
import { SeguimientosgenericoformComponent } from './pages/scm/components/seguimientosgenericoform/seguimientosgenericoform.component';
import { FirmaComponent } from './pages/comun/components/firma/firma.component';
import { ResetPasswordComponent } from './pages/core/components/reset-password/reset-password.component';
import { FormularioComponent } from './pages/comun/components/formulario/formulario.component';
import { ChipsModule } from 'primeng/chips';
import { FileSizePipe } from './pages/comun/pipes/file-size.pipe'

@NgModule({
  declarations: [
    CapitalizePipe,
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
    ControlRiesgoComponent,
    FormSubcontratistaComponent,
    SubcontratistasComponent,
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
    RangoFechaSelectorComponent,
    EmpleadoComponent,
    EmpleadoFormComponent,
    CiudadSelectorComponent,
    GaleriaComponent,
    JornadaFormComponent,
    HorasExtraFormComponent,
    DocumentosEmpleadoFormComponent,
    DocumentoUploadComponent,
    DataNotFoundComponent,
    AreaSelectorComponent,
    EmpleadoSelectorComponent,
    FormularioAccidenteComponent,
    FormularioIncidenteComponent,
    FlowChartComponent,
    EmpleadoBasicSelectorComponent,
    DiagnosticoFormComponent,
    CieSelectorComponent,
    FormularioScmComponent,
    ReintegroComponent,
    ReintegroListComponent,
    LogmodalComponent,
    PclComponent,
    RecomendationsformComponent,
    RecomendationStatusPipe,
    ScmComponent,
    ScmpermisosComponent,
    SeguimientosformComponent,
    DocumentosAnalisisDesviacionComponent,
    FactorCausalComponent,
    IncapacidadesComplementariaComponent,
    CieSelectorComponent,
    MiembrosEquipoComponent,
    EvidenciasComponent,
    IdentificacionFactoresCausalesComponent,
    IdentificacionFactorCausalComponent,
    ListadoCausasComponent,
    PlanAccionListComponent,
    InformeComponent,
    PlanAccionComponent,
    FlowChartComponent,
    EmpleadoBasicSelectorComponent,
    FormularioConstructorComponent,
    IdleTimeoutComponent,
    IndCaracterizacionComponent,
    IndCasosMedicosComponent,
    IndCasosMedicosGestionComponent,
    SeguimientosTareasComponent,
    FileUploaderComponent,
    VerificacionTareaComponent,
    ConfiguracionGeneralDirective,
    FormularioAccidenteTemporalComponent,
    IncapacidadesComplementariaTemporalComponent,
    ListadoCausasTemporalComponent,
    FormularioIncidenteTemporalComponent,
    DocumentoFormComponent,
    MensajeUsuarioComponent,
    ElementoInspeccionNodeComponent,
    RemisionComponent,
    FormularioAccidenteCtrComponent,
    IncapacidadesCtrComponent,
    ConsultaReportesAliadoComponent,
    RegistroReporteCtrComponent,
    SeguimientosgenericoformComponent,
    FirmaComponent,
    ResetPasswordComponent,
    FormularioComponent,
    FileSizePipe
  ],
  imports: [
    MatTooltipModule,
    ChartModule,
    NgxChartsModule,
    CommonModule,
    WebsiteRoutingModule,
    SharedModule,
    MultiSelectModule,
    CheckboxModule,
    InputMaskModule,
    RadioButtonModule,
    MessagesModule,
    MessageModule,
    FieldsetModule,
    TreeTableModule,
    InputTextModule,
    PanelModule,
    CalendarModule,
    ConfirmDialogModule,
    TabViewModule,
    ProgressSpinnerModule,
    AutoCompleteModule,
    AccordionModule,
    FileUploadModule,
    ImageCropperModule,
    DialogModule,
    StepsModule,
    ToastModule,
    DiagramModule, 
    SymbolPaletteModule,
    NumericTextBoxModule, 
    TextBoxModule, 
    UploaderModule,
    OverlayPanelModule,
    ContextMenuModule,
    BreadcrumbModule,
    ScrollPanelModule,
    ChipsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      
    })
  ],
  providers: [
    PerfilService,
    DirectorioService,
    UsuarioService,
    CapitalizePipe
  ],
  exports:[
    ConfiguracionGeneralDirective,
    FileSizePipe
  ]

})
export class WebsiteModule { }
