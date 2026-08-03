<script setup>
/* import { RouterLink, RouterView } from 'vue-router' */
import Footer from './components/footer/Footer.vue'
import NavPlantilla from './components/navbar/NavPlantilla.vue'
import Precriterios from './components/PPEF.vue'
/* import './css/cubo.css' */

/* SECCIONES */
import Informacion from './components/secciones/Informacion.vue'
import Fechas from './components/secciones/Fechas.vue'
import SustentoNormativo from './components/secciones/SustentoNormativo.vue'

</script>

<template>
  <div class="precriterios bg-white">
    <NavPlantilla />

    <div style="background: rgb(6, 101, 122); border-radius: 0 0 70px 70px;">
      <Precriterios />
    </div>
    <div>
      <Informacion />
    </div>
    <div>
      <Fechas />
    </div>
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
</style>
