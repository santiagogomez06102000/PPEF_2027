<script setup lang="ts">
import { ref } from 'vue'
import { TypeDatos } from './TypesDesmp'
import Tab from './Tab.vue'
import FlechaArribaTrend from './FlechaTrendArriba.vue'

const props = defineProps<{
  datos: TypeDatos
}>()
const activo = ref<number>(0)
const handleActivo = (tab: number): void => {
  activo.value = tab
}
</script>
<template>
  <section
    class="seccion-tabs"
  >
    <ul class="tabs-desemp">
      <li
        v-for="tab in props.datos.tabs"
        :key="tab.id"
        class="tab-desemp-item"
        :class="activo === tab.id ? 'activo' : ''"
        @click="handleActivo(tab.id)"
      >
        <FlechaArribaTrend /> {{ tab.titulo }}
      </li>
    </ul>
    <div v-for="tab in props.datos.tabs" :key="tab.id">
      <Tab v-if="activo === tab.id" :tab="tab" />
    </div>
  </section>
</template>
<style>
@import './Tabs.css';


</style>
