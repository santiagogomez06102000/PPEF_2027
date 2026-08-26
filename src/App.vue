<script setup>
/* import { RouterLink, RouterView } from 'vue-router' */
import Footer from './components/footer/Footer.vue'
import NavPlantilla from './components/navbar/NavPlantilla.vue'

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
import SustentoNormativo from './components/secciones/SustentoNormativo.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import DatosAbiertos from './components/secciones/DatosAbiertos.vue'
import PPEF from './components/PPEF.vue'

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

  <div id="secciones" class="ppef bg-white grid grid-template-">
    <div id="inicio" class="seccion" style="background: #06657a; border-radius: 0 0 70px 70px">
      <PPEF />
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
    <div id="gasto" class="seccion" style="background: #e0f5f5; border-radius: 70px 70px 70px 70px">
      <Gasto />
    </div>
    <div class="seccion">
      <DistribucionGasto />
    </div>
    <div class="seccion">
      <inversion />
    </div>
    <div id="gasto-federalizado" class="seccion"
      style="background: rgb(255, 255, 255); border-radius: 70px 70px 70px 70px">
      <Federalizado />
    </div>
    <div class="bloque-agenda-ciudadania">

      <div class="bloque-agenda">
        <Agenda />
      </div>

      <div class="bloque-ciudadania">
        <Ciudadania />
      </div>

    </div>
    <div id="datos-abiertos" class="seccion">
      <DatosAbiertos />
    </div>


  </div>
  <SustentoNormativo class="hidden" />
  <div class="bg-[#3a4049] mb-1 py-4 text-white">
    <div class=" text-center">Envía tus dudas y comentarios
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSe3Sr9_GxEUeZfXXkwlk9w51vu5phPXsj6jnzup9J_kEHSOeQ/viewform?usp=header"
        target="_blank" class="rounded border border-white px-4 hover:bg-gray-800 transition ease duration-300">aquí</a>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.ppef {
  display: grid;

  min-height: 100dvh;

  /* background-color: greenyellow; */
}

.seccion {
  padding: 3rem 1rem;
  max-width: 100dvw;
}

.bloque-agenda-ciudadania {
  width: 100%;

  /* Este es el fondo que se ve debajo de Agenda */
  background: rgb(209, 232, 232);
  border-radius: 70px 70px 70px 70px;
}


/* =========================================================
   AGENDA
   ========================================================= */

.bloque-agenda {
  position: relative;
  z-index: 2;

  background: linear-gradient(to bottom,
      rgb(0, 49, 97) 0%,
      rgb(1, 118, 139) 50%,
      rgb(1, 141, 153) 100%);

  /* Solo redondeamos la parte inferior */
  border-radius: 70px 70px 70px 70px;

  overflow: hidden;
}


/* =========================================================
   CIUDADANÍA
   ========================================================= */

.bloque-ciudadania {
  position: relative;
  z-index: 1;

  background: rgb(209, 232, 232);

  /* Ya no necesita border-radius arriba */
  border-radius: 0 0 70px 70px;
}

@media (min-width: 1023px) {
  .seccion {
    padding: 3rem 10rem;
    max-width: 100dvw;
  }
}
</style>
