<script setup lang="ts">
import { onMounted, ref, shallowRef, watch } from 'vue'
import L from 'leaflet'
//@ts-ignore
import 'leaflet/dist/leaflet.css'
import { initMap } from './mapController'
import { formatearMoneda } from '@/components/utils/utils';

const props = defineProps<Props>()
const mapa = shallowRef<L.Map | null>(null)
const renderer = L.canvas()
const estiloBase = {
  radius: 8,
  weight: 1,
  fillOpacity: 0.7,
  color: 'rgb(255, 255, 255)',
  fillColor: 'rgb(93, 193, 190)',
}
const mapaContainer = ref(null)
onMounted(() => {
  mapa.value = initMap(mapaContainer)
})
let capaProyectos: L.FeatureGroup | null = null

async function actualizarDatos() {
  if (capaProyectos) {
    mapa.value?.removeLayer(capaProyectos)
  }

  if (props.proyectos.length > 0) {
    capaProyectos = crearCapaProyectos(props.proyectos)

    mapa.value?.addLayer(capaProyectos)

    const bounds = capaProyectos.getBounds()

    if (bounds) {
      mapa.value?.flyToBounds(bounds, {
        padding: [30, 30],
        duration: 1,
      })
    }
  }
}
function crearCapaProyectos(proyectos: Proyecto[]): L.FeatureGroup {
  const capa = L.featureGroup()

  for (const proyecto of proyectos) {
    if (
      proyecto.LATITUD == null ||
      proyecto.LONGITUD == null ||
      Number.isNaN(proyecto.LATITUD) ||
      Number.isNaN(proyecto.LONGITUD)
    ) {
      continue
    }

    const marker = L.circleMarker([proyecto.LATITUD, proyecto.LONGITUD], {
      renderer,
      ...estiloBase,
    })

    marker.bindPopup(`
      <div class="flex flex-col gap-2 text-[11px]">
      <h6 class="text-gray-500">${proyecto.NOMBRE_PPI}</h6>
      <div class="grid grid-cols-24  gap-x-1 bg-gray-200 rounded p-2">
      <span class="col-span-11  text-gray-500">
        Monto total de inversión
      </span>
      <span class="col-span-13  text-gray-500">
        Monto propuesto PPEF 2027
      </span>
      <span class="col-span-11 text-bold">
        ${formatearMoneda(proyecto.MONTO_TOTAL_INVERSION ?? "-")}
      </span>
      <span class="col-span-13 text-bold">
        ${formatearMoneda(proyecto.PPEF ?? "-")}
      </span>
      </div>
      </div>
    `)

    marker.on('mouseover', () => {
      marker.setStyle({
        radius: estiloBase.radius + 2,
        fillOpacity: 1,
      })
    })

    marker.on('mouseout', () => {
      marker.setStyle(estiloBase)
    })
    marker.bindTooltip(proyecto.NOMBRE_PPI, {
      direction: "top",
      offset: [0, -8],
      opacity: 0.9,
    });

    capa.addLayer(marker)
  }
  capa.setZIndex(700)
  return capa
}

watch(
  () => props.proyectos,
  () => {
    actualizarDatos()
  },
  {
    deep: true,
    immediate: true,
  },
)

interface Props {
  proyectos: Proyecto[]
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
  <div ref="mapaContainer" class="w-full h-full min-h-[90dvh] lg:min-h-[70dvh] "></div>
</template>
<style scoped></style>
