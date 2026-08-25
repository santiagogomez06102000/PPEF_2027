<script setup lang="ts">
import { onMounted, ref, shallowRef, watch } from 'vue'
import L from 'leaflet'
//@ts-ignore
import 'leaflet/dist/leaflet.css'
import { entidadesFederativas, initMap, ramoColores, regrearMapa } from './mapController'
import { formatearMoneda } from '@/components/utils/utils';
import Mexico from '@/components/utils/Icons/Mexico.vue';

const props = defineProps<Props>()
const mapa = shallowRef<L.Map | null>(null)
const renderer = L.canvas()

const estiloBase = {
  radius: 8,
  weight: 1,
  fillOpacity: 0.7,
  color: 'rgb(255, 255, 255)'
}
const mapaContainer = ref(null)
onMounted(() => {

  mapa.value = initMap(mapaContainer)

  if (!mapa.value) {
    return
  }

  capaEstados = crearCapaEstados(
    props.proyectos,
    mapa.value
  )

  capaProyectos = crearCapaProyectos(
    props.proyectos
  )

  // Inicialmente estados
  mapa.value.addLayer(capaEstados)

  mapa.value.on("zoomend", () => {

    if (!mapa.value || !capaEstados || !capaProyectos) {
      return
    }

    const zoom = mapa.value.getZoom()

    if (zoom <= 6) {

      capaProyectos.removeFrom(mapa.value)

      if (!mapa.value.hasLayer(capaEstados)) {
        capaEstados.addTo(mapa.value)
      }

    } else {

      capaEstados.removeFrom(mapa.value)

      if (!mapa.value.hasLayer(capaProyectos)) {
        capaProyectos.addTo(mapa.value)
      }

    }

  })
})
let capaProyectos: L.FeatureGroup | null = null
let capaEstados: L.FeatureGroup | null = null

async function actualizarDatos() {

  if (!mapa.value) {
    return
  }

  if (capaEstados) {
    mapa.value.removeLayer(capaEstados)
  }

  if (capaProyectos) {
    mapa.value.removeLayer(capaProyectos)
  }

  if (props.proyectos.length === 0) {
    return
  }

  capaEstados = crearCapaEstados(
    props.proyectos,
    mapa.value
  )

  capaProyectos = crearCapaProyectos(
    props.proyectos
  )

  const zoom = mapa.value.getZoom()

  if (zoom <= 6) {

    capaEstados.addTo(mapa.value)

  } else {

    capaProyectos.addTo(mapa.value)

  }
}
function crearCapaProyectos(
  proyectos: Proyecto[]
): L.FeatureGroup {

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

    const marker = L.circleMarker(
      [
        proyecto.LATITUD,
        proyecto.LONGITUD
      ],
      {
        renderer,
        ...estiloBase,
        fillColor: ramoColores.get(
          proyecto.ID_RAMO
        ),
      }
    )

    marker.bindPopup(`
      <div class="flex flex-col gap-2 text-[11px]">

        <h6 class="text-gray-500">
          ${proyecto.NOMBRE_PPI}
        </h6>

        <div class="grid grid-cols-24 gap-x-1 bg-gray-200 rounded p-2">

          <span class="col-span-11 text-gray-500">
            Monto total de inversión
          </span>

          <span class="col-span-13 text-gray-500">
            Monto propuesto PPEF 2027
          </span>

          <span class="col-span-11 text-bold">
            ${formatearMoneda(
      proyecto.MONTO_TOTAL_INVERSION ?? "-"
    )}
          </span>

          <span class="col-span-13 text-bold">
            ${formatearMoneda(
      proyecto.PPEF ?? "-"
    )}
          </span>

        </div>
      </div>
    `)

    marker.on("mouseover", () => {
      marker.setStyle({
        radius: estiloBase.radius + 2,
        fillOpacity: 1,
      })
    })

    marker.on("mouseout", () => {
      marker.setStyle(estiloBase)
    })

    marker.bindTooltip(
      proyecto.NOMBRE_PPI,
      {
        direction: "top",
        offset: [0, -8],
        opacity: 0.9,
      }
    )

    capa.addLayer(marker)
  }

  capa.setZIndex(700)

  return capa
}
function agruparPorEstado(proyectos: Proyecto[]): Map<number, Proyecto[]> {
  const grupos = new Map<number, Proyecto[]>()

  for (const proyecto of proyectos) {
    if (
      proyecto.LATITUD == null ||
      proyecto.LONGITUD == null ||
      Number.isNaN(proyecto.LATITUD) ||
      Number.isNaN(proyecto.LONGITUD)
    ) {
      continue
    }

    const estado = proyecto.ID_ENTIDAD_FEDERATIVA

    if (!grupos.has(estado)) {
      grupos.set(estado, [])
    }

    grupos.get(estado)!.push(proyecto)
  }

  return grupos
}
function crearClusterEstado(
  estado: number,
  proyectos: Proyecto[],
  map: L.Map,
): L.Marker {

  const latLngs = proyectos.map(
    proyecto =>
      L.latLng(
        proyecto.LATITUD!,
        proyecto.LONGITUD!
      )
  )

  const bounds = L.latLngBounds(latLngs)

  const centro = bounds.getCenter()

  const marker = L.marker(centro, {
    icon: crearIconoEstado(
      estado,
      proyectos
    ),
  })

  marker.on("click", () => {

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 8,
    })

  })

  return marker
}
function crearCapaEstados(
  proyectos: Proyecto[],
  map: L.Map,
): L.FeatureGroup {

  const capaEstados = L.featureGroup()

  const grupos =
    agruparPorEstado(proyectos)

  for (
    const [estado, proyectosEstado]
    of grupos
  ) {

    const cluster =
      crearClusterEstado(
        estado,
        proyectosEstado,
        map
      )

    capaEstados.addLayer(cluster)
  }

  return capaEstados
}
function crearIconoEstado(
  estado: number,
  proyectos: Proyecto[]
): L.DivIcon {

  const total = proyectos.length

  const gradient =
    crearConicGradient(proyectos)

  const nombreEstado =
    entidadesFederativas.find(
      i =>
        i.id_entidad_federativa === estado
    )?.entidad_federativa ?? "Estado"

  return L.divIcon({

    className: "cluster-estado-wrapper ",

    html: `
      <div class="cluster-estado ">

        <div
          class="cluster-estado__circle"
          style="background: ${gradient};"
        >
          <span class="cluster-estado__count">
            ${total}
          </span>
        </div>
      </div>
    `,

    iconSize: [80, 80],

    iconAnchor: [40, 40],
  })
}
function crearConicGradient(
  proyectos: Proyecto[]
): string {

  const conteo = new Map<number, number>()

  for (const proyecto of proyectos) {

    const ramo = proyecto.ID_RAMO

    conteo.set(
      ramo,
      (conteo.get(ramo) ?? 0) + 1
    )
  }

  const total = proyectos.length

  let gradosActuales = 0

  const segmentos: string[] = []

  for (const [ramo, cantidad] of conteo) {

    const color =
      ramoColores.get(ramo) ?? "#9E9E9E"

    const grados =
      (cantidad / total) * 360

    const inicio = gradosActuales

    const fin =
      gradosActuales + grados

    segmentos.push(
      `${color} ${inicio}deg ${fin}deg`
    )

    gradosActuales = fin
  }

  return `conic-gradient(${segmentos.join(", ")})`
}
watch(
  () => props.proyectos,
  () => {
    actualizarDatos()
  },
  {
    deep: true,
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
  <div class="absolute top-3 right-3 z-1000 flex flex-col">
      <button
        type="button"
        class="boton-terciario shadow-lg"
        @click="regrearMapa"
      >
        <Mexico />
      </button>
    </div>
</template>
<style>
.cluster-estado-wrapper {
  background: transparent !important;
  border: none !important;
  
}

.cluster-estado {
  width: 60px;
  height: 60px;
  
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
}

.cluster-estado__circle {
  width: 38px;
  height: 38px;

  border-radius: 50%;

  background: conic-gradient(
    #99cc66 0deg 90deg,
    #835da8 90deg 180deg,
    #19bcb9 180deg 270deg,
    #e2282b 270deg 360deg
  );

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  border: 2px solid white;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.25);
}

.cluster-estado__circle::before {
  content: "";

  position: absolute;

  width: 22px;
  height: 22px;

  border-radius: 50%;

  background: white;
}

.cluster-estado__count {
  position: relative;
  z-index: 1;

  font-size: 11px;
  font-weight: 400;

  color: #374151;
}

.cluster-estado__label {
  position: absolute;

  bottom: -2px;

  background: white;

  padding: 2px 6px;

  border-radius: 4px;

  font-size: 9px;
  font-weight: 600;

  color: #4b5563;

  white-space: nowrap;

  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.15);
}
.boton-terciario {
  border-radius: 50rem;
  border: none;
  padding: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;

  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: 3rem;
  height: 3rem;
}
.boton-terciario:hover {
  background-color:gray;
}
</style>
