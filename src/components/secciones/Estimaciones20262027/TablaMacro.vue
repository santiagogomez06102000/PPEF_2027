<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TypeVariablesApoyo } from './typesEstimaciones'
import IconoTriangulo from './IconoTriangulo.vue'

const datos = ref<TypeVariablesApoyo[] | null>(null)
const leerDatos = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}secciones/estimaciones20262027/variables_de_apoyo.json`,
    )
    const data = await response.json()
    datos.value = data
  } catch (error) {
    console.error('Error cargando tipos de contrato:', error)
    datos.value = null
  }
}
onMounted(() => {
  leerDatos()
})
</script>
<template>
  <section class="flex flex-col w-full">
    <!-- <h3 class="titulo-seccion">Variables de apoyo: </h3> -->
    <div class="tabla-macro shadow-lg">
      <div class="grid grid-cols-4 gap-x-1 gap-y-2">
        <div class="col-start-1 col-span-4 grid grid-cols-24 gap-x-1 gap-y-2">
          <span class="col-start-13 col-span-5 text-center encabezado-year">2026</span>
          <span class="col-start-18 col-span-5 text-center encabezado-year">2027</span>
        </div>
        <div
          v-if="datos"
          v-for="fila in datos"
          :key="fila.id"
          class="col-start-1 col-span-4 border-0 border-b border-b-[#d8d8d8] border grid grid-cols-24 gap-x-1 gap-y-2"
        >
          <div
            class="concepto col-start-1 col-span-12 titulo-seccion"
            :class="`titulo-${fila.titulo ? fila.titulo : '0'}`"
          >
            {{ fila.concepto }}
          </div>
          <div class="year col-start-13 col-span-5 text-center truncate">{{ fila.a2026 }}</div>
          <div class="year col-start-18 col-span-5 text-center truncate">{{ fila.a2027 }}</div>
          <div class="year col-start-23 col-span-2 text-center flex items-start justify-center ">
            <IconoTriangulo
              v-if="fila.sube !== null"
              class="flecha-indicador"
              :class="fila.sube ? 'arriba' : 'abajo'"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style >

.tabla-macro {
  border-radius: 1rem;
  border-top: 0.5rem solid var(--color-card-borde);
  background-color: var(--color-card-fondo);
  color: var(--color-texto);
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  width: 100%;
}

.concepto {
  flex: 1 1 50%;
}
.year {
  flex: 1 1 25%;
  font-size: 0.9rem;
}
.titulo-1 {
  font-size: x-large;
}
.titulo-2 {
  font-size: large;
}
.titulo-0 {
  font-size: small;
  padding-left: 1.5rem;
}
.encabezado-year {
  color: var(--color-card-borde);
  font-weight: bold;
}
.flecha-indicador.arriba {
  color: green;
}
.flecha-indicador.abajo {
  color: crimson;
  transform: rotate(180deg);
}
</style>
