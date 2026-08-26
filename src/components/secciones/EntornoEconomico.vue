<template>
  <section class="entorno" v-if="datos">
    <h2 class="titulo">{{ datos.titulo }}</h2>

    <div class="textos">
      <p v-for="(parrafo, i) in datos.parrafos" :key="i">
        {{ parrafo }}
      </p>
    </div>

    <div class="grid-cards">
      <button v-for="(card, index) in datos.cards" :key="card.id" class="card" @click="abrirModal(generales[index])">
        <h3>{{ card.titulo }}</h3>
        <img :src="baseUrl + card.img" :alt="card.titulo" class="w-full"/>
      </button>
    </div>
    <Modal v-model="modal.isOpen.value" :content="modal.content.value" />
  </section>
</template>

<script setup>
import Modal from '@/components/utils/Modal.vue'
import { useModal } from '@/components/composables/useModal.js'

// Importar JSONs de modales
import { fetchPublicJson } from '../utils/utils';
import { onMounted, ref } from 'vue';
import { baseUrl } from './Inversion/mapController';

const datos=ref({});
const generales=ref([])
onMounted(async ()=>{
  datos.value = await fetchPublicJson("/secciones/EntornoEconomico/entornoEconomico.json");
  generales.value = await fetchPublicJson("/secciones/EntornoEconomico/cards.json")
})

// Instancia del composable para el modal
const modal = useModal()

function abrirModal(data) {
  modal.open(data)
}
</script>

<style scoped>
.entorno {

  color: #00a1cd;
  position: relative;
}

/* ── Título ── */
.titulo {
  text-align: center;
  margin-bottom: 2.5rem;
  font-family: 'Noto Sans Black', sans-serif;
  letter-spacing: -0.02em;
}

/* ── Párrafos ── */
.textos {
  margin: 0 auto 3.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.textos p {
  margin: 0;
  line-height: 1.7;
  text-align: justify;
  color: #000;
}

/* ── Grid de tarjetas ── */
.grid-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.2rem;

  width: min(1200px, calc(100% - 5rem));

  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* ── Tarjeta ── */
.card {
  background-color: #0d6881;
  color: #fff;
  border-radius: 36px;
  padding: 1.6rem 1.4rem;
  min-height: 260px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.card h3 {
  margin: 0;
  color:#fff;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.3;
  font-family: 'Noto Sans', sans-serif;
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */

/* Tablet grande / laptop pequeña: 3 en 3 */
@media (max-width: 1024px) {
  .grid-cards {
    position: static;
    transform: none;
    left: auto;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    margin: 0 auto;
  }
}

/* Tablet / móvil grande: 2 en 2 */
@media (max-width: 768px) {

  .textos p {
    text-align: left;
    font-size: 1rem;
  }

  .grid-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .card {
    min-height: 200px;
    border-radius: 28px 28px 0 0;
    padding: 1.4rem 1.2rem;
  }

  .card h3 {
    font-size: 1.05rem;
  }
}

/* Móvil: 1 en 1 */
@media (max-width: 480px) {
  .grid-cards {
    grid-template-columns: 1fr;
  }

  .card {
    min-height: 140px;
    border-radius: 24px 24px 0 0;
  }
}
</style>
