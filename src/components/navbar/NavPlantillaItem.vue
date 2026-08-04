<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'


type MenuItem = {
  id: number
  descripcion: string
  url: string
  texto: string
  nivel: number
  submenu: MenuItem[]
}

const props = defineProps<{
  item: MenuItem
  width: number
  openDropdown: number
  toggleDropdown: (id: number) => void,
  active:string
}>()
const { item, toggleDropdown } = props
const submenu = ref<Boolean>(false)
const handleMostrarSubmenu = (value: Boolean) => {
  submenu.value = value;
};

</script>

<template>
  <li class="w-full h-full lista-nav">
    <div v-if="item?.submenu?.length > 0" class=" flex h-full w-full items-center">
      <!--Si la pantalla es desktop se renderiza como dropdown-->
      <div v-if="props.width >= 1024" @mouseenter="handleMostrarSubmenu(true)" @mouseleave="handleMostrarSubmenu(false)"
        class="contenedor-menu relative" :class="props.width >= 1024 ? 'sublista-nav' : ''">
        <button @click="handleMostrarSubmenu(!submenu)" type="button"
          class="btn-menu leading-none w-full h-full text-lg font-bold transition-all duration-200 hover:scale-105 hover:px-4 transition-colors"
          :class="item?.nivel === 1
            ? 'hover:text-white text-[var(--bg-nav)] hover:bg-[var(--bg-nav)]'
            : 'text-white bg-[var(--bg-nav)] hover:text-[var(--bg-nav)] hover:bg-white'
            " :style="{ '--bg-nav': item?.texto }">
          {{ item?.descripcion }}
          <div v-show="submenu" class="flex w-auto flex-col opacity-100 transition-all contenedor-submenu">
            <ul v-for="subitem in item?.submenu" class="menu">
              <NavPlantillaItem :active="active" :item="subitem" :width="props.width" :openDropdown="props.openDropdown"
                :toggleDropdown="toggleDropdown" />
            </ul>
          </div>
        </button>
      </div>
      <!--Si la pantalla es de móvil se renderiza como un acordion-->
      <div v-else class="w-full">
        <button @click="toggleDropdown(item.id)"
          class="btn-menu-mobile leading-none flex  py-0 w-full items-center justify-between px-3 text-lg font-bold  transition-colors"
          :class="item?.nivel === 1
            ? 'hover:text-white text-[var(--bg-nav)] hover:bg-[var(--bg-nav)]'
            : 'text-white bg-[var(--bg-nav)] hover:text-[var(--bg-nav)] hover:bg-white'
            " :style="{ '--bg-nav': item?.texto }" style="max-height: 100%">
          {{ item.descripcion }}
          <svg class="h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': openDropdown === item.id }"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <div class="mt-0 space-y-1 pl-4 acordion" :class="props.openDropdown === item.id ? 'mostrar-acordion' : ''">
          <ul v-for="subitem in item.submenu" class="contenedor-submenu">
            <NavPlantillaItem :active="active" :item="subitem" :width="width" :openDropdown="props.openDropdown"
              :toggleDropdown="toggleDropdown" />

          </ul>
        </div>
      </div>
    </div>
    <a v-else :href="item?.url"
      class="contenedor-menu flex leading-none h-full items-center px-3 text-start text-lg font-bold transition-all duration-200 hover:scale-105 hover:px-4 transition-colors"
      :class="item?.nivel === 1
        ? ` ${active === item.url ? 'text-[#66CCCC]' : 'text-[var(--bg-nav)]'}   hover:text-[#66CCCC]`
        : `bg-[var(--bg-nav)] hover:text-[var(--bg-nav)] text-white  hover:bg-white `
        " :style="{
          '--bg-nav': item?.texto,
        }">{{ item?.descripcion }}</a>
  </li>
</template>
<style>
html{
    scroll-behavior: smooth;
}
.menu {
  margin: 0.25rem 0;
  padding: 0;
}

.contenedor-submenu .menu {
  margin: 0;
}

.contenedor-menu .btn-menu {
  display: flex;
  align-items: center;
  justify-content: start;
  height: 100%;
  padding: 0.75rem;
}

.contenedor-menu,
.btn-menu-mobile {
  padding: 0.5rem 0.75rem;

}

.lista-nav {
  font-family: Patria Bold;
}

.acordion {
  max-height: 0px;
  transition: max-height ease 0.2s,
    opacity ease 0.2s;
  overflow: hidden;
  opacity: 0;
}

.acordion.mostrar-acordion {
  max-height: 50rem;
  opacity: 1;
}

@media (min-width: 1024px) {
  .contenedor-submenu {
    padding-top: 4rem;
    top: 0;
    left: 0;
    position: absolute;
    z-index: 1000;
    width: max-content;
    max-width: 10rem;
  }

  .menu {
    margin: 0;
  }

  .contenedor-menu {
    max-width: none;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
    display: flex;
    padding: 0.5rem 0.75rem;
    text-align: center;
  }

  .sublista-nav {
    padding: 0 !important;
  }

  .contenedor-submenu .contenedor-menu {
    margin-bottom: 0.25rem;
    text-align: center;
    justify-content: start;
    padding: 0.5rem 0.75rem;
    text-align: start;
  }
}
</style>
