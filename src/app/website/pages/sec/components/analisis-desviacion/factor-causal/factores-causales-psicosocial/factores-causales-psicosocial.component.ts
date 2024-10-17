import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
//import {MatTableModule} from '@angular/material/table';
import { TreeNode } from 'primeng/api';
import { Causa_Raiz, Desempeno, FactorCausal, IdentificacionFC, seccion } from 'src/app/website/pages/comun/entities/factor-causal';

@Component({
  selector: 'app-factores-causales-psicosocial',
  templateUrl: './factores-causales-psicosocial.component.html',
  styleUrl: './factores-causales-psicosocial.component.scss'
})
export class FactoresCausalesPsicosocialComponent implements OnInit, AfterViewInit {

  @Input() factorCausal!: FactorCausal;
  @Input() causasRaiz!: Causa_Raiz;
  @Output() dataFC = new EventEmitter<FactorCausal>();
  @Output() validators2 = new EventEmitter<boolean>();
  @Input() consultar: boolean = false;
  // @Output() dataCR = new EventEmitter<Causa_Raiz[]>();

  pasoSelect = 0;

  selectedNode!: TreeNode;

  public formDesempeno!: FormGroup;
  display: boolean = false;
  displayModal!: boolean;
  selectIdentificacionFC!: Desempeno | null;
  validators: boolean = true;
  steps = [
    { label: 'Dificultad de Desempeño Humano' },
    { label: 'Dificultad del Equipo / Desastre Natural' },
  ];
  jefeForm!: FormGroup;

  identificacionFC: IdentificacionFC[] = [
    { id: 0, factor: "Procedimientos", selectable: null, subProd: [{ id: 1, subProd: "No usado /No seguido", causa: [{ id: 1, ProcedimientoFC: "no hay procedimiento", esCausa: false }, { id: 2, ProcedimientoFC: "procedimiento no disponible o incómodo de usar", esCausa: false }, { id: 3, ProcedimientoFC: "procedimiento difícil de usar", esCausa: false }, { id: 4, ProcedimientoFC: "no se requiere uso de procedimiento, pero debe exigirse", esCausa: false },] }, { id: 2, subProd: "Incorrecto", causa: [{ id: 5, ProcedimientoFC: "error tipográfico", esCausa: false }, { id: 6, ProcedimientoFC: "secuencia incorrecta", esCausa: false }, { id: 7, ProcedimientoFC: "datos incorrectos", esCausa: false }, { id: 8, ProcedimientoFC: "situación no cubierta", esCausa: false }, { id: 9, ProcedimientoFC: "uso de revisión equivocada", esCausa: false }, { id: 10, ProcedimientoFC: "requiere segunda verificación", esCausa: false },] }, { id: 3, subProd: "Seguimiento Incorrecto", causa: [{ id: 11, ProcedimientoFC: "formato confuso", esCausa: false }, { id: 12, ProcedimientoFC: "> 1 acción por paso", esCausa: false }, { id: 13, ProcedimientoFC: "exceso de referencias", esCausa: false }, { id: 14, ProcedimientoFC: "referencias a unidades múltiples", esCausa: false }, { id: 15, ProcedimientoFC: "límites necesita mejora", esCausa: false }, { id: 16, ProcedimientoFC: "detalles necesita mejora", esCausa: false }, { id: 17, ProcedimientoFC: "datos/cálculos incorrectos o incompletos", esCausa: false }, { id: 18, ProcedimientoFC: "gráficos necesita mejora", esCausa: false }, { id: 19, ProcedimientoFC: "no hay verificación", esCausa: false }, { id: 20, ProcedimientoFC: "mal uso de la verificación", esCausa: false }, { id: 21, ProcedimientoFC: "mal uso de segunda verificación", esCausa: false }, { id: 22, ProcedimientoFC: "instrucciones ambiguas", esCausa: false }, { id: 23, ProcedimientoFC: "identificación del equipo necesita mejora", esCausa: false },] },] },
    { id: 1, factor: "Control de Calidad", selectable: null, subProd: [{ id: 6, subProd: "Falta de Inspección", causa: [{ id: 34, ProcedimientoFC: "inspección no requerida", esCausa: false }, { id: 35, ProcedimientoFC: "no hay punto de espera", esCausa: false }, { id: 36, ProcedimientoFC: "punto de espera no se respetó", esCausa: false },] }, { id: 7, subProd: "CC necesita mejora", causa: [{ id: 37, ProcedimientoFC: "instrucciones de inspección necesita mejora", esCausa: false }, { id: 38, ProcedimientoFC: "técnicas de inspección necesita mejora", esCausa: false }, { id: 39, ProcedimientoFC: "eliminación de material extraño durante el trabajo necesita mejora", esCausa: false },] },] },
    { id: 2, factor: "Sistema de Administracion", selectable: null, subProd: [{ id: 14, subProd: "Estándares, Normas o Controles Administrativos necesita mejora (ENCA)", causa: [{ id: 64, ProcedimientoFC: "no hay ENCA", esCausa: false }, { id: 65, ProcedimientoFC: "no son suficientemente estrictos", esCausa: false }, { id: 66, ProcedimientoFC: "confusos o incompletos", esCausa: false }, { id: 67, ProcedimientoFC: "error técnico", esCausa: false }, { id: 68, ProcedimientoFC: "dibujos/láminas necesita mejora", esCausa: false },] }, { id: 15, subProd: "ENCA no Usados", causa: [{ id: 69, ProcedimientoFC: "comunicación de ENCA necesita mejora", esCausa: false }, { id: 70, ProcedimientoFC: "recientemente cambiados", esCausa: false }, { id: 71, ProcedimientoFC: "imposición necesita mejora", esCausa: false }, { id: 72, ProcedimientoFC: "imposible poner en práctica", esCausa: false }, { id: 73, ProcedimientoFC: "Responsabilidad necesita mejora", esCausa: false },] }, { id: 16, subProd: "Descuido/Relaciones de Empleados", causa: [{ id: 74, ProcedimientoFC: "auditorías y evaluaciones infrecuentes", esCausa: false }, { id: 75, ProcedimientoFC: "a & e superficiales", esCausa: false }, { id: 76, ProcedimientoFC: "a & e no independientes", esCausa: false }, { id: 77, ProcedimientoFC: "comunicación con empleados necesita mejora", esCausa: false }, { id: 78, ProcedimientoFC: "retroalimentación de los empleados necesita mejora", esCausa: false },] }, { id: 17, subProd: "Acciones Correctivas", causa: [{ id: 79, ProcedimientoFC: "acción correctiva necesita mejora", esCausa: false }, { id: 80, ProcedimientoFC: "acción correctiva no implementada", esCausa: false }, { id: 81, ProcedimientoFC: "tendencias necesita mejora", esCausa: false },] },] },
    { id: 3, factor: "Capacitacion", selectable: null, subProd: [{ id: 4, subProd: "Falta de Capacitación", causa: [{ id: 24, ProcedimientoFC: "tarea no analizada", esCausa: false }, { id: 25, ProcedimientoFC: "decidió no capacitar", esCausa: false }, { id: 26, ProcedimientoFC: "no hay objetivo de aprendizaje", esCausa: false }, { id: 27, ProcedimientoFC: "inasistencia a la capacitación requerida", esCausa: false },] }, { id: 5, subProd: "Comprensión necesita mejora", causa: [{ id: 28, ProcedimientoFC: "objetivos de aprendizaje necesita mejora", esCausa: false }, { id: 29, ProcedimientoFC: "plan de lección necesita mejora", esCausa: false }, { id: 30, ProcedimientoFC: "instrucción necesita mejora", esCausa: false }, { id: 31, ProcedimientoFC: "práctica/repetición necesita mejora", esCausa: false }, { id: 32, ProcedimientoFC: "exámenes necesita mejora", esCausa: false }, { id: 33, ProcedimientoFC: "capacitación continua necesita mejora", esCausa: false },] },] },
    { id: 4, factor: "Comunicaciones", selectable: null, subProd: [{ id: 8, subProd: "No hay comunicación o No es Oportuna", causa: [{ id: 40, ProcedimientoFC: "equipo de comunicación necesita mejora", esCausa: false }, { id: 41, ProcedimientoFC: "comunicación tardia", esCausa: false },] }, { id: 9, subProd: "Transpaso necesita mejora", causa: [{ id: 42, ProcedimientoFC: "no hay proceso estándar de traspaso", esCausa: false }, { id: 43, ProcedimientoFC: "proceso de traspaso no usado", esCausa: false }, { id: 44, ProcedimientoFC: "proceso de traspaso necesita mejora", esCausa: false },] }, { id: 10, subProd: "Comunicaciones Verbal no entendida", causa: [{ id: 45, ProcedimientoFC: "terminología estándar no usada", esCausa: false }, { id: 46, ProcedimientoFC: "terminología estándar necesita mejora", esCausa: false }, { id: 47, ProcedimientoFC: "repetición verbal no usada", esCausa: false }, { id: 48, ProcedimientoFC: "mensaje largo", esCausa: false }, { id: 49, ProcedimientoFC: "entorno ruidoso", esCausa: false }, { id: 50, ProcedimientoFC: "idioma", esCausa: false },] },] },
    { id: 5, factor: "Psicosocial", selectable: null, subProd: [{ id: 18, subProd: "Calificación", causa: [{ id: 82, ProcedimientoFC: "1", esCausa: false }, { id: 83, ProcedimientoFC: "2", esCausa: false }, { id: 84, ProcedimientoFC: "3", esCausa: false }, { id: 85, ProcedimientoFC: "4", esCausa: false }, { id: 86, ProcedimientoFC: "5", esCausa: false }, { id: 87, ProcedimientoFC: "6", esCausa: false }, { id: 88, ProcedimientoFC: "7", esCausa: false }, { id: 89, ProcedimientoFC: "8", esCausa: false },{ id: 103, ProcedimientoFC: "9", esCausa: false }] },] },
    { id: 6, factor: "Direccion de Trabajo", selectable: null, subProd: [{ id: 11, subProd: "Preparación", causa: [{ id: 51, ProcedimientoFC: "Permiso de trabajo necesita mejora", esCausa: false }, { id: 52, ProcedimientoFC: "Instrucciones previas al trabajo necesita mejora", esCausa: false }, { id: 53, ProcedimientoFC: "Recorrido necesita mejora", esCausa: false }, { id: 54, ProcedimientoFC: "Programación necesita mejora", esCausa: false }, { id: 55, ProcedimientoFC: "Candado/etiqueta necesita mejora", esCausa: false }, { id: 56, ProcedimientoFC: "equipo de protección personal/protección contra caídas necesita mejora", esCausa: false },] }, { id: 12, subProd: "Selección del Trabajador", causa: [{ id: 57, ProcedimientoFC: "no calificado", esCausa: false }, { id: 58, ProcedimientoFC: "Fatigado", esCausa: false }, { id: 59, ProcedimientoFC: "Molesto", esCausa: false }, { id: 60, ProcedimientoFC: "Abuso de drogas", esCausa: false }, { id: 61, ProcedimientoFC: "Selección del equipo necesita mejora", esCausa: false },] }, { id: 13, subProd: "Supervisión durante el trabajo", causa: [{ id: 62, ProcedimientoFC: "no hay supervisión", esCausa: false }, { id: 63, ProcedimientoFC: "Trabajo en equipo necesita mejora", esCausa: false },] },] },

  ]

  questionIndividual: Desempeno[] = [
    { id: 0, pregunta: 'Demandas de trabajo', dq: "Dq1", areas: [this.identificacionFC[5]], selected: null },
    { id: 1, pregunta: 'Demandas de carga mental', dq: "Dq2", areas: [this.identificacionFC[5]], selected: null },
    { id: 2, pregunta: 'Demandas emocionales', dq: "Dq3", areas: [this.identificacionFC[5]], selected: null },
    { id: 3, pregunta: 'Exigencias de responsabilidad del cargo', dq: "Dq4", areas: [this.identificacionFC[5]], selected: null },
    { id: 4, pregunta: 'Demandas ambientales y de esfuerzo físico', dq: "Dq5", areas: [this.identificacionFC[5]], selected: null },
    { id: 5, pregunta: 'Demandas de la jornada de trabajo', dq: "Dq6", areas: [this.identificacionFC[5]], selected: null },
    { id: 6, pregunta: 'Consistencia del rol', dq: "Dq7", areas: [this.identificacionFC[5]], selected: null },
    { id: 7, pregunta: 'Influencia del ambiente laboral sobre el extralaboral', dq: "Dq8", areas: [this.identificacionFC[5]], selected: null },
  ]

  questionTrabajo: Desempeno[] = [
    { id: 8, pregunta: 'Control y autonomia sobre el trabajo', dq: "Dq9", areas: [this.identificacionFC[5]], selected: null },
    { id: 9, pregunta: 'Oportunidades de desarrollo y uso de l habilidades y destrezas', dq: "Dq10", areas: [this.identificacionFC[5]], selected: null },
    { id: 10, pregunta: 'Participacion y manejo del cambio', dq: "Dq11", areas: [this.identificacionFC[5]], selected: null },
    { id: 11, pregunta: 'Claridad del rol', dq: "Dq12", areas: [this.identificacionFC[5]], selected: null },
    { id: 12, pregunta: 'Capacitación', dq: "Dq13", areas: [this.identificacionFC[5]], selected: null },

    
  ]

  questionAdministracion: Desempeno[] = [

    { id: 13, pregunta: '¿Caracteristicas del liderazgo', dq: "Dq14", areas: [this.identificacionFC[5]], selected: null },
    { id: 14, pregunta: 'Relaciones socuales en el trabajo', dq: "Dq15", areas: [this.identificacionFC[5]], selected: null },
    { id: 15, pregunta: 'Retroalimentacion del desempeño', dq: "Dq16", areas: [this.identificacionFC[5]], selected: null },
    { id: 16, pregunta: 'Relacion con los colaboradores (subordinados)', dq: "Dq17", areas: [this.identificacionFC[5]], selected: null },

  ]
  questionRecompensas: Desempeno[] = [

    { id: 17, pregunta: '¿Reconocimiento y recompensacion', dq: "Dq18", areas: [this.identificacionFC[5]], selected: null },
    { id: 18, pregunta: 'Recompensas derivadas de la pertenencia a la organizacion y del trabajo que se realiza', dq: "Dq19", areas: [this.identificacionFC[5]], selected: null },

  ]

  datos: Causa_Raiz[] = [
    { label: 'Dificultad con Equipo', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'Falla Tolerable', expanded: true, type: 'person', data: { name: 'No' }, }, { label: 'Diseño', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'Especificaciones de Diseño', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'Problema no Previsto', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'Ambiente de Trabajo no considerado', expanded: true, type: 'person', data: { name: 'No' }, },] }, { label: 'Diseño no sigue Especificación', expanded: true, type: 'person', data: { name: 'No' }, }, { label: 'Especificación necesita mejora', expanded: true, type: 'person', data: { name: 'No' }, },] }, { label: 'Revisión de Diseño', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'Revisión Independiente necesita mejora', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'Administración del Cambio necesita mejora', expanded: true, type: 'person', data: { name: 'No' }, children: [{ label: 'Análisis de Riesgo necesita mejora', expanded: true, type: 'person', data: { name: 'No' }, },] },] },] },] }, { label: 'Equipos / Partes Defectuosas', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'Abastecimientos', expanded: true, type: 'person', data: { name: 'No' }, children: [{ label: 'Manufactura', expanded: true, type: 'person', data: { name: 'No' }, children: [{ label: 'Almacenamiento', expanded: true, type: 'person', data: { name: 'No' }, children: [{ label: 'Control de Calidad', expanded: true, type: 'person', data: { name: 'No' }, },] },] },] },] }, { label: 'Mantenimiento Preventivo / Predictivo', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'MP necesita mejora', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'No MP p/Equipo', expanded: true, type: 'person', data: { name: 'No' }, }, { label: 'MP necesita mejora p/Equipo', expanded: true, type: 'person', data: { name: 'No' }, },] },] }, { label: 'Falla Repetida', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'Sistema de Administración', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'Acción Correctiva', expanded: true, type: 'person', data: { name: '' }, children: [{ label: 'Acción correctiva necesita mejora', expanded: true, type: 'person', data: { name: 'No' }, }, { label: 'Acción correctiva No Implementada', expanded: true, type: 'person', data: { name: 'No' }, }, { label: 'Tendencias necesita mejora', expanded: true, type: 'person', data: { name: 'No' }, },] },] },] },] },
    { label: 'Desastre Natural / Sabotaje', type: 'person', expanded: true, data: { name: 'No' }, }
  ]

  data1!: TreeNode[];
  data2!: TreeNode[];
  cx = false;
  selectedValue: any;
  isSelectionable!: boolean;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.validacion();
    this.validator();
  }

  validator() {
    this.validators2.emit(this.validators)
  }
  ngAfterViewInit() {

    if (!this.factorCausal.seccion) {
      this.addDataFC();
    }

    if (!this.factorCausal.causa_Raiz) {
      this.factorCausal.causa_Raiz = this.datos
    }

  }

  addDataFC() {

    let datos: seccion[] = [
      { tipoDesempeno: 'DEMANDAS DE TRABAJO', desempeno: this.questionIndividual },
      { tipoDesempeno: 'CONTROL SOBRE EL TRABAJO', desempeno: this.questionTrabajo },
      { tipoDesempeno: 'LIDERAZGO Y RELACIONES SOCIALES EN EL TRABAJO', desempeno: this.questionAdministracion },
      {tipoDesempeno: 'RECOMPENSAS', desempeno: this.questionRecompensas}
    ]

    let temp = JSON.stringify(datos)

    this.factorCausal.seccion = JSON.parse(temp)// datos;
  }


  next() {
    this.validacion();
    if (this.validators) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Faltan campos por responder' });
    } else {
      this.pasoSelect++;
    }

  }

  back() {
    this.pasoSelect--;
  }

  changeSelection(id: number, selection: boolean) {

    if (id < 8) {
      this.factorCausal.seccion![0].desempeno[id].selected = selection;
      if (selection) {
        this.showDialog(this.factorCausal.seccion![0].desempeno[id]);
      }
    } else if (id < 13) {
      this.factorCausal.seccion![1].desempeno[id - 8].selected = selection;
      if (selection) {
        this.showDialog(this.factorCausal.seccion![1].desempeno[id - 8]);
      }
    }else if (id < 17) {
      this.factorCausal.seccion![2].desempeno[id - 13].selected = selection;
      if (selection) {
        this.showDialog(this.factorCausal.seccion![2].desempeno[id - 13]);
      }
    }
     else {
      this.factorCausal.seccion![3].desempeno[id - 17].selected = selection;
      if (selection) {
        this.showDialog(this.factorCausal.seccion![3].desempeno[id - 17]);
      }
    }

    this.dataFC.emit(this.factorCausal);

    this.validacion();
    this.validator();
  }

  validacion() {
    let validacion1, validacion2, validacion3, validacion4: boolean = false;

    if (this.factorCausal.seccion) {
      for (let index = 0; index < this.factorCausal.seccion[0].desempeno.length; index++) {
        if (this.factorCausal.seccion[0].desempeno[index].selected == null) {
          validacion1 = true;
          break;
        }
      }

      for (let index = 0; index < this.factorCausal.seccion[1].desempeno.length; index++) {
        if (this.factorCausal.seccion[1].desempeno[index].selected == null) {
          validacion2 = true;
          break;
        }
      }

      for (let index = 0; index < this.factorCausal.seccion[2].desempeno.length; index++) {
        if (this.factorCausal.seccion[2].desempeno[index].selected == null) {
          validacion3 = true;
          break;
        }
      }
      for (let index = 0; index < this.factorCausal.seccion[3].desempeno.length; index++) {
        if (this.factorCausal.seccion[3].desempeno[index].selected == null) {
          validacion4 = true;
          break;
        }
      }
    }
    if (validacion1 || validacion2 || validacion3 || validacion4) {
      this.validators = true;
    } else {
      this.validators = false;
    }

  }


  confirm() {
    this.confirmationService.confirm({
      // message: 'Are you sure that you want to perform this action?',
      accept: () => {
        //Actual logic to perform a confirmation
      }
    });
  }

  showDialog(item: any) {
    this.isSelectionable = false;
    this.selectIdentificacionFC = item;
    this.display = true;
  }



  onNodeSelect(event: any) {
    if (!this.consultar) {
      if (event.node.data.name == 'No') {
        event.node.data.name = 'Si'
      } else if (event.node.data.name == 'Si') {
        event.node.data.name = 'No'
      }
      this.dataFC.emit(this.factorCausal);
    }
  }


  confirmCheck() {
    let control: boolean = false
    this.selectIdentificacionFC?.areas?.forEach(element =>
      element.subProd.forEach(eleme => {
        eleme.causa.forEach(ele => {
          if (ele.esCausa) {
            control = ele.esCausa;
          }
        })
      })
    )

    if (control) {
      this.dataFC.emit(this.factorCausal);

      this.display = false
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se ha seleccionado ninguna identificacion del factor' });

    }

  }

  cancelCheck() {
    this.display = false
    this.selectIdentificacionFC!.selected = false;

  }

}