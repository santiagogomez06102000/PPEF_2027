<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FiltrosMapa, { RamoInterface } from './FiltrosMapa.vue'
import Mapa, { Proyecto } from './Mapa.vue'
import { fetchPublicJson } from '@/components/utils/utils.js'
import FiltroRamos from './FiltroRamos.vue'
const datos = ref<Proyecto[] | null>(null)
const datosFiltrados = ref<Proyecto[]>([])

async function obtenerDatos() {
  const respuesta = await fetchPublicJson<Proyecto[]>('/db/proyectos_ppef.json')
  if (respuesta) {
    datos.value = respuesta
    datosFiltrados.value = respuesta
  }
}
onMounted(async () => {
  await obtenerDatos()
})

function filtrarDatos(filtros: Filtros) {
  const filtrado = datos.value?.filter((proyecto) => {
    if (filtros.ramo !== null && proyecto.ID_RAMO !== filtros.ramo) {
      return false
    }

    if (filtros.estado !== null && proyecto.ID_ENTIDAD_FEDERATIVA !== filtros.estado) {
      return false
    }

    if (filtros.ejecutor !== null && proyecto.ID_UR !== filtros.ejecutor) {
      return false
    }

    return true
  })
  datosFiltrados.value = filtrado ?? []
}

function filtrarRamos(ramos:number[]) {
  console.log(ramos);
  
  const filtrado = datos.value?.filter((proyecto) => {
    return ramos.includes(proyecto.ID_RAMO)
  })
  datosFiltrados.value = filtrado ?? []
}

export interface Filtros {
  ramo: number | null
  estado: number | null
  ejecutor: string | null
}
</script>
<template>
  <section class="w-full h-full  flex flex-col gap-4">
    <h3 class="text-center" style="margin: 0;">Proyectos de inversión georreferenciados propuestos para el 2027</h3>
    <div
      class="w-full h-full flex flex-col lg:flex-row items-center lg:items-start justify-start gap-8"
    >
      <FiltrosMapa :filtrar="filtrarDatos" class="hidden" />
      <div class="flex-1 w-full h-full rounded-xl shadow-xl overflow-hidden relative ">
        <FiltroRamos @filtrar="filtrarRamos"/>
        <Mapa :proyectos="datosFiltrados" />
      </div>
    </div>
  </section>
</template>
<style>
:root {
  --color-borde-cards: #5dc1be;
  --color-terciario: #5dc1be;
  --color-rojo: #cb0909;
  --color-rojo-claro: #e26c6c;
  --color-blanco: #f8fafc;
  --color-gris: #565e74;
}
</style>
