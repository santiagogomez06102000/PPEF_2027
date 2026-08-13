<template>
  <section class="fechas" v-if="datos">
    <h2 class="titulo">{{ datos.titulo }}</h2>

    <div class="acordeon">
      <div v-for="(item, idx) in datos.items" :key="item.id" class="item" :class="{ abierto: activo === idx }">
        <!-- Cabecera -->
        <div class="indicador">
          <span class="circulo"></span>
          <span v-if="idx < datos.items.length - 1" class="linea"></span>
        </div>
        <button class="cabecera" @click="toggle(idx)" :aria-expanded="activo === idx">
          <span class="fecha">{{ item.fecha }}</span>
          <span class="flecha" aria-hidden="true">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.5L8 8.5L15 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </span>
        </button>

        <!-- Contenido desplegable -->
        <div class="contenido-wrapper">
          <div class="contenido-inner">
            <div class="contenido">
              <p>{{ item.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="texto-final">{{ datos.textoFinal }}</p>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchPublicJson } from '../utils/utils';
const datos=ref({});
onMounted(async ()=>{
  datos.value = await fetchPublicJson("/secciones/fechas/fechas.json");
})
const activo = ref(0)

const toggle = (idx) => {
  activo.value = activo.value === idx ? null : idx
}
</script>

<style scoped>
.fechas {
  max-width: 100%;
}

/* ── Título ── */
.titulo {
  text-align: center;
  color: #00a8c6;
  margin-bottom: 2.5rem;
  font-family: 'Noto Sans Black', sans-serif;
}

/* ── Acordeón ── */
.acordeon {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.item {
  position: relative;
}

/* ── Cabecera ── */
.cabecera {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  color: #222;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  padding-left: 3rem;
}

.cabecera:hover {
  background-color: #fafafa;
}

/* Indicador visual (círculo + línea) */
.indicador {
  position: absolute;
  width: 24px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0.9rem;
  left: 0.5rem;
}

.circulo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #b8860b;
  z-index: 2;
  position: absolute;
  top: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.linea {
  position: absolute;
  top: 24px;
  left: 50%;
  /*transform: translateX(-50%);*/
  width: 2px;
  height: calc(100%);
  background-color: #b8860b;
  z-index: 1;
}

/* Último item: ocultar línea sobrante */
.item:last-child .linea {
  display: none;
}

.fecha {
  flex: 1;
  font-weight: 700;
  font-size: 1rem;
}

.flecha {
  color: #555;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.item.abierto .flecha {
  transform: rotate(180deg);
}

/* ═══════════════════════════════════════
   TRANSICIÓN MEJORADA — EFECTO PUERTA CORREDIZA
   ═══════════════════════════════════════ */

.contenido-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.item.abierto .contenido-wrapper {
  grid-template-rows: 1fr;
}

/* El contenido interno controla opacidad y deslizamiento */
.contenido-inner {
  min-height: 0;
  opacity: 0;
  transform: translateY(-12px);
  transition:
    opacity 0.3s ease-out 50ms,
    transform 0.3s ease-out 50ms;
}

.item.abierto .contenido-inner {
  opacity: 1;
  transform: translateY(0);
}

.contenido {
  margin-left: calc(24px + 1rem);
  margin-right: 1.2rem;
  padding: 1rem 1.2rem;
  background-color: #f8f8f8;
  border-radius: 0 8px 8px 8px;
  margin-bottom: 0.5rem;
}

.contenido p {
  margin: 0;
  line-height: 1.7;
  color: #333;
  font-size: 0.98rem;
}

/* ── Transición ── */
.desplegar-enter-active,
.desplegar-leave-active {
  transition: all 0.25s ease;
  max-height: 200px;
}

.desplegar-enter-from,
.desplegar-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ── Texto final ── */
.texto-final {
  text-align: center;
  margin-top: 2.5rem;
  line-height: 1.6;
  color: #000000;
  margin-left: auto;
  margin-right: auto;
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */
@media (max-width: 640px) {
  .cabecera {
    padding: 0.9rem 0.6rem;
    gap: 0.75rem;
    padding-left: 3rem;

  }

  .contenido {
    margin-left: calc(24px + 0.75rem);
    margin-right: 0.6rem;
    padding: 0.9rem;
  }

  .fecha {
    font-size: 0.95rem;
  }
}
</style>
