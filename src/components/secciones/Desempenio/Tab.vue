<script setup lang="ts">
import {  onMounted, onUnmounted, ref } from 'vue'
import Acordion from './Acordion.vue'
import { TypeTab } from './TypesDesmp'

const props = defineProps<{
  tab: TypeTab
}>()

const expandido=ref<number | null>(null);
const handleExpandir=(expandir:number):void=>{
    
    if(expandido.value===expandir){
        expandido.value=null;
    }
    else{
        expandido.value=expandir;
    }
    console.log(expandido.value);
    
}
onMounted(()=>{
  expandido.value=null;
})
onUnmounted(()=>{
    expandido.value=null;
})
</script>
<template>
  <section class="tabs-contenedor">
    <Acordion
      v-if="props.tab?.lista?.length"
      v-for="lista in props.tab.lista"
      :lista-item="lista"
      :expandido="expandido===lista.id"
      :handle-expandir="handleExpandir"
      :key="lista.titulo"
    />
  </section>
</template>
<style>
@import './Tabs.css';
</style>
