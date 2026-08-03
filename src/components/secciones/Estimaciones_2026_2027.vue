<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TypeDatos } from './Desempenio/TypesDesmp'
import Tabs from './Desempenio/Tabs.vue'
import { TypeEstimaciones } from './Estimaciones20262027/typesEstimaciones'
import CardMacro from './Estimaciones20262027/CardMacro.vue'
import TablaMacro from './Estimaciones20262027/TablaMacro.vue'
import Mascota from '../utils/Mascota.vue'
const inicio = {
  colorActivo: '#97ead1',
  textoSeccion: '#ffffff',
  fondoSeccion: '#21224a',
  textoCard: '#ffffff',
  fondoCard: '#2e3772',
  colorEncabezado:"#97ead1",
  tabs: [],
  direccion: 'row',
}
const inicioTarjetas = {
  fondoCard: 'transparent',
  textoCard: '#000000',
  bordeColor: '#3f42a0',
  tarjetas: [],
}
const datos = ref<TypeDatos>(inicio)
const tarjetas = ref<TypeEstimaciones>(inicioTarjetas)
const getDatosDesemp = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}secciones/estimaciones20262027/estimaciones.json`,
    )
    const data = await response.json()
    datos.value = data
  } catch (error) {
    console.error('Error cargando tipos de contrato:', error)
    datos.value = inicio
  }
}
const getCards = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}secciones/estimaciones20262027/marco_macroeconomico.json`,
    )
    const data = await response.json()
    tarjetas.value = data
  } catch (error) {
    console.error('Error cargando tipos de contrato:', error)
    tarjetas.value = inicioTarjetas
  }
}
onMounted(() => {
  getDatosDesemp()
  getCards()
})
</script>

<template>
  <section
    class="cubo-track grid grid-cols-6 gap-x-4"
    data-face-id="ciclo-anterior"
    id="estimaciones_2026"
    :style="{
      '--color-fondo-seccion': datos.fondoSeccion,
      '--color-texto-seccion': datos.textoSeccion,
      '--color-activo': datos.colorActivo,
      '--color-acordion': datos.fondoCard,
      '--color-texto': datos.textoCard,
      '--color-card-fondo': tarjetas.fondoCard,
      '--color-card-texto': tarjetas.textoCard,
      '--color-card-borde': tarjetas.bordeColor,
      '--color-encabezado':datos.colorEncabezado
    }"
  >
    <div class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6" style="padding-top: 2rem; padding-bottom: 0;">
      <h2 class="titulo-seccion">
        ¿Cómo se prevé cerrar el año y cuál es el panorama para el siguiente?
      </h2>
      <div class="flex flex-col-reverse lg:flex-row items-center">
        <Mascota :mascota="4" alto="15rem" ancho="15rem"/>
        <p class="flex-1">
        Para 2027, el panorama económico de México se fortalecerá mediante una inversión estratégica
        en infraestructura y la edificación de viviendas, impulsando el crecimiento económico. La
        estabilidad se consolidará con una inflación a la baja y tasas de interés que descenderán
        favoreciendo el consumo y la inversión. Por su parte, el tipo de cambio se mantendrá
        estable, apoyado por el atractivo de los mercados nacionales. El dinamismo comercial se verá
        reforzado por la revisión del T-MEC y la relocalización de empresas, mientras Pemex
        mantendrá su enfoque en la soberanía energética. Así, el país transitará hacia una
        normalización fiscal con finanzas sólidas y un entorno de confianza para el desarrollo
        nacional.
      </p>
      </div>
    </div>
    <div
      class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6 seccion-tabs relative"
      v-show="datos.tabs.length > 0"
    >
      <Tabs v-show="datos.tabs.length > 0" :datos="datos" />
    </div>
    <div class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6" style="margin: 0;padding-bottom: 0 !important; padding-top: 0 !important;">
      <h3 class="w-full titulo-seccion">Información de las fichas de marco macroeconómico</h3>
    </div>
    <!-- <div
      class="quitar-padding lg:col-start-2 lg:col-span-4 col-start-1 col-span-6 flex gap-4 w-full flex-wrap items-stretch justify-center contenedor-card-macro"
    >
      <CardMacro v-for="card in tarjetas.tarjetas" :datos="card" :key="card.id" />
    </div> -->
    <div
      class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6 flex gap-4 w-full flex flex-col tabla"
      style="padding-top: 0 !important;"
    >
      <TablaMacro />
      <div class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6 flex gap-4 w-full">
        <div class="finanzas-fuentes">
          <!--<span>e/ Estimado.</span>-->
          <p>Fuente: PCGPE 2027, Pág 5 y 32</p>
          <!---<span>*mbd: Miles de barriles diarios.</span>-->
          <!--<span>**MMBtu: Millones de Unidades Térmicas Británicas</span>-->
        </div>
      </div> 
    </div>
  </section>
</template>

<style scoped>
#estimaciones_2026 {
  background: var(--color-fondo-seccion);
  color: var(--color-texto-seccion);
}
#estimaciones_2026 p {
  color: var(--color-texto);
}
.seccion-tabs {
  padding-top: 0 !important;
}
.titulo-seccion {
  color: var(--color-encabezado);
}
.finanzas-fuentes{
  padding-top: 1rem;
}
.finanzas-fuentes p{
  color:var(--color-texto);
  font-size: small;
  margin-bottom: 0;
}
.quitar-padding {
  padding: 0 !important;
}
.tabla{
  padding-left: 10rem !important;
  padding-right: 10rem !important;
}
</style>
