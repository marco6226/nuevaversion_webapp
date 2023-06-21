import { Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Empresa } from '../../../empresa/entities/empresa';
import { SesionService } from '../../../core/services/session.service';
import { ActivatedRoute,Router } from "@angular/router";
import { firmaservice } from 'src/app/website/pages/core/services/firmas.service';
import{firma} from 'src/app/website/pages/comun/entities/firma'
import {formatDate} from '@angular/common';


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

  firma?:any;
  visibleDlg:boolean =true

  constructor(
    private sesionService: SesionService,
    private route: ActivatedRoute,
    private router:Router,
    private firmaservice:firmaservice
  ) { }
  public async ngOnInit(){
    
    this.estadoFirma='noexiste'
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

        if(new Date(this.datosFirma.fechacreacion) < dateToday){
          this.estadoFirma='firmavencida'
          return
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
    console.log(event);
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
    firm.fechaterminos=this.datosFirma.terminoscondiciones

    this.firmaservice.update(firm).then(resp=>console.log(resp)).catch(er=>
      console.log(er))
  }

  terminosyCondiciones(flagTerminos:boolean){
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

    this.firmaservice.update(firm).then(resp=>console.log(resp)).catch(er=>
      console.log(er))

    if(!flagTerminos){
      this.estadoFirma='noterminos'
    }
    this.visibleDlg=false
  }
}
