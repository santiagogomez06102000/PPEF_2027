export type TypeInfoTarjeta={
  etiqueta:string;
  valores:string
}
export type TypeTarjeta = {
  id: number;
  titulo: string;
  subtitulo:string | null;
  sube:boolean | null;
  datos:TypeInfoTarjeta[];
}
export type TypeEstimaciones = {
  fondoCard: string
  textoCard: string
  bordeColor: string
  tarjetas: TypeTarjeta[]
}

export type TypeVariablesApoyo = {
  id:number;
  concepto: string;
  titulo: number | null;
  'a2026': string | null;
  'a2027': string | null;
  sube:boolean | null;
}
