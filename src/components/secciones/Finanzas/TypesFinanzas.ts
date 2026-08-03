export interface TypeDatosFinanzas {
  colorActivo: string
  textoCard: string
  fondoCard: string
  fondoSeccion: string
  textoSeccion: string
  colorEncabezado:string
  tabs: TypeTabFinanzas[]
}

export interface TypeTabFinanzas {
  id: number
  titulo: string
  lista: TypeListaItemFinanzas[]
}

export interface TypeListaItemFinanzas {
  id: number
  titulo: string
  parrafos: TypeParrafoFinanzas[]
}

export interface TypeParrafoFinanzas {
  id: number
  titulo: string
  texto: string
  fuente: string
  img:string
}

export interface TypeFilaFinanzas {
  id: number
  concepto: string
  titulo: number
  a2026Aprobado: number
  a2026Estimado: number
  a2027: number
  subfilas: TypeSubFilaFinanzas[]
}

export interface TypeSubFilaFinanzas {
  id: number
  concepto: string
  titulo: number | null
  a2026Aprobado: number
  a2026Estimado: number
  a2027: number
}

export type TypeTablaFinanzas = {
  fondoCard: string
  textoCard: string
  bordeCard: string
  filas: TypeFilaFinanzas[]
}
