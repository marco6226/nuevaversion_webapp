import { Component, OnInit } from '@angular/core';
import {ViewscmgeService} from "src/app/website/pages/core/services/indicador-scmge.service"
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "src/app/website/pages/core/entities/filter";
import { Filter, Criteria } from 'src/app/website/pages/core/entities/filter';
import { Area } from 'src/app/website/pages/empresa/entities/area';
import { AreaService } from "src/app/website/pages/empresa/services/area.service";
import { SelectItem, Message, TreeNode } from 'primeng/api';
import { locale_es } from "../../../comun/entities/reporte-enumeraciones";

@Component({
  selector: 'app-ind-casos-medicos-gestion',
  templateUrl: './ind-casos-medicos-gestion.component.html',
  styleUrls: ['./ind-casos-medicos-gestion.component.scss']
})
export class IndCasosMedicosGestionComponent implements OnInit {

//comun
localeES = locale_es;
datos?:any[];

areasNodes: TreeNode[] = [];

divisiones_=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas','Corona total'];
divisiones=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas'];
divisiones1:any=[]

entidades=['EPS','ARL','AFP','Junta Regional','Junta Nacional']
entidades0:any=[]

colorScheme = {
  domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
};

rangoFechaEdad=['18 a 25 años','26 a 35 años','36 a 45 años','46 a 59 años','60 años en adelante']
rangoFechaEdad2=[[18,25],[26,35],[36,45],[46,59],[60,200]]
rangoFechaEdadArray:any=[]
rangoFechaAntiguedad=['0 a 1 años','2 a 5 años','6 a 10 años','11 a 20 años','21 a 30 años','31 años en adelante']
rangoFechaAntiguedad2=[[0,1],[2,5],[6,10],[11,20],[21,30],[31,100]]
rangoFechaAntiguedadArray:any=[]
rangoMeses=['0 a 1 mes','2 a 5 meses','6 a 10 meses','11 a 20 meses','21 a 30 meses','31 meses en adelante']
rangoMeses2=[[0,1],[2,5],[6,10],[11,20],[21,30],[31,100]]
rangoMesesArray:any=[]


//grafica uno
flag1:boolean=false

divisiones0:any=[]
radioButon1:number=0;
opcion1?:any;

selectDivisiones1:any=[]
selectEvento1:any=[]

fechaDesde1?:Date;
fechaHasta1?:Date;

datosGraf1:any;
datosGraf1Print:any;

nameGraf1:string='Antiguedad'

//grafica dos
flag2:boolean=false

radioButon2:number=0;
opcion2?:any;

selectDivisiones2:any=[]
selectEvento2:any=[]

fechaDesde2?:Date;
fechaHasta2?:Date;

datosGraf2:any;
datosGraf2Print:any;
sumdatosGraf2Print:any;

nameGraf2?:string

entidadTipos0=[
  {label: 'EPS', value:'EPS'},
  {label: 'ARL', value:'ARL'}
]

entidadTipos1=[
  {label: 'EPS', value:'EPS'},
  {label: 'ARL', value:'ARL'},
  {label: 'AFP', value:'AFP'}
]

entidadTipos2=[
  {label: 'EPS', value:'EPS'},
  {label: 'ARL', value:'ARL'},
  {label: 'AFP', value:'AFP'},
  {label: 'Junta Regional', value:'Junta Regional'},
  {label: 'Junta Nacional', value:'Junta Nacional'}
]

//grafica tres
flag3:boolean=false

radioButon3:number=0;
opcion3?:any;

selectDivisiones3:any=[]
selectEvento3:any=[]

fechaDesde3?:Date;
fechaHasta3?:Date;

datosGraf3?:any;
datosGraf3Print:any;

nameGraf3:string='Antiguedad'

//grafica tres
flag4:boolean=true
flagReturnDatos4:boolean=false
visibleDlg4:boolean=false

radioButon4:number=0;
opcion4?:any;

selectDivisiones4:any=[]
selectUbicacion4:any=[]
selectUbicacion_4:any=[]
selectEvento4:any=[]

areasNodesMemory4: TreeNode[] = [];

fechaDesde4?:Date;
fechaHasta4?:Date;

datosGraf4:any;
datosGraf4Print:any;

valueArray_4?:any[]
valueArray4?:any[]
scmList4?:any

conteo=[
  {label: 'Recomendación', value:'recomendacion'},
  {label: 'Plan de acción', value:'planAccion'},
  {label: 'Seguimiento', value:'seguimiento'},
  {label: 'Documento', value:'documento'}
]

constructor(
  private ViewscmgeService: ViewscmgeService,
  private areaService: AreaService,
) { }

async ngOnInit() {
  await this.cargarDatos()
  this.DatosGrafica1()
  this.DatosGrafica2()
  this.DatosGrafica3()
  this.loadAreas()
}

// Primera grafica
DatosGrafica1(){
  this.flag1=false
  this.datosGraf1=Array.from(this.datos!)
  this.datosGraf1=this.filtroFecha(this.fechaDesde1!,this.fechaHasta1!,this.datosGraf1)
  let fecha1=''
  let fecha2=''
  let rango
  let unidadTiempo='anio'
  if(this.radioButon1==0){this.opcion1=this.rangoFechaAntiguedadArray;fecha1='fechaIngreso';fecha2='hoy';this.nameGraf1='Antiguedad';rango=Array.from(this.rangoFechaAntiguedad2)}
  if(this.radioButon1==1){this.opcion1=this.rangoFechaEdadArray;fecha1='fechaNacimiento';fecha2='hoy';this.nameGraf1='Edad';rango=Array.from(this.rangoFechaEdad2)}
  if(this.radioButon1==2){unidadTiempo='mes';this.opcion1=this.rangoMesesArray;fecha1='fechaCreacion';fecha2='fechaFinal';this.nameGraf1='Fecha cierre - Fecha creación';rango=Array.from(this.rangoMeses2)}
  if(this.radioButon1==3){unidadTiempo='mes';this.opcion1=this.rangoMesesArray;fecha1='fechaDiagnostico';fecha2='emisionPclFecha';this.nameGraf1='Fecha diagnostico - Fecha PCL';rango=Array.from(this.rangoMeses2)}
  if(this.radioButon1==4){unidadTiempo='mes';this.opcion1=this.rangoMesesArray;fecha1='fechaDiagnostico';fecha2='fechaOrigen';this.nameGraf1='Fecha diagnostico - Fecha origen';rango=Array.from(this.rangoMeses2)}

  let divisiones=this.filtroDivisionMultiple(this.selectDivisiones1,this.divisiones1)

  let opcion1=this.filtroEventoMultiple(this.selectEvento1,this.opcion1)

  let rangofil=this.filtroRangoMultiple(this.selectEvento1,this.opcion1,rango)

  this.datosGraf1Print=this.datosGraf2DDivisionesRangos(divisiones,this.datosGraf1,opcion1,rangofil,fecha1,fecha2,unidadTiempo,'divisionUnidad')
  this.flag1=true
}
returnDatos1(){
  this.selectEvento1=[]
  this.selectDivisiones1=[]
  this.DatosGrafica1()
}

//Segunda grafica
DatosGrafica2(){
  this.flag2=false
  this.datosGraf2=Array.from(this.datos!)
  this.datosGraf2=this.filtroFecha(this.fechaDesde2!,this.fechaHasta2!,this.datosGraf2)
  // this.datosGraf2.map(resp=>{if(resp['tipoRetorno']==null){return resp['tipoRetorno']='null'}})
  
  let nombre:any=[]
  if(this.radioButon2==0){this.opcion2=this.entidadTipos0;nombre=['entidadEmiteConceptoRehabilitacion'];this.nameGraf2='ENTIDAD RESPONSABLE DE LA REHABILITACIÓN'}
  if(this.radioButon2==1){this.opcion2=this.entidadTipos2;nombre=['entidadEmitePcl'];this.nameGraf2='ENTIDAD RESPONSABLE DE LA PCL'}
  if(this.radioButon2==2){this.opcion2=this.entidadTipos2;nombre=['entidadEmiteOrigen'];this.nameGraf2='ENTIDAD RESPONSABLE DEL ORIGEN'}
  if(this.radioButon2==3){this.opcion2=this.entidadTipos2;nombre=['entidadEmiteConceptoRehabilitacion','entidadEmitePcl','entidadEmiteOrigen'];this.nameGraf2='TODOS'}

  let divisiones=this.filtroDivisionMultiple(this.selectDivisiones2,(this.radioButon2==3)?this.divisiones:this.divisiones_)

  let opcion2=this.filtroEventoMultiple(this.selectEvento2,this.opcion2)

  this.sumdatosGraf2Print=null
  let datosGraf2Print:any

  nombre.forEach((nom:any)=>{
    datosGraf2Print=this.datosGraf2DDivisiones(divisiones,this.datosGraf2,opcion2,nom,'divisionUnidad')
    this.sumdatosGraf2Print=this.SumdatosGraf2DDivisiones(divisiones,this.datosGraf2,opcion2,nom,'divisionUnidad',this.sumdatosGraf2Print)
  })

  this.datosGraf2Print=nombre.length==1?Array.from(datosGraf2Print!):Array.from(this.sumdatosGraf2Print)

  if(this.radioButon2==3)this.datosGraf2Print=this.contTotal(this.datosGraf2Print)
  this.flag2=true
}

returnDatos2(){
  this.selectEvento2=[]
  this.selectDivisiones2=[]
  this.DatosGrafica2()
}

// Tercera grafica
DatosGrafica3(){
  this.flag3=false
  this.datosGraf3=Array.from(this.datos!)
  this.datosGraf3=this.filtroFecha(this.fechaDesde3!,this.fechaHasta3!,this.datosGraf3)

  this.opcion3=this.conteo;

  let divisiones=this.filtroDivisionMultiple(this.selectDivisiones3,this.divisiones_)

  let opcion3=this.filtroEventoMultiple(this.selectEvento3,this.opcion3)

  this.datosGraf3Print=this.datosGraf2DDivisiones2(divisiones,this.datosGraf3,opcion3,'divisionUnidad')
  // this.datosGraf3Print=this.contTotal(this.datosGraf3Print)

  this.flag3=true
}
returnDatos3(){
  this.selectEvento3=[]
  this.selectDivisiones3=[]
  this.DatosGrafica3()
}

// Cuarta grafica
DatosGrafica4(){
  this.flagReturnDatos4=true
  this.flag4=false
  this.datosGraf4=Array.from(this.datos!)
  if(this.selectDivisiones4.length>0)this.datosGraf4=this.datosGraf4.filter((resp:any)=>resp.divisionUnidad==this.selectDivisiones4)

  this.datosGraf4=this.filtroFecha(this.fechaDesde4!,this.fechaHasta4!,this.datosGraf4)
  // this.datosGraf4.map(resp=>{if(resp['tipoRetorno']==null){return resp['tipoRetorno']='null'}})

  this.opcion4=this.conteo;

  let plantas:any=[]
  let map=new Map()
  this.datosGraf4.forEach((resp:any)=>{
    if(!map.has(resp['ubicacion']) && resp['divisionUnidad']==this.selectDivisiones4){
      map.set(resp['ubicacion'],0)
      plantas.push(resp['ubicacion'])}
  })
  let opcion4=this.filtroEventoMultiple(this.selectEvento4,this.opcion4)
  if(this.selectUbicacion4.length==0){
    this.datosGraf4Print=this.datosGraf2DDivisiones2(plantas,this.datosGraf4,opcion4,'ubicacion')
    this.datosGraf4Print=this.top2(this.datosGraf4Print,10)
    this.datosGraf4Print=this.top(this.datosGraf4Print,10)
  }else{
    this.agregarDivision4(opcion4)
  }
  this.flag4=true
}

cargarArea4(){
  this.selectUbicacion4=[]
  this.areasNodesMemory4=Array.from(this.areasNodes)
  let areasNodesChildren=this.areasNodesMemory4[0]['children']!.filter(resp=>resp.label==this.selectDivisiones4)
  this.areasNodesMemory4=[{children:areasNodesChildren[0]['children'],expanded:false,label:"",parent:undefined, selectable:false}]
  this.DatosGrafica4()
}

sumAreaSelect4(scm:any,opcion:any,flag:any,datos:any){
  let datos0=datos
  let datos0_1
  if(flag){
    this.valueArray_4=[]
    opcion.forEach((resp:any)=>{
      this.valueArray_4!.push({name:resp.label,value:0})
    })
    this.scmList4=scm.label
  }

  this.selectUbicacion_4.map((resp:any)=>{
    if(resp.label===scm.label){
      resp.flag=true
    }
  })


  datos0=datos0.filter((resp:any)=>{return resp.ubicacion==scm.label})
  opcion.forEach((resp:any)=>{
    datos0_1=datos0.filter((resp1:any)=>{return resp1[resp.value]!=null})
    const indice=this.valueArray_4!.findIndex(el => el.name == resp.label )
    this.valueArray_4![indice].value=this.valueArray_4![indice].value+datos0_1.length;
  })

  if(scm.children.length>0){
    scm.children.forEach((resp:any)=>{
      this.sumAreaSelect4(resp,opcion,false,datos)
    })
  }
}

cerrarDialogo4(){
  this.visibleDlg4 = false;
}

abrirDialogo4(){
  this.visibleDlg4 = true;
}

agregarDivision4(opcion:any){
  this.opcion4=this.conteo
  
  this.selectUbicacion4=this.order2(this.selectUbicacion4)
  this.selectUbicacion4=this.selectUbicacion4.filter((resp:any)=>resp.label!="")
  this.selectUbicacion_4=[]
  this.selectUbicacion4.forEach((resp:any)=>{
    this.selectUbicacion_4.push({
      id:resp.key,
      label:resp.label,
      children:resp.children,
      flag:false
    })
  })

  this.valueArray4=[]
  this.selectUbicacion_4.forEach((resp:any)=>{
    if(resp.flag==false){
      this.sumAreaSelect4(resp,opcion,true,this.datosGraf4)
      this.valueArray4!.push({name:this.scmList4,series:this.valueArray_4})
    }
  })

  this.datosGraf4Print=this.valueArray4
  this.cerrarDialogo4();

}

//codigo comun
difAnios(date:any, otherDate:any):Number{
  var tiempo=Math.abs(otherDate.getTime() - date.getTime())
  var anios = (Math.floor(tiempo / (1000 * 60 * 60 * 24)))/365;
  return Math.floor(anios)
}

difmeses(date:any, otherDate:any):Number{
  var tiempo=Math.abs(otherDate.getTime() - date.getTime())
  var meses = (Math.floor(tiempo / (1000 * 60 * 60 * 24)))/30;
  return Math.floor(meses)
}

async cargarDatos(){
  this.divisiones.forEach(resp=>{
    this.divisiones0.push({label:resp,value:resp})
    this.divisiones1.push(resp)
  })
  this.divisiones1.push('Corona total')

  this.rangoFechaEdad.forEach(resp=>{
    this.rangoFechaEdadArray.push({label:resp,value:resp})
  })

  this.rangoFechaAntiguedad.forEach(resp=>{
    this.rangoFechaAntiguedadArray.push({label:resp,value:resp})
  })

  this.rangoMeses.forEach(resp=>{
    this.rangoMesesArray.push({label:resp,value:resp})
  })

  this.entidades.forEach(resp=>{
    this.entidades0.push({label:resp,value:resp})
  })
  this.entidades0.push('Corona total')

  this.divisiones0.push({label:'Corona total',value:'Corona total'})
  await this.ViewscmgeService.findByEmpresaId().then((resp:any)=>{
    this.datos=resp
  })
}

filtroFecha(fechaDesde:Date,fechaHasta:Date,datos:any){
  let datos0
  if(fechaHasta)fechaHasta=new Date(new Date(fechaHasta).setMonth(new Date(fechaHasta).getMonth()+1))

  if(fechaDesde && fechaHasta){
    datos0=datos.filter((resp:any)=>{return new Date(resp.fechaCreacion)>=fechaDesde && new Date(resp.fechaCreacion)<fechaHasta})
  }
  else if(fechaDesde){
    datos0=datos.filter((resp:any)=>{return new Date(resp.fechaCreacion)>=fechaDesde})
  }
  else if(fechaHasta){
    datos0=datos.filter((resp:any)=>{return new Date(resp.fechaCreacion)<fechaHasta})
  }
  else{
    datos0=datos
  }
  return datos0
}

filtroDivisionMono(selecDiv:any,datos:any){
  let datos0=[]
  if(selecDiv.length>0){
    if(selecDiv=='Corona total'){
      datos0=datos
    }else{
      datos0=datos.filter((resp1:any)=>{
        return resp1['divisionUnidad']==selecDiv
      })
    }
  }else{
    datos0=datos
  }
  return datos0
}

filtroDivisionMultiple(selecDiv:any,div:any){
  let divisiones=[]
  if(selecDiv.length>0){
    selecDiv.forEach((element:any) => {
      let div1=div.filter((resp:any)=>resp==element.label)
      divisiones.push(div1)
    });
  }else{
    divisiones=div
  }
  return divisiones
}

filtroEventoMultiple(selecEve:any,eve:any){
 let opcion1=[]
  if(selecEve.length>0){
    selecEve.forEach((element:any) => {
      let op=eve.filter((resp:any)=>resp.label==element.label)
      opcion1.push(op[0])
    });
  }else{
    opcion1=eve
  }  
  return opcion1 
}

filtroRangoMultiple(selecEve:any,eve:any,rango:any){

  let opcion1:any=[]
  if(selecEve.length>0){
    selecEve.forEach((resp:any)=>{
      const index = eve.findIndex((el:any) => el.label == resp.label)
      opcion1.push(rango[index])
    })
  }else{
    opcion1=Array.from(rango)
  } 

   return opcion1 
 }

SumdatosGraf2DDivisiones(division:any,datos:any,opciones:any,nombre:string,div:string,datossum:any){
  let datos0=datos
  let datos0_1:any=[]
  let datos0_2:any=[]

  opciones.forEach((resp:any)=>{
    datos0_2.push({name:resp.label,value:0})
  })

  division.forEach((resp:any)=>{
    if(resp!='Corona total')datos0_1.push({name:resp,series:datos0_2})
  })

  let datos0_coronaTotal=[{name:'Corona total',series:datos0_2}]
  const index = division.findIndex((el:any) => el == 'Corona total' )

  if(datossum)datos0_1=Array.from(datossum)

  datos0.forEach((resp:any)=>{
    if(resp[nombre]){

      const indexobj = opciones.findIndex((el:any) => el.value == resp[nombre] )
      if(indexobj!=-1){
        let nomObj=opciones[indexobj]['label']

        const indiceElemento1 = datos0_1.findIndex((el:any) => el.name == resp[div] )
        if(indiceElemento1!=-1){
          let newTodos1 = [...datos0_1]
          const indiceElemento2 = newTodos1[indiceElemento1]['series'].findIndex((el:any) => el.name == nomObj )
          if(indiceElemento2!=-1){
            let newTodos2 = [...newTodos1[indiceElemento1]['series']]

            let sum=datos0_1[indiceElemento1]['series'][indiceElemento2]['value']+1
            newTodos2[indiceElemento2] = {...newTodos2[indiceElemento2], value: sum}

            newTodos1[indiceElemento1]['series'] = newTodos2

            datos0_1 = newTodos1
          }
        }

        //corona Total
        const indiceTotal=datos0_coronaTotal[0]['series'].findIndex((el:any) => el.name == nomObj )
        if(indiceTotal!=-1 && index!=-1){
          let newTotal1 = [...datos0_coronaTotal[0]['series']]

          let sum=datos0_coronaTotal[0]['series'][indiceTotal]['value']+1
          newTotal1[indiceTotal] = {...newTotal1[indiceTotal], value: sum}

          datos0_coronaTotal[0]['series'] = newTotal1
        }
      }
    }
  })

  if(index!=-1)datos0_1.push(datos0_coronaTotal[0])

  return datos0_1 
}

datosGraf2DDivisiones(division:any,datos:any,opciones:any,nombre:string,div:string){
  let datos0=datos
  let datos0_1:any=[]
  let datos0_2:any=[]

  opciones.forEach((resp:any)=>{
    datos0_2.push({name:resp.label,value:0})
  })

  division.forEach((resp:any)=>{
    if(resp!='Corona total')datos0_1.push({name:resp,series:datos0_2})
  })

  let datos0_coronaTotal=[{name:'Corona total',series:datos0_2}]
  const index = division.findIndex((el:any) => el == 'Corona total' )

  datos0.forEach((resp:any)=>{
    if(resp[nombre]){

      const indexobj = opciones.findIndex((el:any) => el.value == resp[nombre] )
      if(indexobj!=-1){
        let nomObj=opciones[indexobj]['label']

        const indiceElemento1 = datos0_1.findIndex((el:any) => el.name == resp[div] )
        if(indiceElemento1!=-1){
          let newTodos1 = [...datos0_1]
          const indiceElemento2 = newTodos1[indiceElemento1]['series'].findIndex((el:any) => el.name == nomObj )
          if(indiceElemento2!=-1){
            let newTodos2 = [...newTodos1[indiceElemento1]['series']]

            let sum=datos0_1[indiceElemento1]['series'][indiceElemento2]['value']+1
            newTodos2[indiceElemento2] = {...newTodos2[indiceElemento2], value: sum}

            newTodos1[indiceElemento1]['series'] = newTodos2

            datos0_1 = newTodos1
          }
        }

        //corona Total
        const indiceTotal=datos0_coronaTotal[0]['series'].findIndex((el:any) => el.name == nomObj )
        if(indiceTotal!=-1 && index!=-1){
          let newTotal1 = [...datos0_coronaTotal[0]['series']]

          let sum=datos0_coronaTotal[0]['series'][indiceTotal]['value']+1
          newTotal1[indiceTotal] = {...newTotal1[indiceTotal], value: sum}

          datos0_coronaTotal[0]['series'] = newTotal1
        }
      }
    }
  })

  if(index!=-1)datos0_1.push(datos0_coronaTotal[0])

  return datos0_1 
}

datosGraf2DDivisiones2(division:any,datos:any,opciones:any,div:string){
  let datos0=datos
  let datos0_1:any=[]
  let datos0_2:any=[]

  opciones.forEach((resp:any)=>{
    datos0_2.push({name:resp.label,value:0})
  })

  division.forEach((resp:any)=>{
    if(resp!='Corona total')datos0_1.push({name:resp,series:datos0_2})
  })

  let datos0_coronaTotal=[{name:'Corona total',series:datos0_2}]
  const index = division.findIndex((el:any) => el == 'Corona total' )

  datos0.forEach((resp:any)=>{
    opciones.forEach((resp1:any)=>{
      datos0_coronaTotal=this.datosGraf2DDivisiones2_1(datos0_1,opciones,resp,resp1.value,div,datos0_coronaTotal,index)
    })
  })

  if(index!=-1)datos0_1.push(datos0_coronaTotal[0])

  return datos0_1 
}

datosGraf2DDivisiones2_1(datos0_1:any,opciones:any,resp:any,nombre:any,div:any,datos0_coronaTotal:any,index:any){
  if(resp[nombre]){

    const indexobj = opciones.findIndex((el:any) => el.value == nombre )
    if(indexobj!=-1){
      let nomObj=opciones[indexobj]['label']

      const indiceElemento1 = datos0_1.findIndex((el:any) => el.name == resp[div] )
      if(indiceElemento1!=-1){
        let newTodos1 = [...datos0_1]
        const indiceElemento2 = newTodos1[indiceElemento1]['series'].findIndex((el:any) => el.name == nomObj )
        if(indiceElemento2!=-1){
          let newTodos2 = [...newTodos1[indiceElemento1]['series']]

          let sum=datos0_1[indiceElemento1]['series'][indiceElemento2]['value']+1
          newTodos2[indiceElemento2] = {...newTodos2[indiceElemento2], value: sum}

          newTodos1[indiceElemento1]['series'] = newTodos2

          datos0_1 = newTodos1
        }
      }

      //corona Total
      const indiceTotal=datos0_coronaTotal[0]['series'].findIndex((el:any) => el.name == nomObj )
      if(indiceTotal!=-1 && index!=-1){
        let newTotal1 = [...datos0_coronaTotal[0]['series']]

        let sum=datos0_coronaTotal[0]['series'][indiceTotal]['value']+1
        newTotal1[indiceTotal] = {...newTotal1[indiceTotal], value: sum}

        datos0_coronaTotal[0]['series'] = newTotal1
      }
    }
  }
  return datos0_coronaTotal
}


datosGraf2DDivisionesRangos(division:any,datos:any,opciones:any,rango:any,fecha1:string,fecha2:string,unidadTiempo:any,div:string){
  let datos0=Array.from(datos)
  let datos0_1:any=[]
  let datos0_2:any=[]

  opciones.forEach((resp:any)=>{
    datos0_2.push({name:resp.label,value:0})
  })

  division.forEach((resp:any)=>{
    if(resp!='Corona total')datos0_1.push({name:resp,series:datos0_2})
  })

  let datos0_coronaTotal=[{name:'Corona total',series:datos0_2}]
  const index = division.findIndex((el:any) => el == 'Corona total' )



  datos0.forEach((resp:any)=>{

    let fecha:Date | null=null
    if(fecha2=='hoy'){fecha=new Date()}
    else{
      if(resp[fecha2]){fecha=new Date(resp[fecha2])}else{fecha=null}
    }
    
    if(resp[fecha1] && fecha){
      let tiempo:any
      if(unidadTiempo=='anio'){tiempo=this.difAnios(new Date(resp[fecha1]),fecha)}
      if(unidadTiempo=='mes'){tiempo=this.difmeses(new Date(resp[fecha1]),fecha)}
      let cont=0;
      let i=-1;
      rango.forEach((resp1:any)=>{
        if(resp1[0]<=tiempo && tiempo<=resp1[1]){i=Object.freeze(cont);}
        cont++;
      })
      const indexobj=Object.freeze(i)

      if(indexobj!=-1){
        let nomObj=opciones[indexobj]['label']

        const indiceElemento1 = datos0_1.findIndex((el:any) => el.name == resp[div] )
        if(indiceElemento1!=-1){
          let newTodos1 = [...datos0_1]
          const indiceElemento2 = newTodos1[indiceElemento1]['series'].findIndex((el:any) => el.name == nomObj )
          if(indiceElemento2!=-1){
            let newTodos2 = [...newTodos1[indiceElemento1]['series']]

            let sum=datos0_1[indiceElemento1]['series'][indiceElemento2]['value']+1
            newTodos2[indiceElemento2] = {...newTodos2[indiceElemento2], value: sum}

            newTodos1[indiceElemento1]['series'] = newTodos2

            datos0_1 = newTodos1
          }
        }

        //corona Total
        const indiceTotal=datos0_coronaTotal[0]['series'].findIndex((el:any) => el.name == nomObj )
        if(indiceTotal!=-1 && index!=-1){
          let newTotal1 = [...datos0_coronaTotal[0]['series']]

          let sum=datos0_coronaTotal[0]['series'][indiceTotal]['value']+1
          newTotal1[indiceTotal] = {...newTotal1[indiceTotal], value: sum}

          datos0_coronaTotal[0]['series'] = newTotal1
        }
      }
    }
  })

  if(index!=-1)datos0_1.push(datos0_coronaTotal[0])

  return datos0_1 
}

organizarDatosMayorMenor(dato:any){
  let datosReturn:any=[]
  dato.forEach((resp:any)=>{
    let datos=Array.from(resp['series'])
    datos=this.order(datos)
    datosReturn.push({name:resp['name'],series:datos})
  })
  return datosReturn
}


top(dato:any, limit:any) {
  let dato2:any=[]
  dato.forEach((ele:any) =>{
    let cont=0
    let serie:any=[]
    ele.series.forEach((ele2:any)=>{
      if(ele.series.length>=limit){
        if(cont<limit){
          serie.push({name:ele2.name , value:ele2.value} ) 
        }
      }else{
        serie.push({name:ele2.name , value:ele2.value})
      }
      cont++
    }) 
    dato2.push({name:ele.name ,series:serie} )
  })
  return dato2
}

top2(dato:any, limit:any) {
  let dato2:any=[] 
  let cont=0
  let order:any=[]
  dato.forEach((resp:any)=>{
    let sum=0
    resp['series'].forEach((resp2:any)=>{
      sum+=resp2.value
    })
    order.push({label:resp.name,value:sum})
  })
  order=this.order(order)

  order.forEach((resp:any)=>{
    if(cont<limit){
      dato2.push(dato.find((resp1:any)=>resp1.name==resp.label))
    }
    cont +=1;
  })

  return dato2
}

order(ele:any){
  ele.sort(function (a:any, b:any) {
    if (a.value < b.value) {
      return 1;
    }
    if (a.value > b.value) {
      return -1;
    }
    return 0;
  });
  return ele
}

order2(ele:any){
  ele.sort(function (a:any, b:any) {
    if (a.tipoAreaId > b.tipoAreaId) {
      return 1;
    }
    if (a.tipoAreaId < b.tipoAreaId) {
      return -1;
    }
    return 0;
  });
  return ele
}


// Component methods
async loadAreas() {
  let allComplete = {
    organi: false,
    fisica: false
  };

  // Consulta las areas de estructura organizacional
  let filterAreaQuery = new FilterQuery();
  //filterAreaQuery.fieldList=['id','nombre','descripcion','tipoArea','estructura','areaPadre','areaList']
  filterAreaQuery.filterList = [
    { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
  ];
  this.areaService.findByFilter(filterAreaQuery)
    .then((data:any) => {
      let root: TreeNode = {
        label: '',
        selectable: false,
        expanded: false,
      };
      let nodos = this.createTreeNode(<Area[]>data['data'], null);
      root.children = nodos;
      this.areasNodes.push(root);
      allComplete.organi = true;
    })
}

createTreeNode(areas: Area[], nodoPadre: TreeNode | null): TreeNode[] {
  let nodes: TreeNode[] = [];
  for (let i = 0; i < areas.length; i++) {
    let area = areas[i];
    let n : any= {
      key: area.id,
      label: area.nombre,
      descripcion: area.descripcion,
      tipoAreaId: area.tipoArea.id,
      estructura: area.estructura,
      expanded: false,
      parent: nodoPadre,
      children: null,
      selected: true
    };
    n.children = (area.areaList != null ? this.createTreeNode(area.areaList, n) : null);
    nodes.push(n);
  }
  return nodes;
}

contTotal(datos:any){
  let name:any=[]
  let datosGrafica_total:any=[]
  let total=new Map()
  datos.forEach((resp:any)=>{
    resp.series.forEach((resp2:any)=>{
      if(total.has(resp2.name)){total.set(resp2.name,total.get(resp2.name)+resp2.value)}
      else{total.set(resp2.name,resp2.value)
        name.push(resp2.name)}
    })
  })
  name.forEach((resp:any)=>{
    datosGrafica_total.push({name:resp,value:total.get(resp)})
  })
  
  datos.push({name:'Corona total',series:datosGrafica_total})

  return datos

}

}
