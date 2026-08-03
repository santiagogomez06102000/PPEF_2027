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
import Tooltip from './components/secciones/Desempenio/Tooltip.vue'
import Definicion from './components/secciones/Definicion/Tooltip_definicion.vue'
import Mascota from './components/utils/Mascota.vue'
</script>

<template>
  <div class="precriterios bg-white">
    <NavPlantilla />

    <div class="display-cubo">
      <Precriterios />
    </div>

    <div class="main-content intercalar-bgColor">
      <div>
        <section class="grid grid-cols-6 gap-x-4 text-white" :style="{
          background: 'linear-gradient(90deg,rgba(6, 165, 193, 1) 0%, rgba(4, 124, 145, 1) 100%) !important'
        }">
          <div class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6">
            <h2>¿Cuál es la estrategia de este ciclo fiscal?</h2>
            <div class="flex items-center flex-col lg:flex-row">
              <p class="flex-1" style="color: white;">
                El Gobierno de México reafirma su compromiso con el manejo responsable de las finanzas
                públicas. En 2026 y 2027 continuará la reducción gradual del déficit con el objetivo
                de mantener la
                <!--<Definicion prop="Esta es una prueba de definición, lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum">capacidad</Definicion>-->capacidad
                del
                Estado para impulsar el desarrollo del país y asegurar el acceso efectivo a los
                derechos constitucionales mediante los Programas para el Bienestar.
                <Tooltip
                  text="Comunicado No. 26. (1 de abril de 2026) Hacienda entrega al H. Congreso de la Unión los “Pre-Criterios 2027”, Pág 1, Párr.1."
                  :fuente="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="rgb(78, 191, 86)"
                    class="bi bi-leaf-fill" viewBox="0 0 16 16">
                    <path
                      d="M1.4 1.7c.217.289.65.84 1.725 1.274 1.093.44 2.885.774 5.834.528 2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045-.142-.162-.402-.102-.379.112.108.985 1.104 1.82 1.844 2.308 2.37 1.566 5.772-.118 7.6 3.071.505.8 1.374 2.7 1.75 4.292.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042 1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.124-.887-1.889-2.095-2.39-3.383-1-2.562-1-5.536-.65-7.28L.73.806z">
                    </path>
                  </svg>
                </Tooltip>
              </p>
              <Mascota :mascota="2" ancho="15rem" alto="15rem" />
            </div>
          </div>
        </section>
      </div>
      <div
        style="background:linear-gradient(90deg,rgba(6, 165, 193, 1) 0%, rgba(6, 165, 193, 1) 55%, rgba(154, 245, 195, 1) 58%, rgba(154, 245, 195, 1) 100%)">
        <Desempenio_2025 />
      </div>
      <div
        style="background: linear-gradient(90deg,rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(237, 242, 252, 1) 51%, rgba(237,242,252, 1) 100%)">
        <Estimaciones_2026_2027 />
      </div>
      <div
        style="background: linear-gradient(90deg,rgba(228, 245, 234, 1) 0%, rgba(228, 245, 234, 1) 50%,rgba(122, 211, 227, 1) 51%, rgba(122, 211, 227, 1) 100%);">
        <Finanzas />
      </div>
      <div
        style="background:linear-gradient(90deg,rgba(237, 242, 252, 1) 0%, rgba(237, 242, 252, 1) 50%, rgba(255, 255, 255, 1) 51%, rgba(255, 255, 255, 1) 100%);">
        <Impactos_2027 />
      </div>
      <div
        style="background: linear-gradient(90deg, rgb(170 236 248) 0%,  rgb(170 236 248) 50%, rgba(228, 250, 251, 1) 51%, rgba(228, 250, 251, 1) 100%);">
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
