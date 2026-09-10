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
        <img :src="baseUrl + card.img" :alt="card.titulo" />
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

const datos = ref({});
const generales = ref([])
onMounted(async () => {
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
  color: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.3;
  font-family: 'Noto Sans', sans-serif;
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */

/* ═══════════════════════════════════════
   TABLET <= 1024px
   Cards horizontales compactas
═══════════════════════════════════════ */

@media (max-width: 1024px) {

  .grid-cards {
    position: static;
    left: auto;
    transform: none;

    width: min(100%, 850px);
    margin: 0 auto;

    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 1rem;
  }

  .card {
    width: 100%;
    height: 120px;
    min-height: 0;

    padding: 1rem 1.2rem;

    border-radius: 24px;

    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: space-between;

    gap: 1rem;

    text-align: left;
  }

  .card h3 {
    flex: 1;

    margin: 0;

    font-size: 1.05rem;
    line-height: 1.25;

    text-align: left;
  }

  .card img {
    flex-shrink: 0;

    width: 85px;
    height: 85px;

    object-fit: contain;
  }
}

/* ═══════════════════════════════════════
   TABLET PEQUEÑA <= 768px
═══════════════════════════════════════ */

@media (max-width: 768px) {

  .textos {
    margin-bottom: 2.5rem;
  }

  .textos p {
    text-align: left;
    font-size: 1rem;
  }

  .grid-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 0.8rem;
  }

  .card {
    height: 105px;

    padding: 0.9rem 1rem;

    border-radius: 20px;

    gap: 0.75rem;
  }

  .card h3 {
    font-size: 0.95rem;
    line-height: 1.2;
  }

  .card img {
    width: 70px;
    height: 70px;
  }
}

/* ═══════════════════════════════════════
   CELULAR <= 560px
═══════════════════════════════════════ */

@media (max-width: 560px) {

  .grid-cards {
    width: 100%;

    grid-template-columns: 1fr;

    gap: 0.75rem;
  }

  .card {
    height: 92px;

    padding: 0.75rem 1rem;

    border-radius: 18px;

    gap: 1rem;
  }

  .card h3 {
    font-size: 1rem;
    line-height: 1.2;

    text-align: left;
  }

  .card img {
    width: 65px;
    height: 65px;
  }

}
</style>
