<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPublicJson, getCardClass } from '../utils/utils'
import CardDatosAbiertos, { type Datos } from './DatosAbiertos/CardDatosAbiertos.vue'

interface DatosAbiertos {
  titulo:string
  datos:Datos[]
}

const datosAbiertos = ref<DatosAbiertos[] | null>(null)

async function consultarDatosAbiertos() {
  datosAbiertos.value = await fetchPublicJson<DatosAbiertos[]>(
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

   <div v-for="datoAbierto in datosAbiertos" :key="datoAbierto.titulo" >
     <!-- TEXTO PRINCIPAL -->
    <p class="datos-abiertos__descripcion" v-html="datoAbierto.titulo">
    </p>

    <!-- GRUPO DE BOTONES -->
    <div v-if="datoAbierto.datos" class="grid grid-cols-12 gap-[1.5rem] w-full">
      <CardDatosAbiertos v-for="(dato, idx) in datoAbierto.datos" :key="dato.url" :card="dato" :idx="idx"
        :class="getCardClass(datoAbierto.datos.length, idx)"
        class="grid-item" />
    </div>
   </div>

  </section>
</template>

<style scoped>
.datos-abiertos {
  width: 100%;

  padding: 3.5rem 2.5rem 5rem;

  display: flex;
  flex-direction: column;
  align-items: stretch;

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

}



</style>