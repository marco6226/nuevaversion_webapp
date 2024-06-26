import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subcontratista } from '../../entities/aliados';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Modulo } from '../../../core/enums/enumeraciones';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { Directorio } from '../../../ado/entities/directorio';
import { Documento } from '../../../ado/entities/documento';

@Component({
  selector: 'app-subcontratistas',
  templateUrl: './subcontratistas.component.html',
  styleUrls: ['./subcontratistas.component.scss'],
  providers: [EmpresaService, DirectorioService]
})
export class SubcontratistasComponent implements OnInit {
  @Input() flagConsult: boolean = false;
  @Input() onEdit: string | null = null;
  nit!: number;
  nombre!: string;
  actividadesRiesgo: object[] = [
    {
      label: 'Trabajo en alturas',
      value: 'Trabajo en alturas'
    },
    {
      label: 'Trabajo en espacios confinados',
      value: 'Trabajo en espacios confinados'
    },
    {
      label: 'Trabajo con energías peligrosas',
      value: 'Trabajo con energías peligrosas'
    },
    {
      label: 'Izaje de cargas',
      value: 'Izaje de cargas'
    },
    {
      label: 'Trabajos en caliente',
      value: 'Trabajos en caliente'
    },
  ];
  selectedActividades: string[] = [];
  porcentajeCertArl!: number;
  estado!: string;
  cartaAutorizacion!: string;
  subcontratistasForm: any;
  @Input() aliadoId: number | null = null;
  subcontratistasList: Subcontratista[] = [];
  selectedSubcontratista!: Subcontratista | null;
  displayDialog: boolean = false;
  dialogCarta: boolean = false;
  modulo: String = Modulo.EMPRESA.value;
  directoriosSubcontratistas: any = {};
  documentosSubcontratistas: any = {};
  contratistasFlag: boolean=true;

  constructor(
    private empresaService: EmpresaService,
    private directorioService: DirectorioService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.fetchSubcontratistasList().then(()=>{
    });
  }

  createSubcontratista(){
    this.displayDialog = true;
  }

  editSubcontratista(){
    this.displayDialog = true;
  }

  closeFormSubcontratista(onCancelar: boolean){
    if(onCancelar){
      this.displayDialog = false;
    }else{
      this.displayDialog = false;
      this.fetchSubcontratistasList().then(()=>{
        this.messageService.add({key: 'msgSubcontratista', severity:'success', summary: 'Guardado', detail: 'Se guardó subcontratista'});
      });
    }
  }

  async fetchSubcontratistasList(){
    await this.empresaService.getSubcontratistas(this.activatedRoute.snapshot.params['id'])
      .then(
        (res: Subcontratista[]) => {
          this.subcontratistasList = res.reverse();
          this.loadDocumentos();
        }
      );
  }

  getActividadesAltoRiesgoFromObject(data: string){
    let aux: string[] = [];

    let dataAux = JSON.parse(data)
    dataAux.forEach( (element:any) => {
      aux.push(element.value);
    });

    return aux.join(', ');
  }

  getEstadoFromObject(data: string){
    let aux = JSON.parse(data);
    return aux.value;
  }

  showDialogCarta(){
    this.dialogCarta= true;
  }

  onUpload(event: Directorio, id: number){
    if(!this.documentosSubcontratistas['doc_'+id]){
      this.documentosSubcontratistas['doc_'+id] = [];
    }
    if(!this.directoriosSubcontratistas['dir_'+id]){
      this.directoriosSubcontratistas['dir_'+id] = [];
    }

    this.directoriosSubcontratistas['dir_'+id].push(event);
    this.documentosSubcontratistas['doc_'+id].push(event.documento)
    this.documentosSubcontratistas['doc_'+id] = this.documentosSubcontratistas['doc_'+id].slice();

    let subc: Subcontratista = this.subcontratistasList
                .filter((item: Subcontratista) => item.id == id)
                .map((item2: Subcontratista) => {
                  let carta = JSON.parse(item2.carta_autorizacion!);
                  if(carta == null) carta = [];
                  carta.push(event.id);
                  return {
                    id: item2.id,
                    nit: item2.nit,
                    nombre: item2.nombre,
                    actividades_riesgo: item2.actividades_riesgo,
                    tipo_persona: item2.tipo_persona,
                    porcentaje_arl: item2.porcentaje_arl,
                    estado: item2.estado,
                    carta_autorizacion: JSON.stringify(carta),
                    id_aliado_creador: item2.id_aliado_creador,
                  }
                })[0];
    this.empresaService
      .updateSubcontratista(subc)
      .then(()=>{
        this.fetchSubcontratistasList().then();
        this.messageService.add({key: 'msgSubcontratista', severity:'success', summary: 'Guardado', detail: 'Se guardó su soprte'});
      });
  }

  loadDocumentos(){
    this.subcontratistasList.forEach(subcontratista => {
      if(subcontratista.carta_autorizacion != null){
        this.directoriosSubcontratistas['dir_'+subcontratista.id] = [];
        JSON.parse(subcontratista.carta_autorizacion)
          .forEach(async (element: any) => {
            await this.directorioService.buscarDocumentosById(element).then((elem: Directorio[]) => {
              this.directoriosSubcontratistas['dir_'+subcontratista.id].push(elem[0]);
            });
          });
      }
    });
  }

  descargarDocumento(doc: Documento){
    this.directorioService.download(doc.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink?.setAttribute("href", url);
          dwldLink?.setAttribute("download", doc.nombre);
          dwldLink?.click();
        }
      }
    );
  }

  testFunction(data: any){
  }

  eliminarDocument(doc: Documento, id: number) {
    this.confirmationService.confirm({
      key: 'confirmDelete',
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.directorioService.eliminarDocumento(doc.id)
          .then(
            data => {
              this.directoriosSubcontratistas['dir_'+id]=this.directoriosSubcontratistas['dir_'+id].filter((val: any) => val.id !== doc.id);
              let subc: Subcontratista = this.subcontratistasList
              .filter((item: Subcontratista) => item.id == id)
              .map((item2: Subcontratista) => {
                let carta = JSON.parse(item2.carta_autorizacion!);
                if(carta == null) carta = [];
                carta=carta.filter((val: any) => val !== doc.id);
                return {
                  id: item2.id,
                  nit: item2.nit,
                  nombre: item2.nombre,
                  actividades_riesgo: item2.actividades_riesgo,
                  tipo_persona: item2.tipo_persona,
                  porcentaje_arl: item2.porcentaje_arl,
                  estado: item2.estado,
                  carta_autorizacion: JSON.stringify(carta),
                  id_aliado_creador: item2.id_aliado_creador,
                }
              })[0];
              this.empresaService
              .updateSubcontratista(subc)
              .then(()=>{
                this.fetchSubcontratistasList().then();
                this.messageService.add({key: 'msgSubcontratista',severity:'success', summary: 'Eliminado', detail: 'Se elimino el soprte'});
                });   
            })
      },
      reject: () => {
        this.confirmationService.close();
      }
  });
  }
}
