<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const track = ref(null)
const position = ref(0)
const direction = ref(-1) // -1: mover a la izquierda, 1: mover a la derecha
const isPaused = ref(false)

const speed = 1
let animationId = null

const items = ref([])
const getItems = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}secciones/sustentoNormativo/sustentoNormativo.json`,
    )
    const data = await response.json()
    items.value = data
  } catch (error) {
    console.error('Error cargando Sustento normativo:', error)
    items.value = []
  }
}

// Función optimizada para obtener URLs de imágenes
const getImageUrl = (imageName) => {
  return `${import.meta.env.BASE_URL}secciones/sustentoNormativo/${imageName}`
}

// Animación del carrusel
const animate = () => {
  if (!track.value) {
    animationId = requestAnimationFrame(animate)
    return
  }

  if (!isPaused.value) {
    const containerWidth = track.value.parentElement.offsetWidth
    const contentWidth = track.value.scrollWidth
    const maxScroll = Math.max(0, contentWidth - containerWidth)

    if (maxScroll > 0) {
      position.value += speed * direction.value

      // Rebote al llegar a los extremos
      if (position.value <= -maxScroll) {
        direction.value = 1 // Cambia a moverse hacia la derecha
      } else if (position.value >= 0) {
        direction.value = -1 // Cambia a moverse hacia la izquierda
      }
    }
  }

  animationId = requestAnimationFrame(animate)
}

const pauseCarrusel = () => {
  isPaused.value = true
}

const resumeCarrusel = () => {
  isPaused.value = false
}

// Recalcula la posición cuando cambia el tamaño del contenedor
const recalculatePosition = () => {
  if (!track.value) return
  const containerWidth = track.value.parentElement.offsetWidth
  const contentWidth = track.value.scrollWidth
  const maxScroll = Math.max(0, contentWidth - containerWidth)
  // Ajusta la posición actual para que no se salga de los límites
  position.value = Math.max(-maxScroll, Math.min(0, position.value))
}

onMounted(() => {
  getItems()
  // Inicializar posición en el punto medio
  if (track.value) {
    const containerWidth = track.value.parentElement.offsetWidth
    const contentWidth = track.value.scrollWidth
    const maxScroll = Math.max(0, contentWidth - containerWidth)
    position.value = -maxScroll / 2
  }

  // Observer para cambios de tamaño del contenedor
  const resizeObserver = new ResizeObserver(recalculatePosition)
  if (track.value?.parentElement) {
    resizeObserver.observe(track.value.parentElement)
  }

  animationId = requestAnimationFrame(animate)

  // Limpiar observer al desmontar
  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
})
</script>
<template>
  <div
    id="sustento_normativo"
    class="bg-[rgb(237, 242, 252)]"
    :style="{
      '--color-texto': items.color,
    }"
  >
    <div class="flex flex-col items-center mx-auto w-full bg-transparent">
      <hr class="self-center mb-2.5 w-full pt-4 border-none" />
      <div class="subtitulo">Sustento Normativo</div>
    </div>

    <!-- Carrusel único (se mueve de derecha a izquierda) -->
    <div
      class="w-full pt-2 pb-7 bg-transparent"
      @mouseenter="pauseCarrusel"
      @mouseleave="resumeCarrusel"
    >
      <div
        ref="track"
        class="flex gap-6 transition-transform duration-75 ease-linear"
        :style="{ transform: `translateX(${position}px)` }"
      >
        <div
          v-for="(item, index) in items.tarjetas"
          :key="index"
          class="flex items-center shrink-0"
        >
          <img
            :src="getImageUrl(item.img)"
            class="w-12 md:w-20 imagen-sustento"
            alt="icon"
            loading="lazy"
          />
          <a
            :href="item.link"
            target="_blank"
            class="px-[22px] py-[10px] bg-white rounded-full text-[16px] Noto-Sans font-medium text-black border-none whitespace-normal text-center leading-tight transition-all duration-200 hover:shadow-[3px_3px_0px_0px_var(--color-texto)] hover:-translate-y-1 active:translate-x-0 active:translate-y-0"
            style="
              border: 3px solid var(--color-texto);
              border-radius: 15px;
              width: 26rem;
              height: auto; /* font-family: 'NotoSans'; */
              padding: 1rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              justify-content: center;
            "
          >
            <p class="font-bold">
              {{ item.text }}
            </p>
            <p v-if="item.desc" class="text-xs text-justify font-light flex-1 mt-4">
              {{ item.desc }}
            </p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.subtitulo {
  color: var(--color-texto);
  font-family: 'Patria Bold';
  font-size: 29px;
  margin: 1rem 0;
}

.imagen-sustento {
  filter: hue-rotate(170deg);
}

p {
  font-size: 0.9rem;
  margin: 0;
  padding: 0;
}

#sustento_normativo {
  background-color: #e4fafb;
  padding: 1rem 0 2.5rem 0;
}
</style>
