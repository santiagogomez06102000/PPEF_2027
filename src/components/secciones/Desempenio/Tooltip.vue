<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  text: string
  fuente?: boolean
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 500,
})
const timeout = ref<ReturnType<typeof setTimeout> | null>(null)

const ocultarTooltip = () => {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }

  timeout.value = setTimeout(() => {
    show.value = false
    timeout.value = null
  }, props.delay)
}
const show = ref(false)
const rutas=["mascota/0_cabeza.png"]
const urlBase=import.meta.env.BASE_URL;
</script>

<template>
  <div class="tooltip-container" @mouseenter="show = true" @mouseleave="ocultarTooltip()">
    <div class="tooltip-trigger">
      <slot />
    </div>
    <div v-if="show" class="tooltip  shadow-xl rounded-xl"><strong v-if="fuente">Fuente: </strong>{{ text }}
                    <img :src="urlBase+rutas[0]" class="img-mensaje"/>
</div>
  </div>
</template>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip-trigger {
  display: inline-block;
  transition: transform 0.25s ease;
}

.tooltip-container:hover .tooltip-trigger {
  transform: scale(1.25);
}

.tooltip {
  position: fixed;
  max-width: calc((100dvw / 6) - 2rem - calc(var(--spacing) * 4));
  min-width: calc((100dvw / 6) - 2rem - calc(var(--spacing) * 4));
  padding: 1.5rem 1rem;
  right: 1rem;
  top: 50%;

  z-index: 1000;
  overflow:visible;
  text-overflow: ellipsis;
  font-size: smaller;
  line-height: 1.4;
  color: black;
  background: white;

}
@supports (backdrop-filter: blur(10px)) {
  .header-container {
    backdrop-filter: blur(10px);
  }
}
@media (max-width: 1024px) {
  .tooltip{
      max-width: 20rem !important;

  }
}
 .img-mensaje{
        width: 3rem;
        
        position: absolute;
        top: -1rem;
        left: -1.5rem;
    }
</style>
