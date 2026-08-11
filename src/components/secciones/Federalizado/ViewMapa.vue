<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Mapa, { Proyecto } from './Mapa.vue'
import { fetchPublicJson } from '@/components/utils/utils.js'
import { baseUrl } from '../Inversion/mapController.js'
const datos = ref<EntidadFederativaDatos[] | null>(null)
const estados = ref<EntidadFederativa[] | null>(null)

async function obtenerDatos() {
  const respuesta = await fetchPublicJson<EntidadFederativaDatos[]>('/db/gasto_federalizado_mapa.json')
  if (respuesta) {
    datos.value = respuesta
    
  }
  const entidadesFed = await fetchPublicJson<EntidadFederativa[]>("/filtros/entidades_federativas.json")
    if(entidadesFed){
      estados.value = entidadesFed;
    }
}
onMounted(async () => {
  await obtenerDatos()
})

export interface EntidadFederativa{
    id_entidad_federativa:number
    entidad_federativa:string
}


export interface EntidadFederativaDatos {
  id_entidad_federativa: number;
  entidad_federativa: string;
  total: number;
  participaciones_federales: number;
  aportaciones_federales: number;
  convenios: number;
  subsidios: number | null;
}



</script>
<template>
  <section class="w-full h-full">
    <div
      class="w-full h-full flex flex-col-reverse lg:flex-row gap-8"
    >
      <div class="flex-1 w-full h-full rounded-xl shadow-xl overflow-hidden items-stretch" v-if="datos">
        <Mapa :estados="datos" />
      </div>
      <div class=" w-full lg:w-[30%] flex flex-col items-center justify-center">
        <img :src="baseUrl + 'mascota/7_impulso.png'"/>
        <div>
          <h3 class="text-[var(--color-blanco)]">Selecciona un estado para conocer el monto designado</h3>
        </div>
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
  --color-dorado:#ad8617;
}
</style>
