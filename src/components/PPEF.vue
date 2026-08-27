<template>
  <section class="hero">
    <div class="hero-content">

      <!-- ========================================
           1. TÍTULO
      ========================================= -->
      <div class="hero-title">
        <h1 class="titulo-principal">
          <span class="linea">
            Paquete Económico 2027
          </span>
        </h1>
      </div>


      <!-- ========================================
           2. MASCOTA
      ========================================= -->
      <div class="hero-image">
        <Mascota :mascota="datos.mascota.indice" :ancho="datos.mascota.ancho" :alto="datos.mascota.alto" />
      </div>


      <!-- ========================================
           3. DATOS
      ========================================= -->
      <div class="hero-info">

        <div class="bloque-datos">
          <p class="etiqueta">
            {{ datos.subtituloGasto }}
          </p>

          <p class="monto">
            {{ datos.monto }}
          </p>

          <p class="unidad">
            {{ datos.unidad }}
          </p>
        </div>


        <div class="bloque-crecimiento">
          <p class="porcentaje">
            {{ datos.crecimiento }}
          </p>

          <p class="comparativa">
            {{ datos.comparativa }}
          </p>

          <p class="nota">
            {{ datos.nota }}
          </p>
        </div>

      </div>

    </div>
  </section>
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

  width: 100%;
  min-height: 70dvh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 3rem;
  box-sizing: border-box;

  overflow: visible;
}

.hero-content {
  width: 100%;
  max-width: 1500px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr) minmax(300px, 450px) minmax(0, 1fr);

  align-items: center;

  gap: clamp(2rem, 4vw, 5rem);
}


/* ========================================
   TÍTULO
======================================== */

.hero-title {
  width: 100%;
  min-width: 0;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  color: #ffffff;
}

.titulo-principal {
  margin: 0;

  font-family: 'Noto Sans Black', sans-serif;
  font-weight: 900;

  font-size: clamp(2.8rem, 4vw, 4.5rem);

  line-height: 1.05;
  letter-spacing: -0.02em;

  text-align: right;
}

.titulo-principal .linea {
  display: block;
}


/* ========================================
   MASCOTA
======================================== */

.hero-image {
  width: 100%;
  min-width: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image :deep(img) {
  display: block;

  width: 100%;
  max-width: 450px;

  height: auto;

  object-fit: contain;
}


/* ========================================
   DATOS
======================================== */

.hero-info {
  width: 100%;
  min-width: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 2.5rem;

  color: #ffffff;
}

.bloque-datos {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.etiqueta {
  margin: 0;

  font-size: 1.1rem;
  font-weight: 600;

  color: #ffffff;
}

.monto {
  margin: 0;

  font-family: 'Noto Sans', sans-serif;
  font-weight: 800;

  font-size: clamp(2.5rem, 4vw, 4rem);

  color: #a5f3fc;

  line-height: 1;
}

.unidad {
  margin: 0;

  font-size: 1.1rem;
  font-weight: 700;

  color: #ffffff;
}

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

  color: #ffffff;
}


/* ==========================================================
   MASCOTA
========================================================== */

.hero-image {
  width: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  min-width: 0;
}


/*
  Si Mascota.vue genera una imagen,
  evita que pueda romper el grid.
*/

.hero-image :deep(img) {
  display: block;

  width: 100%;
  max-width: 450px;

  height: auto;

  object-fit: contain;
}


/* ==========================================================
   LAPTOPS
   1025px - 1300px
========================================================== */

@media (min-width: 1025px) and (max-width: 1300px) {

  .hero {
    padding-inline: 2rem;
  }


  .hero-content {
    max-width: 1200px;

    grid-template-columns:
      minmax(0, 1fr) minmax(260px, 360px) minmax(0, 1fr);

    gap: 2rem;
  }


  .titulo-principal {
    font-size: clamp(2.3rem, 3.6vw, 3.5rem);
  }


  .monto {
    font-size: clamp(2.2rem, 3.5vw, 3.3rem);
  }


  .hero-image :deep(img) {
    max-width: 360px;
  }

}

/* ==========================================================
   RESPONSIVE <= 1024px
========================================================== */

@media (max-width: 1024px) {

  .hero {
    min-height: auto;

    padding:
      clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem);
  }


  .hero-content {
    display: flex;
    flex-direction: column;

    width: 100%;
    max-width: 850px;

    gap: 3rem;

    margin-inline: auto;

    /* IMPORTANTE */
    align-items: stretch;
  }


  /* ========================================================
     TÍTULO
  ======================================================== */

  .hero-title {
    order: 1;

    width: 100%;

    display: flex;

    justify-content: flex-start;
    align-items: flex-start;
  }


  .titulo-principal {
    width: 100%;
    max-width: none;

    text-align: left;

    font-size: clamp(3rem, 8vw, 5rem);
  }


  /* ========================================================
     INFORMACIÓN
  ======================================================== */

  .hero-info {
    order: 2;

    width: 100%;

    align-items: flex-start;

    text-align: left;

    gap: 2rem;
  }


  .bloque-datos,
  .bloque-crecimiento {
    width: 100%;

    align-items: flex-start;

    text-align: left;
  }


  .etiqueta {
    font-size: clamp(1.1rem, 2.3vw, 1.4rem);
  }


  .monto {
    font-size: clamp(3rem, 8vw, 5.5rem);
  }


  .unidad {
    font-size: clamp(1.15rem, 2.5vw, 1.5rem);
  }


  .porcentaje {
    font-size: clamp(2.5rem, 6vw, 4rem);
  }


  .comparativa {
    font-size: clamp(1.1rem, 2.4vw, 1.4rem);
  }


  .nota {
    font-size: clamp(1rem, 2vw, 1.2rem);
  }


  /* ========================================================
     MASCOTA
  ======================================================== */

  .hero-image {
    order: 3;

    width: 100%;

    justify-content: center;
  }


  .hero-image :deep(img) {
    width: min(70vw, 550px);
    max-width: 550px;

    height: auto;
  }

}


/* ==========================================================
   MÓVIL <= 640px
========================================================== */

@media (max-width: 640px) {

  .hero {
    padding: 2.5rem 1.25rem;
  }


  .hero-content {
    gap: 2.25rem;
  }


  .titulo-principal {
    font-size: clamp(2.5rem, 12vw, 4rem);

    text-align: left;
  }


  .hero-info {
    align-items: flex-start;

    text-align: left;
  }


  .bloque-datos,
  .bloque-crecimiento {
    align-items: flex-start;

    text-align: left;
  }


  .monto {
    font-size: clamp(2.8rem, 13vw, 4.5rem);

    text-align: left;
  }


  .hero-image :deep(img) {
    width: min(90vw, 450px);
  }

}
</style>