<script setup lang="ts">
import Tooltip from '../Desempenio/Tooltip.vue';
import { TypeTabFinanzas } from './TypesFinanzas'

const props = defineProps<{
  tab: TypeTabFinanzas
}>()
</script>
<template>
  <section class="tabs-contenedor">
    <div v-for="seccion in props.tab.lista" :key="seccion.id" class="seccion">
      <h3 class="seccion-titulo">{{ seccion.titulo }}</h3>
      <div v-for="parrafo in seccion.parrafos" :key="parrafo.id" class="parrafo">
        <div class="parrafo-titulo">
        <h5 >{{ parrafo.titulo }}</h5>
        <img v-if="parrafo.img" :src="parrafo.img" class="imagen" />
        </div>
        <div>
          {{ parrafo.texto }}
          <Tooltip v-show="parrafo.fuente" :text=" parrafo.fuente" fuente>
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
  </section>
</template>
<style scoped>
@import './TabsFinanzas.css';
.seccion {
  color: var(--color-texto);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: justify;
}
.seccion .seccion-titulo {
  font-size: 1.2rem;
  margin-bottom: 0;
}
.parrafo {
  background-color: whitesmoke;
  padding: 1rem 2rem;
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}
.parrafo .parrafo-titulo {
  font-weight: bold;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;

}
.parrafo-titulo h5{
  width: 100%;
}
.imagen {
  margin-top: 1rem;
  width: 5rem !important;
  min-width: 5rem !important;
}
@media (max-width: 1024px) {
  .parrafo {
    flex-direction: column;
  }
  .parrafo .parrafo-titulo {
    width: 100%;
    min-width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .imagen {
    margin-top: 0 !important;
  }
}
</style>
