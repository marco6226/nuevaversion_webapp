import { Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Empresa } from '../../../empresa/entities/empresa';
import { SesionService } from '../../../core/services/session.service';
import { ActivatedRoute,Router } from "@angular/router";
import { firmaservice } from 'src/app/website/pages/core/services/firmas.service';
import{firma} from 'src/app/website/pages/comun/entities/firma'
import {formatDate} from '@angular/common';
import { Message } from 'primeng/api';


@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.scss']
})
export class FirmaComponent implements OnInit{
  title = 'signatureJS';
  signaturePad?: SignaturePad;
  @ViewChild('canvas') canvasEl?: ElementRef;
  signatureImg?: string;
  empresaSelect?: Empresa | null;
  datosFirma?:any=[];
  estadoFirma?:string
  msgs?: Message[];

  firma?:any;
  visibleDlg:boolean =true

  nombre?:string;
  cedula?:number;

  constructor(
    private sesionService: SesionService,
    private route: ActivatedRoute,
    private router:Router,
    private firmaservice:firmaservice
  ) { }
  public async ngOnInit(){
    
    this.estadoFirma='firmar'
    await this.firmaservice.findById(atob(this.route.snapshot.params["id"])).then((resp:any)=>{
      this.datosFirma=resp

      if(this.datosFirma.terminoscondiciones!=null){
        if(!this.datosFirma.terminoscondiciones){
          this.estadoFirma='noterminos'
          return
        }else{
          this.visibleDlg=false
        }
      }

      if(!this.datosFirma.firma){
        let dateToday=new Date()
        dateToday=new Date(formatDate(new Date(), 'yyyy/MM/dd', 'en'))
        if(new Date(new Date(this.datosFirma.fechacreacion)!.getTime() + (1000 * 60 * 60 * 24)) < new Date()){
          if(this.datosFirma.fecharenovacion){
            if(new Date(new Date(this.datosFirma.fecharenovacion)!.getTime() + (1000 * 60 * 60 * 24)) < new Date()){
              this.estadoFirma='firmavencida'
              return
            }
          }else{
            this.estadoFirma='firmavencida'
            return
          }
        }
        this.estadoFirma='firmar'
        setTimeout(() => {
          this.lenghtWidows()
          this.signaturePad = new SignaturePad(this.canvasEl!.nativeElement);
        }, 1000);
      }else{
        this.estadoFirma='firmado'
      }
    })
  }

  lenghtWidows(){
    var windowWidth = (window.innerWidth*0.75).toString();
    var windowHeight = (window.innerHeight*0.65).toString();
    document.getElementById('tamcanvas')!.setAttribute("height", windowHeight);
    document.getElementById('tamcanvas')!.setAttribute("width", windowWidth);
  }
  ngAfterViewInit() {
    
  }

  startDrawing(event: Event) {

    // works in device not in browser

  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad!.clear();
  }

  savePad() {

    this.firma = this.signaturePad!.toDataURL();
    let firm = new firma()
    firm.id =this.datosFirma.id
    firm.firma=this.firma
    firm.idempresa=this.datosFirma.idempresa;
    firm.fechacreacion=this.datosFirma.fechacreacion;
    firm.idrelacionado=this.datosFirma.idrelacionado;
    firm.email=this.datosFirma.email;
    firm.idusuario=this.datosFirma.idusuario;
    firm.terminoscondiciones=this.datosFirma.terminoscondiciones;
    firm.fechaterminos= this.datosFirma.fechaterminos
    firm.nombre=this.datosFirma.nombre
    firm.cedula=this.datosFirma.cedula
    firm.fecharenovacion=this.datosFirma.fecharenovacion

    this.firmaservice.update(firm).then(resp=>{
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Firma guardada', detail: 'Se ha guardado correctamente la firma' });
    }).catch(er=>{})
  }

  terminosyCondiciones(flagTerminos:boolean){
    console.log(this.nombre)
    console.log(this.cedula)
    this.firma = this.signaturePad!.toDataURL();
    let firm = new firma()
    firm.id =this.datosFirma.id
    firm.idempresa=this.datosFirma.idempresa;
    firm.fechacreacion=this.datosFirma.fechacreacion;
    firm.idrelacionado=this.datosFirma.idrelacionado;
    firm.email=this.datosFirma.email;
    firm.idusuario=this.datosFirma.idusuario;
    firm.terminoscondiciones=flagTerminos;
    firm.fechaterminos=new Date()
    firm.nombre=this.nombre
    firm.cedula=this.cedula
    firm.fecharenovacion=this.datosFirma.fecharenovacion

    this.firmaservice.update(firm).then(resp=>this.datosFirma=resp).catch(er=>{})

    if(!flagTerminos){
      this.estadoFirma='noterminos'
    }
    this.visibleDlg=false
  }

  flagNombre:boolean=true
  flagCedula:boolean=true
  input(){

    if(this.nombre)this.flagNombre=(this.nombre.length>7)?false:true
    if(this.cedula)this.flagCedula=((this.cedula.toString()).length>3)?false:true

  }
}
