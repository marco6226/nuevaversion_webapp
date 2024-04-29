import { ComunEntity } from "./comun-entity";

export class JuntaRegional implements ComunEntity {
    id!: string;
    codigo!: string;
    nombre!: string;
    correo_electronico!: string;
    direccion!: string;
    telefono!: string;
}
