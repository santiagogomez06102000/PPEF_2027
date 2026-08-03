<script setup lang="ts">
import FlechaArriba from '../Desempenio/FlechaArriba.vue'
import { TypeEstimaciones, TypeTarjeta } from './typesEstimaciones'

const props = defineProps<{
  datos: TypeTarjeta
}>()
</script>
<template>
  <div class="card-macro shadow-xl grid grid-cols-6 gap-1">
    <div class="col-start-1 col-span-5 self-stretch card-titulo">{{ props.datos.titulo }}</div>
    <div
      class="col-start-6 col-span-1 self-stretch flex align-start justify-end"
      :class="`flecha-${props.datos.sube ? 'arriba' : 'abajo'}`"
    >
      <FlechaArriba />
    </div>
    <div v-if="props.datos.subtitulo" class="col-span-full self-end card-subtitulo">
      {{ props.datos.subtitulo }}
    </div>
    <div
      v-for="dato in props.datos.datos"
      :key="dato.etiqueta"
      class="col-span-2 flex flex-col self-end card-datos"
    >
      <span class="card-etiqueta">{{ dato.etiqueta }}</span>
      <span>{{ dato.valores }}</span>
    </div>
  </div>
</template>
<style scoped>
.card-macro {
  border-radius: 1rem;
  background-color: var(--color-card-fondo);
  color: var(--color-card-texto);
  flex: 0 1 20rem;

  padding: 1rem 0.5rem;
  min-height: 5rem;
}
.card-macro:first-child {
  border-left: 0.5rem solid var(--color-card-borde);
}

.flecha-arriba svg,
.flecha-abajo svg {
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  width: 2rem;
  height: 2rem;
  padding: 0.5rem;
}
.flecha-abajo svg{
  color: crimson;
  transform: rotate(180deg);
}
.flecha-arriba{
    color: #04cc98;

}
.card-titulo{
  color: var(--color-card-borde);
  font-weight: bold;
}
.card-subtitulo{
  opacity: 0.75;
}
.card-datos{
  color: var(--color-card-texto);
}
.card-etiqueta{
  font-weight:600;
}
</style>
