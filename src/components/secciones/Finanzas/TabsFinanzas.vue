<script setup lang="ts">
import { ref } from 'vue'
import TabFinanzas from './TabFinanzas.vue'
import FlechaTrendArriba from '../Desempenio/FlechaTrendArriba.vue';
import { TypeDatosFinanzas } from './TypesFinanzas';

const props = defineProps<{
  datos: TypeDatosFinanzas
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
        <FlechaTrendArriba /> {{ tab.titulo }}
      </li>
    </ul>
    <div v-for="tab in props.datos.tabs" :key="tab.id">
      <TabFinanzas v-if="activo === tab.id" :tab="tab" />
    </div>
  </section>
</template>
<style>
@import './TabsFinanzas.css';


</style>
