<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPublicJson } from '../utils/utils'
import CardDatosAbiertos, { type Datos } from './DatosAbiertos/CardDatosAbiertos.vue'

interface DatosAbiertos {
  datos: Datos[]
  anexos: Datos[]
}

const datosAbiertos = ref<DatosAbiertos | null>(null)

async function consultarDatosAbiertos() {
  datosAbiertos.value = await fetchPublicJson<DatosAbiertos>(
    '/secciones/datosAbiertos/datosAbiertos.json',
  )
}

onMounted(async () => {
  await consultarDatosAbiertos()
})
</script>

<template>
  <section class="datos-abiertos">

    <!-- TÍTULO -->
    <h2 class="datos-abiertos__titulo">
      Datos abiertos
    </h2>

    <!-- TEXTO PRINCIPAL -->
    <p class="datos-abiertos__descripcion">
      Descarga, utiliza y comparte las bases de datos del Proyecto de Presupuesto
      de Egresos de la Federación 2027.
    </p>

    <!-- PRIMER GRUPO DE BOTONES -->
    <div v-if="datosAbiertos" class="datos-abiertos__grid datos-abiertos__grid--principal">
      <CardDatosAbiertos v-for="(dato, idx) in datosAbiertos.datos" :key="dato.url" :card="dato" :idx="idx" />
    </div>

    <!-- SEGUNDO TEXTO -->
    <p class="datos-abiertos__subtitulo">
      Conoce los Anexos transversales contemplados en el PPEF 2027.
    </p>

    <!-- SEGUNDO GRUPO DE BOTONES -->
    <div v-if="datosAbiertos" class="datos-abiertos__grid datos-abiertos__grid--anexos">
      <CardDatosAbiertos v-for="(dato, idx) in datosAbiertos.anexos" :key="dato.url" :card="dato" :idx="idx" />
    </div>

  </section>
</template>

<style scoped>
.datos-abiertos {
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;
  padding: 3.5rem 2.5rem 5rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  font-family: 'Noto Sans', sans-serif;
}


/* =========================================================
   TÍTULO
   ========================================================= */

.datos-abiertos__titulo {
  margin: 0;

  color: #00a1c9;

  font-family: 'Noto Sans', sans-serif;

  font-size: clamp(2.5rem, 4vw, 4rem);
  font-weight: 800;

  line-height: 1.1;
  text-align: center;
}


/* =========================================================
   TEXTO PRINCIPAL
   ========================================================= */

.datos-abiertos__descripcion {
  margin: 2.5rem 0 2rem;

  color: #111;

  font-family: 'Noto Sans', sans-serif;

  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.5;

  text-align: center;
}


/* =========================================================
   GRIDS
   ========================================================= */

.datos-abiertos__grid {
  width: 100%;

  display: grid;

  gap: 1.5rem;
}


/* 3 BOTONES */

.datos-abiertos__grid--principal {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}


/* 2 BOTONES CENTRADOS */

.datos-abiertos__grid--anexos {
  grid-template-columns: repeat(2, minmax(0, 1fr));

  width: min(100%, 900px);
}


/* =========================================================
   SEGUNDO TEXTO
   ========================================================= */

.datos-abiertos__subtitulo {
  margin: 3.5rem 0 1.5rem;

  color: #111;

  font-family: 'Noto Sans', sans-serif;

  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.5;

  text-align: center;
}


/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 1024px) {

  .datos-abiertos__grid--principal {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .datos-abiertos__grid--anexos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

}


/* =========================================================
   MÓVIL
   ========================================================= */

@media (max-width: 640px) {

  .datos-abiertos {
    padding: 2.5rem 1.25rem 4rem;
  }

  .datos-abiertos__descripcion,
  .datos-abiertos__subtitulo {
    font-size: 1rem;
  }

  .datos-abiertos__descripcion {
    margin-top: 1.75rem;
  }

  .datos-abiertos__subtitulo {
    margin-top: 2.5rem;
  }

  .datos-abiertos__grid--principal,
  .datos-abiertos__grid--anexos {
    grid-template-columns: 1fr;
    width: 100%;
  }

}
</style>