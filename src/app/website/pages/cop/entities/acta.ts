
import { Documento } from "src/app/website/pages/ado/entities/documento";
import { Area } from "src/app/website/pages/empresa/entities/area";


export class Acta {
    id?: string  | null;
    nombre?: string | null;
    descripcion?: string | null;
    fechaElaboracion?: Date | null;
    area?: Area | null;
    documentosList?: Documento[];
}