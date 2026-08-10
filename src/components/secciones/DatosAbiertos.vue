<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPublicJson } from '../utils/utils'
import CardDatosAbiertos, { Datos } from './DatosAbiertos/CardDatosAbiertos.vue'

const datosAbiertos = ref<DatosAbiertos | null>(null)
async function consultarDatosAbiertos() {
  datosAbiertos.value = await fetchPublicJson<DatosAbiertos>(
    '/secciones/datosAbiertos/datosAbiertos.json',
  )
}
onMounted(async () => {
  await consultarDatosAbiertos()
})

interface DatosAbiertos {
  datos: Datos[]
  anexos: Datos[]
}
</script>
<template>
  <section class="flex flex-col items-center justify-between gap-8">
    <h2>Datos abiertos</h2>
    <div class="grid grid-cols-6 w-full gap-8">
      <CardDatosAbiertos
        v-if="datosAbiertos"
        v-for="(dato, idx) in datosAbiertos.datos"
        :key="dato.url"
        :card="dato"
        :items="datosAbiertos.datos.length"
        :idx="idx"
      />
    </div>
    <h4 class="text-2xl">Conoce los Anexos Transversales contemplados en el PPEF 2027.</h4>
    <div class="grid grid-cols-6 w-full gap-8">
      <CardDatosAbiertos
        v-if="datosAbiertos"
        v-for="(dato, idx) in datosAbiertos.anexos"
        :key="dato.url"
        :card="dato"
        :items="datosAbiertos.anexos.length"
        :idx="idx"
      />
    </div>
  </section>
</template>
<style scoped></style>
