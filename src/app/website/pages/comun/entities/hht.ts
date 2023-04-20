export class Hht {
  id?: string | null;
  anio?: number | null | undefined;
  mes?: string;
  valor?: string;
  empresaSelect?:string;

  // nombreMes?:string;
}

export class AreaHht {
  area?: string;
  ubicacion?:UbicacionHht;
}

export class UbicacionHht {
  Girardot?: ValorHht;
  Funza?:ValorHht;
  Madrid?:ValorHht;
}

export class ValorHht {
  Hht?: Number | null;
  Nh?:Number | null;
}

export class DataPlanta {
  id?: number | null;
  NumPersonasPlanta?: number | null;
  HhtPlanta?: number | null;
}

export class DataArea {
  id?: number | null;
  NumPersonasArea?: number | null;
  HhtArea?: number | null;
  ILIArea?: number| null;
  Plantas?: DataPlanta[];
}

export class DataHht {
  id?: number | null;
  mes?: string;
  NumPersonasMes?: number | null;
  HhtMes?: number | null;
  Areas?: DataArea[];
}
