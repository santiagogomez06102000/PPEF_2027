<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TypeDatos } from './Desempenio/TypesDesmp'
import Tabs from './Desempenio/Tabs.vue'
import Mascota from '../utils/Mascota.vue'
const inicio = {
  colorActivo: '#97ead1',
  textoSeccion: '#ffffff',
  fondoSeccion: '#21224a',
  textoCard: '#ffffff',
  fondoCard: '#2e3772',
  colorEncabezado: '#97ead1',
  direccion: 'row',
  tabs: [],
}
const datos = ref<TypeDatos>(inicio)
const getDatosDesemp = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}secciones/desempenio2025/desenpenio.json`,
    )
    const data = await response.json()
    datos.value = data
  } catch (error) {
    console.error('Error cargando tipos de contrato:', error)
    datos.value = inicio
  }
}
onMounted(() => {
  getDatosDesemp()
})
</script>

<template>
  <section
    class="cubo-track grid grid-cols-6 gap-x-4"
    data-face-id="ciclo-anterior"
    id="ciclo-anterior"
    :style="{
      '--color-fondo-seccion': datos.fondoSeccion,
      '--color-texto-seccion': datos.textoSeccion,
      '--color-activo': datos.colorActivo,
      '--color-acordion': datos.fondoCard,
      '--color-texto': datos.textoCard,
      '--color-encabezado': datos.colorEncabezado,
    }"
  >
    <div class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6" style="padding-top: 2rem; padding-bottom: 0;">
      <h2 class="titulo-seccion">¿Qué pasó el año anterior?</h2>
      <div class="flex flex-col-reverse lg:flex-row items-center">
        <Mascota :mascota="3" alto="20rem" ancho="20rem"/>
        <p class="flex-1">
        En 2025, la economía mexicana creció moderadamente (1.1%) debido a un arrastre negativo de
        2024. A pesar de ello, el empleo avanzó, impulsado por cambios en la subcontratación y
        plataformas digitales. Además, la recaudación aumentó, en parte por los impuestos a las
        importaciones, mientras que la inflación se redujo por mejores condiciones climáticas y el
        control de los precios de los energéticos.
      </p>
      
      </div>
    </div>
    <div
      class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6 seccion-tabs relative"
      v-show="datos.tabs.length > 0"
    >
      <Tabs v-show="datos.tabs.length > 0" :datos="datos" />
    </div>
  </section>
</template>
<style scoped>
#ciclo-anterior {
  background-color: var(--color-fondo-seccion);
  color: var(--color-texto-seccion);
}
#ciclo-anterior p {
  color: var(--color-texto);
}
.seccion-tabs {
  padding-top: 0 !important;
}
.titulo-seccion {
  color: var(--color-encabezado);
}
</style>
