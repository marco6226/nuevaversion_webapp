import { Component, Input, OnInit } from '@angular/core';


@Component({
    selector: 'app-logmodal',
    templateUrl: './logmodal.component.html',
    styleUrls: ['./logmodal.component.scss']
})
export class LogmodalComponent implements OnInit {

    @Input() log: any;
    @Input() logList:any = [];
    arrayByentity:any = [];
    logFile:any = [];
    Entity:any = {
        fechaCreacion: { name: "Fecha de crecion", type: "Date" },
        fechaSeg: { name: "Fecha de seguimiento", type: "Date" }
    }
    constructor() { }

    ngOnInit() {
        if ((this.log.action as string).includes("Creacion")) {
            this.isCreation(this.log.json)
            return
        }
        this.arrayByentity = this.logList.filter((logU:any) => logU.entity === this.log.entity);
        let index = this.arrayByentity.findIndex((logU:any) => logU.id == this.log.id)
        console.log(index+1)
        console.log(this.arrayByentity[index+1])
        this.comparador(this.arrayByentity[index+1], this.log);
    }


    isCreation(log: any) {
        log = JSON.parse(log);
        console.log(log);
    
        // Si el log tiene un campo 'pcl', lo transformamos usando transformarPcl()
        if (log.pcl) {
            log.pcl = this.transformarPcl(log.pcl);
        }
    
        for (const key in log) {
            if (Object.prototype.hasOwnProperty.call(log, key)) {
                const info = log[key];
    
                // Verifica el tipo de dato antes de procesarlo
                this.verifyDataType(log[key], key);
    
                // Si el valor es un objeto, iteramos sobre sus propiedades
                if (typeof log[key] == 'object' && info != null) {
                    this.logFile.push(` ${key}  ==> `);
                    for (const t in log[key]) {
                        const element = log[key][t];
                        this.logFile.push(` ${t},  : ${element || 'vacio'}`);
                    }
                    this.logFile.push(` <==`);
                    continue;
                }
    
                // Verificación del tipo de dato y agregar al logFile
                console.log(this.Entity[key]);
                this.logFile.push(`${this.verifyDataType(key, info)}`);
            }
        }
    }
    
    transformarPcl(pcl: any): any {
        return {
            id: pcl.id || null,
            porcentajePcl: pcl.porcentajePcl + "%" || 'Sin porcentaje',
            entidadEmitePcl: pcl.entidadEmitePcl || 'Sin informacion',
            fechaCalificacion: pcl.fechaCalificacion || "Sin informacion",
            entidadEmiteCalificacion: pcl.entidadEmiteCalificacion || 'Sin informacion',
            observacionesPcl: pcl.observacionesPcl || "Sin Observaciones",
            detalle: pcl.observaciones || 'SIN DETALLES',
            fechaDiagnostico: pcl.fechaCalificacion || null,  // Cambiar según lo que esperas
            origen: pcl.origen || 'DESCONOCIDO',
            saludLaboral: pcl.saludLaboral !== undefined ? pcl.saludLaboral : false,
            sistemaAfectado: pcl.entidadEmitida || 'DESCONOCIDO'
        };
    }
    
    comparador(anterior: any, editado: any) {
        console.log(anterior);
        // Verificar si anterior tiene la propiedad json
        if (!anterior || !anterior.json) {
            console.error("El objeto anterior no tiene la propiedad 'json' o es undefined.");
            return;
        }
    
        anterior = JSON.parse(anterior.json);
        editado = JSON.parse(editado.json); // Asegúrate de que editado también se parsea
    
        console.log(anterior);
        console.log(editado);
    
        // Verificar si el diagnóstico está eliminado
        if (anterior.eliminado === true) {
            this.isCreation(anterior); // Llama a isCreation si está eliminado
            return; // Salir de comparador
        }
    
        // Continuar con la comparación normal si no está eliminado
        for (const key in anterior) {
            if (Object.prototype.hasOwnProperty.call(anterior, key)) {
                let sinEditar = anterior[key];
                let edit = editado[key];
    
                // Verificar si el objeto tiene un PCL para aplicar la transformación solo en ese caso
                if (key === 'pcl') {
                    const cambiosPcl: string[] = []; // Array para almacenar los cambios en pcl
    
                    // Comparar cada propiedad dentro del objeto pcl
                    for (const subKey in sinEditar) {
                        if (Object.prototype.hasOwnProperty.call(sinEditar, subKey)) {
                            const valorAnterior = sinEditar[subKey];
                            const valorEditado = edit[subKey];
    
                            // Agregar solo los cambios relevantes
                            if (valorAnterior !== valorEditado) {
                                cambiosPcl.push(`Cambio en ${subKey}, antes: ${JSON.stringify(valorAnterior)} despues: ${JSON.stringify(valorEditado)}`);
                            }
                        }
                    }
    
                    // Solo agregar al log si hay cambios
                    if (cambiosPcl.length > 0) {
                        this.logFile.push(...cambiosPcl);
                    }
    
                } else {
                    // Para otros casos, solo registrar si los valores son diferentes
                    if (sinEditar !== edit) {
                        this.logFile.push(`Cambio en ${this.Entity[key] || key}, antes: ${sinEditar || 'vacio'} despues: ${edit || 'vacio'}`);
                    }
                }
            }
        }
    }
    
    
    
    

    verifyDataType(key:any, info:any) {

        if (this.Entity[key]) {


            switch (this.Entity[key].type) {
                case "Date":
                    info = new Date(info);
                    break;

                default:
                    break;
            }



            return `${key},  : ${info || 'vacio'}`
        };


        return `${key},  : ${info || 'vacio'}`


    }

}