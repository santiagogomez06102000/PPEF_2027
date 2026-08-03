<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TypeFilaFinanzas, TypeTablaFinanzas } from './TypesFinanzas'
import IconoExpandir from '../Desempenio/IconoExpandir.vue'

const datos = ref<TypeTablaFinanzas | null>(null)
const leerDatos = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}secciones/finanzas/resumen_estimaciones.json`,
    )
    const data = await response.json()
    datos.value = data
  } catch (error) {
    console.error('Error cargando tipos de contrato:', error)
    datos.value = null
  }
}
const expandido = ref<TypeFilaFinanzas | null>(null)
const handleExpandir = (fila: TypeFilaFinanzas) => {
  if (fila.subfilas.length < 1) {
    return
  }
  if (expandido.value?.id === fila.id) {
    expandido.value = null
  } else {
    expandido.value = fila
  }
}
const formatear=(numero:number):string=>{
  return numero.toLocaleString('es-MX');
}
onMounted(() => {
  leerDatos()
})
</script>
<template>
  <section
    class="flex flex-col w-full"
    :style="{
      '--color-card-fondo': datos?.fondoCard,
      '--color-card-texto': datos?.textoCard,
      '--color-card-borde': datos?.bordeCard,
    }"
  >
    <div class="tabla-macro shadow-lg">
      <div class="grid grid-cols-6 gap-x-1 gap-y-2">
        <span
          class="col-start-3 col-span-3 text-center encabezado-year border-b border-b-[var(--color-card-borde)]"
        >
          2026
        </span>
        <span class="col-start-6 col-span-1 text-center encabezado-year">2027</span>
        <div class="col-start-3 col-span-3 grid grid-cols-4 gap-x-1 gap-y-2">
          <span class="col-start-1 col-span-2 text-center">Aprobado */</span>
          <span class="col-start-3 col-span-2 text-center">Estimado</span>
        </div>

        <div
          v-if="datos"
          v-for="fila in datos.filas"
          :key="fila.id"
          class="col-start-1 col-span-6 border-0 border-b border-b-[#d8d8d8] border grid grid-cols-6 gap-x-1 gap-y-2"
        >
          <!-- FILA PADRE -->
          <div
            class="concepto col-start-1 col-span-2"
            :class="`titulo-${fila.titulo ? fila.titulo : '0'} ${fila.subfilas.length > 0 ? 'cursor-pointer' : ''}`"
            @click="handleExpandir(fila)"
          >
            <span class="flex gap-1 items-center icono-expandir hyphens-auto" :class="fila.id===expandido?.id ? 'extendido':''"
              ><IconoExpandir v-if="fila.subfilas.length > 0" /> {{ fila.concepto }}</span
            >
          </div>

          <div class="col-start-3 col-span-3 grid grid-cols-4 gap-x-1 gap-y-2">
            <div class="year col-start-1 col-span-2 text-center truncate">
              {{ formatear(fila.a2026Aprobado) }}
            </div>
            <div class="year col-start-3 col-span-2 text-center truncate">
              {{ formatear(fila.a2026Estimado) }}
            </div>
          </div>

          <div class="year col-start-6 col-span-1 text-center truncate">
            {{ formatear(fila.a2027) }}
          </div>

          <!-- Subfilas -->
          <template v-if="expandido?.id === fila.id">
            <div
              v-for="sub in fila.subfilas"
              :key="sub.id"
              class="col-start-1 col-span-6 border-0 border-b border-b-[#d8d8d8] border grid grid-cols-6 gap-x-1 gap-y-2"
            >
              <div class="concepto col-start-1 col-span-2 hyphens-auto" style="padding-left: 1.5rem;">
                {{ sub.concepto }}
              </div>

              <div class="col-start-3 col-span-3 grid grid-cols-4 gap-x-1 gap-y-2">
                <div class="year col-start-1 col-span-2 text-center truncate">
                  {{ formatear(sub.a2026Aprobado) }}
                </div>
                <div class="year col-start-3 col-span-2 text-center truncate">
                  {{ formatear(sub.a2026Estimado) }}
                </div>
              </div>

              <div class="year col-start-6 col-span-1 text-center truncate">
                {{ formatear(sub.a2027) }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
<style >
.titulo-seccion {
  color: var(--color-encabezado);
}
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
  font-size: large;
  font-weight: bold;
}
.titulo-2 {
  font-size:medium;
}
.titulo-0 {
  font-size: small;
}
.encabezado-year {
  color: var(--color-card-borde);
  font-weight: bold;
}
.icono-expandir{
  position: relative;
}
.icono-expandir svg{
  position: absolute;
  left: -1.5rem;
  transition: transform 0.3s ease;
  transform: rotate(-90deg);
}
.icono-expandir.extendido svg{
  transform: rotate(0deg);
}
</style>
