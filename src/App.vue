<script setup>
/* import { RouterLink, RouterView } from 'vue-router' */
import Footer from './components/footer/Footer.vue'
import NavPlantilla from './components/navbar/NavPlantilla.vue'
import Precriterios from './components/PPEF.vue'
/* import './css/cubo.css' */

/* SECCIONES */
import Informacion from './components/secciones/Informacion.vue'
import Fechas from './components/secciones/Fechas.vue'
import EntornoEconomico from './components/secciones/EntornoEconomico.vue'
import Ingreso from './components/secciones/Ingreso.vue'
import Gasto from './components/secciones/Gasto.vue'
import DistribucionGasto from './components/secciones/DistribucionGasto.vue'
import inversion from './components/secciones/Inversion.vue'
import Federalizado from './components/secciones/Federalizado.vue'
import demoModal from './components/secciones/ModalDemo.vue'
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
    <div style="background: rgb(6, 101, 122); border-radius: 70px 70px 70px 70px;">
      <EntornoEconomico />
    </div>
    <div>
      <Ingreso />
    </div>
    <div style="background: rgb(93, 193, 190); border-radius: 70px 70px 70px 70px;">
      <Gasto />
    </div>
    <div>
      <DistribucionGasto />
    </div>
    <div>
      <inversion />
    </div>
    <div style="background: rgb(93, 193, 190); border-radius: 70px 70px 70px 70px;">
      <Federalizado />
    </div>
    <div>
      <demoModal />
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
