<script setup lang="ts">
import { onMounted, ref, shallowRef, watch } from 'vue'
import L from 'leaflet'
//@ts-ignore
import 'leaflet/dist/leaflet.css'
import {
  addGeoJsonToMap,
  capaEstados,
  geoJsonEstados,
  initMap,
  useGeoJson,
} from '../Inversion/mapController'
import { formatearMoneda } from '@/components/utils/utils'
import { EntidadFederativaDatos } from './ViewMapa.vue'

const props = defineProps<Props>()
const mapa = shallowRef<L.Map | null>(null)

const mapaContainer = ref(null)
onMounted(() => {
  mapa.value = initMap(mapaContainer)
  crearCapaEstados()
})

const { getGeoJson } = useGeoJson()

async function crearCapaEstados() {
  if (!mapa.value) return
  if (!geoJsonEstados.value) {
    geoJsonEstados.value = await getGeoJson('mapa/entidades.json')
  }
  if (geoJsonEstados.value) {
    capaEstados.value = addGeoJsonToMap(
      mapa.value,
      geoJsonEstados.value,
      {
        style: {
          color: '#1d8083',
          weight: 1,
          opacity: 1,
        },
      },
      'entidadesPane',
      200,
    )
    capaEstados.value.eachLayer((layer: any) => {
      const id_edo = Number(layer.feature?.properties?.CVE_ENT)
      const estado = props.estados.find((edo) => edo.id_entidad_federativa === id_edo)

      layer.bindTooltip(estado?.entidad_federativa, {
        sticky: true,
        direction:"top",
         offset: [0, -8],
      opacity: 0.9,
      })
      layer.bindPopup(`
  ${
    estado?.entidad_federativa
      ? `<h5 class="font-bold text-3xl titulo-mapa-popup pb-4 text-[var(--color-dorado)]">${estado.entidad_federativa}</h5>`
      : ''
  }

  ${
    estado?.total !== null && estado?.total !== undefined
      ? `<h6 class="mapa-p text-2xl titulo-mapa-popup">
          <b>${formatearMoneda(estado.total)}</b> millones de pesos
        </h6>`
      : ''
  }

  ${mostrarDato('Participaciones federales', estado?.participaciones_federales)}

  ${mostrarDato('Aportaciones federales', estado?.aportaciones_federales)}

  ${mostrarDato('Convenios', estado?.convenios)}

  ${mostrarDato('Subsidios', estado?.subsidios)}
`)
      layer.setStyle({
        fillOpacity: 0.6,
        fillColor: obtenerColorEstado(estado?.total ?? 0),
      })
    })
  }
}
function mostrarDato(label: string, valor: number | string | null | undefined): string {
  if (valor === null || valor === undefined || valor === '') {
    return ''
  }

  return `<p class="mapa-p"><b>${label}:</b> ${formatearMoneda(valor)}</p>`
}
function obtenerColorEstado(total: number): string {
  if (total <= 50_000) {
    return '#a2e3df'
  }

  if (total <= 100_000) {
    return '#5bcdb1'
  }

  if (total <= 200_000) {
    return '#00cc99'
  }

  return '#1d8083'
}

interface Props {
  estados: EntidadFederativaDatos[]
}
export interface Proyecto {
  CVE_CARTERA: string
  NOMBRE_PPI: string
  ID_RAMO: number
  DESCRIPCION_RAMO: string
  ID_UR: string
  DESCRIPCION_UR: string
  DESCRIPCION_TIPO_PPI: string
  DESCRIPCION_PPI: string
  LOCALIZACION: string
  ID_ENTIDAD_FEDERATIVA: number
  ENTIDAD_FEDERATIVA: string
  LATITUD: number | null
  LONGITUD: number | null
  FECHA_INICIO_CAL_FF: string
  FECHA_FIN_CAL_FF: string
  ANIOS_HE: number | null
  NOMBRE_ADMIN: string | null
  APELLIDO_PATERNO_ADMIN: string | null
  APELLIDO_MATERNO_ADMIN: string | null
  CARGO_ADMIN: string | null
  MAIL_ADMIN: string | null
  MAIL_ALTERNO_ADMIN: string | null
  TELEFONO_ADMIN: string | null
  EXTENSION_ADMIN: string | null
  META_FISICA: string | null
  BENEFICIOS_ESPERADOS: string | null
  ID_PPI: number
  PPEF: number | null
  PEF: number | null
  APROBADO: number | null
  MODIFICADO: number | null
  EJERCIDO: number | null
  AVANCE_FISICO: number | null
  MONTO_TOTAL_INVERSION: number | null
  MONTO_OPERACION_MANTENIMIENTO: number | null
  OTROS_COSTOS: number | null
  COSTO_TOTAL_INVERSION: number | null
  ANIO: number
  FISCAL: number | null
  PROPIO: number | null
  ESTATAL: number | null
  MUNICIPAL: number | null
  PRIVADA: number | null
  FIDEICOMISO: number | null
  OTROS: number | null
  CICLO: number | null
  ESTATUS_OPERACION: string
}
</script>
<template>
  <div
    ref="mapaContainer"
    class="w-full h-full min-h-[90dvh] lg:min-h-[70dvh] mapa-gasto-federalizado"
  ></div>
</template>
<style scoped></style>
