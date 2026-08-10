<script setup lang="ts">
import IconoArchivo from '@/components/utils/IconoArchivo.vue';
import { getCardClass } from '@/components/utils/utils';
const props= defineProps<{
    card:Datos,
    idx:number
    items:number
}>();
export interface Datos {
  url: string
  tipo: string
  titulo: string
}
</script>
<template>
     <a
        :class="getCardClass(props.items, idx)"
        class="card-datos-abiertos hover:scale-105 flex items-center justify-start gap-4 rounded-xl shadow-xl overflow-hidden"

        :href="props.card.url"
        target="_blank"
      >
        <IconoArchivo :extension="props.card.tipo" class="icono"/>
        <h5  class="titulo-card">{{ props.card.titulo }}</h5>
      </a>
</template>
<style lang="css" scoped>
.card-datos-abiertos{
    transition: all 0.3s ease;
}
.icono  {
    font-size: 5rem;
    padding: 1rem;
}
.titulo-card{
    font-size: 2rem;
}
</style>