<template>
  <div class="botones-wrapper">
    <div v-for="(btn, idx) in botones" :key="btn.id" class="boton-card" :class="{ active: modelValue === idx }"
      @click="toggle(idx)">
      <!-- Círculo con imagen -->
      <div class="circulo">
        <img :src="`${baseUrl}${btn.imagenCirculo}`" :alt="btn.abreviatura" />
      </div>

      <!-- Texto del botón -->
      <div class="boton-texto">
        <span class="titulo">{{ btn.titulo }}</span>
        <span class="abreviatura">({{ btn.abreviatura }})</span>
      </div>

      <!-- Contenido desplegable: SOLO visible en móvil -->
      <div v-if="esMovil && modelValue === idx" class="panel-movil">
        <h3>{{ btn.tituloSeccion }}</h3>
        <p v-for="(parrafo, i) in btn.descripcion" :key="i">
          {{ parrafo }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const baseUrl = import.meta.env.BASE_URL;

const props = defineProps({
  botones: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue'])

const esMovil = ref(false)

const verificarMovil = () => {
  esMovil.value = window.innerWidth <= 768
}

const toggle = (idx) => {
  // Si ya está activo, se cierra (-1); si no, se abre el nuevo
  emit('update:modelValue', props.modelValue === idx ? -1 : idx)
}

onMounted(() => {
  verificarMovil()
  window.addEventListener('resize', verificarMovil)
})

onUnmounted(() => {
  window.removeEventListener('resize', verificarMovil)
})
</script>

<style scoped>
.botones-wrapper {
  display: flex;
  gap: 1rem;
  flex: 1.5;
}

/* ── Tarjeta de cada botón ── */
.boton-card {
  flex: 1;
  background-color: #f5f5f0;
  border-radius: 24px;
  padding: 1.8rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: start;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid transparent;
  min-height: 200px;
}

.boton-card:hover {
  background-color: #e0f2f1;
  border-color: #5bc4bf;
  transform: translateY(-2px);
}

.boton-card.active {
  background-color: #5bc4bf;
  color: #fff;
}

/* ── Círculo ── */
.circulo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #5bc4bf;
  overflow: hidden;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.25s ease;
}

.circulo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.boton-card.active .circulo {
  background-color: #1a8a9e;
}

/* ── Texto ── */
.boton-texto {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.titulo {
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.25;
  color: #0b6e7a;
}

.abreviatura {
  font-weight: 600;
  font-size: 0.9rem;
  color: #0b6e7a;
}

.boton-card.active .titulo,
.boton-card.active .abreviatura {
  color: #fff;
}

/* ── Panel desplegable (solo móvil) ── */
.panel-movil {
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  text-align: left;
  width: 100%;
  animation: fadeIn 0.2s ease;
}

.panel-movil h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0b6e7a;
  margin-bottom: 0.6rem;
}

.panel-movil p {
  font-size: 0.92rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 0.6rem;
}

.panel-movil p:last-child {
  margin-bottom: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════════
   RESPONSIVE: Móvil (≤768px)
   ═══════════════════════════════════════ */
@media (max-width: 768px) {
  .botones-wrapper {
    flex-direction: column;
    width: 100%;
  }

  .boton-card {
    min-height: auto;
    padding: 1.2rem 1rem;
  }
}
</style>
