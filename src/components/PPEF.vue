<template>
  <div class="flex">
    <div class="flex flex-col lg:flex-row items-center justify-between  w-full">
      <!-- Columna izquierda: Texto -->
      <div class="flex  flex-col text-white gap-10 w-full">
        <h1 class="titulo-principal">
          <span class="linea">Paquete</span>
          <span class="linea">Económico 2027</span>
        </h1>

        <div class="bloque-datos">
          <p class="etiqueta">{{ datos.subtituloGasto }}</p>
          <p class="monto">{{ datos.monto }}</p>
          <p class="unidad">{{ datos.unidad }}</p>
        </div>

        <div class="bloque-crecimiento">
          <p class="porcentaje">{{ datos.crecimiento }}</p>
          <p class="comparativa">{{ datos.comparativa }}</p>
          <p class="nota">{{ datos.nota }}</p>
        </div>
      </div>

      <!-- Columna derecha: Mascota -->
      <div class="">
        <Mascota :mascota="datos.mascota.indice" :ancho="datos.mascota.ancho" :alto="datos.mascota.alto" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Mascota from './utils/Mascota.vue'
import datosJson from '../data/paquete.json'

const datos = ref(datosJson)
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 70dvh;
  max-width: 1800px;
  margin: 0 auto;
  padding: 3rem 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  gap: 3rem;
}

/* ── Columna texto ── */
.hero-text {
  flex: 1;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-left: 6rem;
}

.titulo-principal {
  margin: 0;
  font-family: 'Noto Sans Black', sans-serif;
  font-weight: 900;
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.titulo-principal .linea {
  display: block;
}

/* ── Bloque monto ── */
.bloque-datos {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.etiqueta {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.95;
  color: #ffffff;
}

.monto {
  margin: 0;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 800;
  font-size: clamp(2.5rem, 4.5vw, 4rem);
  color: #a5f3fc;
  /* cyan claro */
  line-height: 1;
  letter-spacing: -0.02em;
}

.unidad {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
}

/* ── Bloque crecimiento ── */
.bloque-crecimiento {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.porcentaje {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 800;
  line-height: 1;
  color: #ffffff;
}

.comparativa {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #ffffff;
}

.nota {
  margin: 0;
  font-size: 1rem;
  font-style: italic;
  opacity: 0.9;
  color: #ffffff;
}

/* ── Columna imagen ── */
.hero-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 500px;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .hero {
    padding: 2rem 1.5rem;
    min-height: auto;
  }

  .hero-content {
    flex-direction: column-reverse;
    text-align: center;
    gap: 2rem;
  }

  .hero-text {
    gap: 1.8rem;
    align-items: center;
  }

  .hero-image {
    max-width: 280px;
  }
}
</style>
