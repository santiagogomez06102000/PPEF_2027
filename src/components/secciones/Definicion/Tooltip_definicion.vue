<!-- Definicion.vue -->
<template>
  <span class="definicion-wrapper" @mouseenter="visible = true" @mouseleave="visible = false">
    <span class="palabra">
      <slot />
    </span>

    <transition name="fade">
      <div v-if="visible" class="tooltip">
        {{ prop }}
      </div>
    </transition>
  </span>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  prop: {
    type: String,
    required: true,
  },
})

const visible = ref(false)
</script>

<style scoped>
.definicion-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.palabra {
  border-bottom: 1px dashed rgb(81, 143, 245);
}

.tooltip {
  position: fixed;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);

  max-width: calc((100dvw / 6) - 2rem - calc(var(--spacing) * 4));
  min-width: 220px;
  padding: 1rem 0.75rem;

  border-radius: 20px;
  color: black;
  background: rgba(255, 255, 255, 0.3);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.15),
    inset 0 4px 30px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);

  font-size: 0.9rem;
  line-height: 1.4;
  z-index: 1000;
  pointer-events: none;
}

/* Animación */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .tooltip {
    max-width: 20rem !important;
  }
}

</style>
