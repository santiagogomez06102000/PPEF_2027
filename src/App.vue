<script setup>
/* import { RouterLink, RouterView } from 'vue-router' */
import Footer from './components/footer/Footer.vue'
import NavPlantilla from './components/navbar/NavPlantilla.vue'
import Precriterios from './components/PPEF.vue'
/* import './css/cubo.css' */

/* SECCIONES */
import Desempenio_2025 from './components/secciones/Desempenio_2025.vue'
import Estimaciones_2026_2027 from './components/secciones/Estimaciones_2026_2027.vue'
import Impactos_2027 from './components/secciones/Impactos_2027.vue'
import Programas_prioritarios from './components/secciones/Programas_prioritarios.vue'
import SustentoNormativo from './components/secciones/SustentoNormativo.vue'
import Finanzas from './components/secciones/Finanzas.vue'
</script>

<template>
  <div class="precriterios bg-white">
    <NavPlantilla />

    <div style="background: rgb(6, 101, 122); border-radius: 0 0 70px 70px;">
      <Precriterios />
    </div>

    <div class="main-content intercalar-bgColor">
      <div>
        <Desempenio_2025 />
      </div>
      <div>
        <Estimaciones_2026_2027 />
      </div>
      <div>
        <Finanzas />
      </div>
      <div>
        <Impactos_2027 />
      </div>
      <div>
        <Programas_prioritarios />
      </div>
    </div>
    <!-- <div class="w-[100dvw]" style="padding: 1rem 0rem">
      
    </div> -->
  </div>
  <SustentoNormativo />
  <Footer />
</template>

<style scoped>
.display-cubo {
  margin: 0 auto;
  background-color: transparent;
  /* 
  background-image: url(@/assets/img/seccion1.png); */
}

.precriterios {
  display: grid;
  grid-template-rows: auto 1fr auto;

  min-height: 100dvh;

  /* background-color: greenyellow; */
}

.intercalar-bgColor>*>* :deep(> div) {
  max-width: 1500px;
  padding: 4rem 0px 2rem 0px;
  margin: 0 auto;

  /* border: solid 2px blue */
}

.intercalar-bgColor>*>* {
  height: auto;
  /* border: solid 2px red; */
  border-radius: 200px 0px 150px 0px;
  /*  overflow: hidden; */
}

.intercalar-bgColor>*:nth-child(even)>* {
  background-color: white;
  /*  background: linear-gradient(135deg, #FFF9E6 70%, #E6E6FA 100%); */
}

.intercalar-bgColor>*:nth-child(even) {
  background-color: rgb(237, 242, 252);
  /* lila */
  /*  background: linear-gradient(135deg, #FFF9E6 70%, #E6E6FA 100%); */
}

.intercalar-bgColor>*:nth-child(odd)>* {
  background-color: rgb(237, 242, 252);
  /* lila */
  /* background: linear-gradient(135deg, #E6E6FA 70%, #FFF9E6 100%); */
}

.intercalar-bgColor>*:nth-child(odd) {
  background-color: white;
  /* background: linear-gradient(135deg, #E6E6FA 70%, #FFF9E6 100%); */
}

@media (max-width: 1024px) {
  .intercalar-bgColor>*>* :deep(> div) {
    max-width: 1500px;
    padding: 4rem 1rem 2rem 1rem !important;

    /* border: solid 2px blue */
  }

  .intercalar-bgColor>*>* {
    height: auto;
    /* border: solid 2px red; */
    border-radius: 5rem 0px 3rem 0px;
    /*  overflow: hidden; */
  }
}
</style>
