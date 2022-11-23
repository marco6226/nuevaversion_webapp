import { Usuario } from "./usuario";

export interface ContextoOrganizacion {
    id: string;
    version: number;
    usuarioElabora: Usuario;
    usuarioModifica: Usuario;
    fechaElaboracion: Date;
    fechaModificacion: Date;
    data: DataCtxOrg;
}

interface DataCtxOrg {
    fortalezas: string[];
    debilidades: string[];
    oportunidades: string[];
    amenazas: string[];
    requisitosLegales: string[];
    normasSector: string[];
    requisitosMercado: string[];
    politicasInternas: string[];
    partesInteresadasInterno: ParteInteresada[];
    partesInteresadasExterno: ParteInteresada[];
}

interface ParteInteresada {
    nombre: string;
    necesidades: string;
}