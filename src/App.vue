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
import Agenda from './components/secciones/Agenda.vue'
import Ciudadania from './components/secciones/Ciudadania.vue'
import demoModal from './components/secciones/ModalDemo.vue'
import SustentoNormativo from './components/secciones/SustentoNormativo.vue'
import { onMounted, onUnmounted, ref } from 'vue'

const activeHash = ref(window.location.hash)

const updateActiveSection = () => {
  const sections = [...document.querySelectorAll('#secciones div[id]')]
  const offset = 120

  let currentSection = null

  for (const section of sections) {
    const top = section.getBoundingClientRect().top

    if (top <= offset) {
      currentSection = section
    } else {
      break
    }
  }

  if (currentSection) {
    const hash = `#${currentSection.id}`

    if (activeHash.value !== hash) {
      activeHash.value = hash
      history.replaceState(null, '', hash)
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection, {
    passive: true,
    passive: true,
  })

  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})
</script>

<template>
  <NavPlantilla :active="activeHash" />

  <div id="secciones" class="precriterios bg-white grid grid-template-">
    <div id="inicio" class="seccion" style="background: rgb(6, 101, 122); border-radius: 0 0 70px 70px">
      <Precriterios />
    </div>
    <div class="seccion">
      <Informacion />
    </div>
    <div class="seccion">
      <Fechas />
    </div>
    <div id="entorno-economico" class="seccion"
      style="background: rgb(6, 101, 122); border-radius: 70px 70px 70px 70px">
      <EntornoEconomico />
    </div>
    <div id="ingreso" class="seccion">
      <Ingreso />
    </div>
    <div id="gasto" class="seccion" style="background: rgb(93, 193, 190); border-radius: 70px 70px 70px 70px">
      <Gasto />
    </div>
    <div class="seccion">
      <DistribucionGasto />
    </div>
    <div class="seccion">
      <inversion />
    </div>
    <div id="gasto-federalizado" class="seccion"
      style="background: rgb(93, 193, 190); border-radius: 70px 70px 70px 70px">
      <Federalizado />
    </div>
    <div>
      <Agenda />
    </div>
    <div>
      <Ciudadania />
    </div>
    <div id="datos-abiertos" class="seccion"></div>
    <div class="seccion">
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

  min-height: 100dvh;

  /* background-color: greenyellow; */
}

.seccion {
  padding: 3rem 1rem;
  max-width: 100dvw;
}

@media (min-width: 1023px) {
  .seccion {
    padding: 3rem 10rem;
    max-width: 100dvw;
  }
}
</style>
