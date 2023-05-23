import { Area } from "../../empresa/entities/area";

export class DesviacionAliados {
    hashId!: string;
    id!: number;
    razonSocial!: string;
    nit!: string;
    idEmpleado!: string;
    fechaReporte!: Date;
    area!: Area;
    aliadoId!: number;
    empresaId!: number;
    seguimiento!: string;
    incapacidades!: string;
    gestor!: string;
    analisisDesviacionId!: number;
    planAccion!: string;
}