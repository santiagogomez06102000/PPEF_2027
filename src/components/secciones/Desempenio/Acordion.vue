<script setup lang="ts">
import Tooltip from './Tooltip.vue'
import { TypeListaItem } from './TypesDesmp'

const props = defineProps<{
  listaItem: TypeListaItem
  expandido: boolean
  handleExpandir: (expandir: number) => void
}>()
const manejarExpandir = (expandir: number) => {
  if (props.listaItem.detalle) {
    props.handleExpandir(expandir)
  }
}
const imagen = props.listaItem.img ? `${import.meta.env.BASE_URL}${props.listaItem.img}` : false
</script>
<template>
  <section class="acordion-contenedor">
    <div
      class="acordion-encabezado"
      :class="listaItem.detalle ? 'mostrar-expandir' : ''"
      @click="manejarExpandir(props.listaItem.id)"
    >
      <div v-if="props.listaItem.titulo" class="titulo  hyphens-auto">
        <h5>
          <strong>{{ props.listaItem.titulo }}</strong>
        </h5>
        <img v-if="imagen" :src="imagen" class="imagen-acordion" />
      </div>
      <div class="flex flex-col relative">
        <div class="acordion-detalle">
          {{ props.listaItem.descripcion }}
          <Tooltip v-show="props.listaItem.fuente" :text="props.listaItem.fuente" fuente>
            <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="rgb(78, 191, 86)"
                  class="bi bi-leaf-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M1.4 1.7c.217.289.65.84 1.725 1.274 1.093.44 2.885.774 5.834.528 2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045-.142-.162-.402-.102-.379.112.108.985 1.104 1.82 1.844 2.308 2.37 1.566 5.772-.118 7.6 3.071.505.8 1.374 2.7 1.75 4.292.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042 1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.124-.887-1.889-2.095-2.39-3.383-1-2.562-1-5.536-.65-7.28L.73.806z"
                  ></path>
                </svg>
          </Tooltip>
        </div>
        <div v-if="props.listaItem.nacional" class="acordion-detalle">
          <div style="padding-top: 1rem" />
          {{ props.listaItem.nacional }}
          <Tooltip v-show="props.listaItem.fuente" :text="props.listaItem.fuenteNacional" fuente>
            <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="rgb(78, 191, 86)"
                  class="bi bi-leaf-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M1.4 1.7c.217.289.65.84 1.725 1.274 1.093.44 2.885.774 5.834.528 2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045-.142-.162-.402-.102-.379.112.108.985 1.104 1.82 1.844 2.308 2.37 1.566 5.772-.118 7.6 3.071.505.8 1.374 2.7 1.75 4.292.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042 1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.124-.887-1.889-2.095-2.39-3.383-1-2.562-1-5.536-.65-7.28L.73.806z"
                  ></path>
                </svg>
          </Tooltip>
        </div>
      </div>
    </div>
    <div class="detalle-expansion" :class="props.expandido ? 'mostrar-detalle' : ''">
      <ul>
        <li v-for="detalle in props.listaItem.detalle" :key="detalle.descripcion">
          {{ detalle.descripcion }}
        </li>
      </ul>
    </div>
  </section>
</template>
<style scoped>
.acordion-encabezado {
  display: flex;
  gap: 1rem;
  background-color: var(--color-acordion);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  align-items: center;
}

.acordion-encabezado .acordion-detalle {
  color: var(--color-texto);
  font-size: 1rem;
  flex: 1;
}
.acordion-encabezado.mostrar-expandir {
  cursor: pointer;
}
.acordion-encabezado.mostrar-expandir .acordion-detalle::after {
  content: '+';
  position: absolute;
  top: calc(50% - 1rem);
  right: -3rem;
  font-size: 2rem;
  background-color: var(--color-activo);
  width: 2rem;
  height: 2rem;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 0.25rem;
}
.acordion-detalle {
  position: relative;
  margin: 0;
}
.detalle-expansion {
  padding: 0 2rem;
  transition:
    opacity 0.1s ease,
    max-height 0.4s ease;
  opacity: 0;
  max-height: 0;
}
.detalle-expansion.mostrar-detalle {
  opacity: 1;
  max-height: 10rem;
  padding: 1rem 2rem;
}
.acordion-encabezado .titulo{
  min-width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;

}
.titulo h5{
  width: 100%;
}
@media (max-width: 1024px) {
  .acordion-encabezado {
    flex-direction: column;
  }
  .acordion-encabezado .titulo {
    width: 100%;
    min-width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .imagen-acordion {
    margin-top: 0 !important;
  }
}
.acordion-contenedor {
  color: var(--color-texto);
}
.imagen-acordion {
  margin-top: 1rem;
  width: 5rem !important;
  min-width: 5rem !important;
}
</style>
