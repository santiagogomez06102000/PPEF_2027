<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TypeDatosFinanzas } from './Finanzas/TypesFinanzas'
import TabsFinanzas from './Finanzas/TabsFinanzas.vue'
import TablaFinanzas from './Finanzas/TablaFinanzas.vue'
import Mascota from '../utils/Mascota.vue'

const datos = ref<TypeDatosFinanzas | null>(null)

const getDatosFinanzas = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}secciones/finanzas/finanzas_publicas.json`,
    )
    const data = await response.json()
    datos.value = data
  } catch (error) {
    console.error('Error cargando tipos de contrato:', error)
    datos.value = null
  }
}
onMounted(() => {
  getDatosFinanzas()
})
</script>
<template>
  <section
    class="cubo-track grid grid-cols-6 gap-x-4"
    data-face-id="finanzas_publicas"
    id="finanzas_publicas"
    :style="{
      '--color-fondo-seccion': datos?.fondoSeccion,
      '--color-texto-seccion': datos?.textoSeccion,
      '--color-activo': datos?.colorActivo,
      '--color-acordion': datos?.fondoCard,
      '--color-texto': datos?.textoCard,
      '--color-encabezado': datos?.colorEncabezado,
    }"
  >
    <div class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6" style="padding-top: 2rem; padding-bottom: 0;">
      <h2 class="titulo-seccion">¿De dónde vendrán los ingresos el próximo año y cómo se utilizarán?</h2>
      <div class="flex items-center flex-col lg:flex-row">
        <p class="flex-1">
        Las finanzas públicas representan el motor que permite transformar recursos en bienestar
        para la ciudadanía. Este proceso abarca desde la obtención de ingresos hasta su gestión y
        aplicación en servicios públicos, infraestructura y programas sociales. Para asegurar un
        manejo transparente y responsable, su estructura se organiza en los siguientes aspectos: los
        ingresos públicos, el gasto público, la deuda publica y el balance entre los ingresos y el
        gasto, garantizando siempre la contribución del presupuesto al desarrollo nacional.
      </p>
      <Mascota :mascota="5" ancho="15rem" alto="15rem"/>
      </div>
    </div>
    <div
      v-if="datos"
      class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6"
      style="padding-top: 0"
    >
      <TabsFinanzas :datos="datos" />
    </div>
    <div class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6  w-full " style="padding-top: 0;">
      <h3>Resumen de las estimaciones de finanzas públicas</h3>
      <div class="tabla w-full">
      <TablaFinanzas />
      </div>
      <div class="finanzas-fuentes tabla">
        <p>Notas: Las sumas parciales pueden no coincidir por el redondeo de cifras.</p>
        <p>
          */ Con fines de comparabilidad, se considera el PIB nominal estimado para 2026, en el
          contexto de la revisión a la serie histórica del PIB
        </p>
        <p>Fuente: PCGPE 2027, Pág 34</p>
      </div>
    </div>
  </section>
</template>
<style scoped>
#finanzas_publicas{
    background: var(--color-fondo-seccion);
}
#finanzas_publicas p{
  color: var(--color-texto-seccion);
}
.cards {
  padding: 36px 0;
}

.subcards {
  padding: 20px 25px;
}

.p-h4 {
  color: rgb(56, 78, 158);
  font-family: 'Noto Sans';
  font-size: 24px;
  text-align: left;
}
.finanzas-fuentes {
  padding-top: 1rem;
}
.finanzas-fuentes p {
  color: var(--color-texto);
  font-size: small;
  margin-bottom: 0;
}
.tabla{
  padding-left: 10rem !important;
  padding-right: 10rem !important;
}
@media (max-width: 1024px) {
  .tabla{
  padding-left: 0rem !important;
  padding-right: 0rem !important;
}
}
</style>
