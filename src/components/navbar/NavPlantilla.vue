<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import NavPlantillaItem from './NavPlantillaItem.vue'
import GobMxAccesibilidad_2 from './GobMxAccesibilidad_2.vue'
const props = defineProps<{
  active: string
}>()

const menu = ref([])
const urlBase= '/work/models/PTP/NPTP/PTP_Layout/navbar/';

const getMenu = async () => {
  try {
    //@ts-ignore
    const response = await fetch(`${urlBase}navbar.json`)
    const data = await response.json()
    menu.value = data
  } catch (error) {
    console.error('Error cargando menú:', error)
    menu.value = []
  }
}

const isOpen = ref(false)
const openDropdown = ref<number>(0)
const toggleDropdown = (id: number) => {
  openDropdown.value = openDropdown.value === id ? 0 : id
}
const clickNavbar = () => {
  isOpen.value = !isOpen.value
}
const width = ref(window.innerWidth)

const handleResize = () => {
  width.value = window.innerWidth
  if (window.innerWidth > 1024 && isOpen.value) {
    isOpen.value = false
    toggleDropdown(0)
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  getMenu()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
<template>
  <header class="header sticky top-0 z-2000 bg-[#142e3f] shadow-sm">
    <div class="header-container">
      <div class="logo">
        <a href="http://172.28.105.12/es/PTP/prueba_home">
          <img
            :src="urlBase + 'logo.png'"
            alt="Transparencia Presupuestaria"
            class="block h-[42px] w-[37px]"
          />
        </a>
      </div>
      <div class="lg:hidden">
        <button
          @click="clickNavbar"
          type="button"
          class="boton-hamburguesa inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-200 hover:text-[#1e69cb] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          :aria-expanded="isOpen"
        >
          <span class="sr-only">Abrir menú</span>

          <transition name="icon" mode="out-in">
            <!-- ICONO CERRAR -->
            <svg
              v-if="isOpen"
              key="close"
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 384 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s-12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
              />
            </svg>

            <!-- ICONO HAMBURGUESA -->
            <svg
              v-else
              key="menu"
              class="block"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              height="1em"
              width="1em"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </transition>
        </button>
      </div>
      <nav class="navbar" :class="isOpen ? 'mostrar' : ''">
        <ul v-for="item in menu" class="menu">
          <NavPlantillaItem
            :item="item"
            :width="width"
            :toggleDropdown="toggleDropdown"
            :openDropdown="openDropdown"
            :active="active"
          />
        </ul>
      </nav>
    </div>
  </header>
  <GobMxAccesibilidad_2 />
</template>
<style>
.logo {
  flex-shrink: 0;
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.logo a {
  margin-left: 2.5rem;
}

.header {
  width: 100%;
  max-width: 100dvw;
}

.header-container {
  max-width: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0.5rem 1rem;
  flex-wrap: wrap;
}

.navbar {
  flex-direction: column;
  opacity: 0;
  height: 100%;
  max-height: 0px;
  transition:
    max-height ease 0.3s,
    opacity ease 0.3s,
    margin-top ease 0.3s;
  width: 100%;
  margin-top: 0rem;
  gap: 1rem;
  pointer-events: none;
}

.navbar.mostrar {
  opacity: 1;
  max-height: 30rem;
  margin-top: 1rem;
  pointer-events: all;
}

.boton-hamburguesa svg {
  font-size: 1.5rem;
}

@media (min-width: 1024px) {
  .logo {
    flex-shrink: 0;
    flex-grow: 0;
    margin: 0.7rem 0;
  }

  .header-container {
    max-width: 80rem;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    padding: 0;
    padding-left: 4rem;
    padding-right: 0rem;

    overflow: visible;
    flex-wrap: nowrap;
    margin: auto;
  }

  .navbar {
    display: flex;
    flex-direction: row;
    opacity: 1;
    height: auto;
    max-height: none !important;
    transition:
      max-height ease 0.3s,
      opacity ease 0.3s;
    width: auto;
    align-items: stretch;
    justify-content: end;
    pointer-events: all;
    gap: 0;
  }
  .logo a {
    margin: 0;
  }
}

.icon-enter-active,
.icon-leave-active {
  transition: all 0.3s ease;
}

.icon-enter-from,
.icon-leave-to {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.icon-enter-to,
.icon-leave-from {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}
</style>
