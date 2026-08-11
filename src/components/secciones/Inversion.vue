<template>
  <section class="gasto-inversion">
    <h2 class="titulo">{{ datos.titulo }}</h2>

    <p class="texto-medio">{{ datos.pre_monto }}</p>

    <div class="monto-principal-wrapper">
      <span class="monto-principal">{{ datos.monto_total }}</span>
      <span class="unidad-principal">{{ datos.unidad_total }}</span>
    </div>

    <p class="texto-medio">{{ datos.post_monto }}</p>

    <!-- ═════════ BLOQUES DINÁMICOS ═════════ -->
    <div class="grid-bloques">
      <div
        v-for="(bloque, index) in datos.bloques"
        :key="index"
        class="bloque-item"
        :class="{ 'bloque-mascota': bloque.tipo === 'mascota' }"
      >
        <!-- Contenido condicional -->
        <div class="header-bloque">
          <template v-if="bloque.tipo === 'mascota'">
            <div class="mascota-container">
              <Mascota :mascota="7" ancho="8rem" alto="8rem" />
            </div>
          </template>
          <template v-else>
            <p class="porcentaje">{{ bloque.porcentaje }}</p>
          </template>
        </div>

        <p class="descripcion" v-html="bloque.descripcion"></p>

        <div class="monto-wrapper">
          <p class="monto-bloque">{{ bloque.monto }}</p>
          <p class="unidad-bloque">{{ bloque.unidad }}</p>
        </div>
      </div>
    </div>

    <!-- ═════════ FOOTER ═════════ -->
    <p class="footer-text">{{ datos.footer }}</p>

    <div class="mapa-placeholder h-full ">
      <ViewMapa/>
    </div>
  </section>
</template>

<script setup>
import datos from '@/data/gasto_inversion.json'
// 🔴 IMPORTANTE: Asegúrate de que la ruta de importación coincida con tu proyecto
import Mascota from '@/components/utils/Mascota.vue'
import ViewMapa from './Inversion/ViewMapa.vue';
</script>

<style scoped>
.gasto-inversion {
    border-radius: 40px;
    font-family: 'Noto Sans', sans-serif;
}

/* ── Título ── */
.titulo {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #0a5a45;
  /* Verde oscuro */
  margin-bottom: 1.5rem;
}

.texto-medio {
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #222;
  margin: 0.5rem 0;
}

/* ── Monto Principal (Grande) ── */
.monto-principal-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
}

.monto-principal {
  font-size: clamp(3.5rem, 8vw, 3.5rem);
  font-weight: 800;
  color: #2bc0a3;
  /* Verde menta claro */
  line-height: 1;
  margin-bottom: 0.2rem;
}

.unidad-principal {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0a5a45;
  /* Verde oscuro */
}

/* ── Grid de Bloques ── */
.grid-bloques {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0 2rem;
}

.bloque-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.bloque-mascota {
  padding-top: 0;
}

.header-bloque {
  height: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.8rem;
}

.mascota-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.porcentaje {
  font-size: clamp(2.5rem, 4vw, 3.2rem);
  font-weight: 800;
  color: #b28d2e;
  /* Dorado */
  margin: 0 0 0.4rem 0;
  line-height: 1;
}

.descripcion {
  font-size: 1rem;
  font-weight: 700;
  color: #0a5a45;
  /* Verde oscuro */
  margin: 0 0 1.2rem 0;
  line-height: 1.4;
  min-height: 3rem;
  /* Altura uniforme */
}

.monto-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.monto-bloque {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0a5a45;
  margin: 0;
  line-height: 1.2;
}

.unidad-bloque {
  font-size: 0.95rem;
  font-weight: 500;
  color: #757575;
  /* Gris */
  margin: 0.1rem 0 0 0;
}

/* ── Footer ── */
.footer-text {
  text-align: left;
  font-size: 0.95rem;
  color: #333;
  line-height: 1.6;
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

/* ── Mapa Placeholder ── */
.mapa-placeholder {
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 1.2rem;
  font-weight: 600;
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */
@media (max-width: 900px) {
  .grid-bloques {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid-bloques {
    grid-template-columns: 1fr;
    gap: 3rem;
  }


  .descripcion {
    min-height: auto;
  }
}
</style>
