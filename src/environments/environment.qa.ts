let protocol = 'https';
let host = 'demo.sigess.app'
let port = '5858';
let path = protocol + "://" + host + ":" + port + "/sigess/api/";

export const environment = {
    production: false
};

export const endPoints: string | any = {
    auth: path + "authenticate/",
    empresa: path + "empresa/",
    area: path + "area/",
    tipoArea: path + "tipoArea/",
    sede: path + "sede/",
    cargo: path + "cargo/",
    scm: path + "casomedico/",
    pcl: path + "pcl/",
    EmpresaService: path + "empresa/",
    ContextoOrganizacionService: path + "contextoOrganizacion/",
    CargoService: path + "cargo/",
    CompetenciaService: path + "competencia/",
    RecursoService: path + "recurso/",
    PermisoService: path + "permiso/",
    UsuarioService: path + "usuario/",
    EmpleadoService: path + "empleado/",
    EmpleadoBasicService: path + "empleadobasic/",
    EvaluacionDesempenoService: path + "evaluacionDesempeno/",
    PerfilService: path + "perfil/",
    ConfiguracionJornadaService: path + "configuracionJornada/",
    HorasExtraService: path + "horasExtra/",
    HhtService: path + "hht/",
    HhtIliService: path + "hhtIli",
    emp_perfil: path + "perfil/",
  
    anexoSCM:path + "anexscm/",
    
    departamento: path + "departamento/",
    ciudad: path + "ciudad/",
  
    SistemaGestionService: path + "sistemaGestion/",
    sge_sistemagestion: path + "sistemaGestion/",
    EvaluacionService: path + "evaluacion/",
    sge_respuesta: path + "respuesta/",
    RespuestaService: path + "respuesta/",
    sge_reporte: path + "reportesSGE/",
    ReporteSGEService: path + "reportesSGE/",
    ElementoService: path + "elementoSGE",
  
    com_ciiu: path + "ciiu/",
    com_arl: path + "arl/",
    com_afp: path + "afp/",
    com_eps: path + "eps/",
    com_prepagadas: path + "prepagadas/",
    com_provsalud: path + "provsalud/",
    com_ccf: path + "ccf/",
    com_pais: path + "pais/",
    com_cie: path + "cie/",
    com_departamento: path + "departamento/",
    CiudadService: path + "ciudad/",
    com_tipoIdentificacion: path + "enums/tipoIdentificacion/",
    com_tipoVinculacion: path + "enums/tipoVinculacion/",
    com_tipoSede: path + "enums/tipoSede/",
  
    DesviacionService: path + "desviacion/",
    DesviacionAliadosService: path + "desviacionAliados/",
    ReporteAtService: path + "reporteatview/",
    AnalisisDesviacionService: path + "analisisDesviacion/",
    SistemaCausaRaizService: path + "sistemaCausaRaiz/",
    SistemaCausaInmediataService: path + "sistemaCausaInmediata/",
    TareaService: path + "tarea/",
    TipoAreaService: path + "tipoArea/",
    AreaService: path + "area/",
  
    ListaInspeccionService: path + "listaInspeccion/",
    ViewListaInspeccionService: path + "vlistainpperfil/",
    ViewInspeccionService:path+"vinpperfil/",

    ProgramacionService: path + "programacion/",
    InspeccionService: path + "inspeccion/",
    ViewInspeccionCtr: path + "viewInspeccionesCtr/",
    cumplimientoService: path + "cumplimiento/",
    ViewResumenAliadosService: path + "viewResumenAliados/",
    TipoHallazgoService: path + "tipoHallazgo/",
    SerieService: path + "serieEvento/",
  
    SistemaNivelRiesgoService: path + "sistemaNivelRiesgo/",
  
    TarjetaService: path + "tarjeta/",
    ObservacionService: path + "observacion/",
  
    ReporteService: path + "reporte/",
  
    DirectorioService: path + "directorio/",
  
    ReporteAusentismoService: path + "reporteAusentismo/",
    CausaAusentismoService: path + "causaAusentismo/",
  
    IndicadorAusentismoService: path + "indicadorAusentismo/",
    IndicadorEmpresaService: path + "indicadorEmpresa/",
    IndicadorSgeService: path + "indicadorSge/",
    IndicadorService: path + "indicador/",
    TableroService: path + "tablero/",
    ModeloGrafica: path,
    CaracterizacionViewService: path +"indcar/",
    Plantas: path + "plantas/",
    ViewscmcoService: path + "indscmco/",
    ViewscmgeService: path + "indscmge/",
    ViewHHtMetasService: path + "viewhhtmeta/",

    
  metaService: path + "meta/",
  
    MatrizPeligrosLogService: path +"matrizPlog/",
    MatrizPeligrosService: path + "matrizP/",
    ViewMatrizPeligrosService: path + "vmatrizP/",
    ViewMatrizPeligrosLogService: path + "vmatrizPLog/",
    TipoPeligroService: path + "tipoPeligro/",
    PeligroService: path + "peligro/",
    FuenteService: path + "fuente/",
    EfectoService: path + "efecto/",
    TipoControlService: path + "tipoControl/",
    ControlService: path + "control/",
    IpecrService: path + "ipecr/",
    PeligroIpecrService: path + "peligroIpecr/",
    ParticipanteIpecrService: path + "participanteIpecr/",
    AreaMatrizService: path + "areaMatriz/",
    SubprocesoMatrizService:  path + "subProcesoMatriz/",
    ProcesoMatrizService:  path + "procesoMatriz/",
  
    ConfiguracionGeneralService: path + "configuracion/",
    SistemaCausaAdministrativaService: path + "sistemaCausaAdministrativa/",
    ActaService: path + "acta/",
    ContactoService: path + "contacto/",

    ViewscmInformeService: path + "viewinfoscm/",
  
    ManualService: path + "manual/",
    tareaService: path,

    firmaservice: path + "firm/",
    firma: 'https://demo.sigess.app/firma/',

    seguimientoid: 5721
  };