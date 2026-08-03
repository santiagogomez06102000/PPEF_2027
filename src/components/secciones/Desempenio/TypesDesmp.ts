export type TypeDetalleItem = {
  descripcion: string
  fuente: string
}

export type TypeListaItem = {
  id:number
  titulo: string
  descripcion: string
  fuente: string
  detalle: TypeDetalleItem[] | null
  nacional:string
  fuenteNacional:string
  img:string
}

export type TypeTab = {
  id: number
  titulo: string
  lista: TypeListaItem[]
}

export type TypeDatos = {
  textoSeccion: string
  fondoSeccion:string
  fondoCard:string
  textoCard:string
  colorActivo:string
  colorEncabezado:string
  tabs: TypeTab[]
}