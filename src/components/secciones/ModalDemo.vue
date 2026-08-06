<script setup>
import { ref } from 'vue'
import Modal from '@/components/utils/Modal.vue'
import { useModal } from '@/components/composables/useModal.js'

// Importar JSONs de ejemplo
import caso1Data from '@/data/Demo/modal-caso1.json'
import caso2Data from '@/data/Demo/modal-caso2.json'
import caso3Data from '@/data/Demo/modal-caso3.json'
import caso4Data from '@/data/Demo/modal-caso4.json'

// Instancia del composable para el modal
const modal = useModal()

// Alternativa: usar v-model directo sin composable
const mostrarModalDirecto = ref(false)
const contenidoDirecto = ref({})

function abrirModal(data) {
  modal.open(data)
}

function abrirModalDirecto(data) {
  contenidoDirecto.value = data
  mostrarModalDirecto.value = true
}
</script>

<template>
  <div class="demo-container">
    <h1 class="demo-title">Demostración del Componente Modal</h1>
    <p class="demo-description">
      Cada botón abre el mismo componente Modal con contenido diferente proveniente de archivos JSON
      independientes.
    </p>

    <div class="demo-buttons">
      <!-- Caso 1: Párrafos con formato -->
      <button class="demo-btn" @click="abrirModal(caso1Data)">
        <span class="demo-btn__label">Caso 1</span>
        <span class="demo-btn__desc">Párrafos con negritas y cursivas</span>
      </button>

      <!-- Caso 2: ODS con lista -->
      <button class="demo-btn" @click="abrirModal(caso2Data)">
        <span class="demo-btn__label">Caso 2</span>
        <span class="demo-btn__desc">ODS 1 — Fin de la pobreza</span>
      </button>

      <!-- Caso 3: Contenido extenso -->
      <button class="demo-btn" @click="abrirModal(caso3Data)">
        <span class="demo-btn__label">Caso 3</span>
        <span class="demo-btn__desc">Documentación técnica extensa</span>
      </button>

      <!-- Caso 4: Simple -->
      <button class="demo-btn" @click="abrirModal(caso4Data)">
        <span class="demo-btn__label">Caso 4</span>
        <span class="demo-btn__desc">Aviso simple sin subtítulo</span>
      </button>

      <!-- Ejemplo con v-model directo -->
      <button class="demo-btn demo-btn--alt" @click="abrirModalDirecto(caso2Data)">
        <span class="demo-btn__label">Ejemplo con v-model</span>
        <span class="demo-btn__desc">Sin usar el composable useModal</span>
      </button>
    </div>

    <!-- Modal usando el composable -->
    <Modal v-model="modal.isOpen.value" :content="modal.content.value" />

    <!-- Modal usando v-model directo (alternativa) -->
    <Modal v-model="mostrarModalDirecto" :content="contenidoDirecto" />
  </div>
</template>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.demo-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.demo-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.demo-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.demo-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e5ea;
  border-radius: 10px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.demo-btn:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
  transform: translateY(-2px);
}

.demo-btn__label {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
}

.demo-btn__desc {
  font-size: 0.875rem;
  color: #777;
}

.demo-btn--alt {
  border-color: #10b981;
  background: #ecfdf5;
}

.demo-btn--alt:hover {
  border-color: #059669;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.12);
}
</style>
