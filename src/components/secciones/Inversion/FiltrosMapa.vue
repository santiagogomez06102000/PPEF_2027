<script setup lang="ts">
import SelectInputBusqueda, { SelectOption } from '@/components/Forms/SelectInputBusqueda.vue'
import { fetchPublicJson } from '@/components/utils/utils'
import { nextTick, onMounted, ref, watch } from 'vue'
import { Filtros } from './ViewMapa.vue'

/**Opciones de los select */
const EstadosSelect = ref<SelectOption[] | null>(null)
const ramosSelect = ref<SelectOption[] | null>(null)
const ejecutorSelect = ref<SelectOption[] | null>(null)

/**Lo que se seleccionó */
const estado = ref<number | null>(null)
const ramo = ref<number | null>(null)
const ejecutor = ref<string | null>(null)
/**Función para traer los estados de la db */
async function consultarEntidadesFed() {
  const respuesta = await fetchPublicJson<Entidad_federativaInterface[]>(
    '/filtros/entidades_federativas.json',
  )
  if (respuesta) {
    EstadosSelect.value = respuesta.map((i) => ({
      value: Number(i.id_entidad_federativa),
      label: i.entidad_federativa,
    }))
  }
}

/**Función para traer los ramos de la db */
async function consultarRamos() {
  const respuesta = await fetchPublicJson<RamoInterface[]>('/filtros/ramos.json')
  if (respuesta) {
    ramosSelect.value = respuesta.map((i) => ({
      value: Number(i.id_ramo),
      label: i.ramo,
    }))
  }
}
/**Función para traer los ejecutores de la db */
async function consultarEjecutores() {
  const respuesta = await fetchPublicJson<EjecutorInterface[]>('/filtros/ejecutores.json')
  if (respuesta) {
    ejecutorSelect.value = respuesta.map((i) => ({
      value: i.id_ur,
      label: i.descripcion_ur,
    }))
  }
}

const props = defineProps<Props>()

onMounted(async () => {
  await consultarEntidadesFed()
  await consultarRamos()
  await consultarEjecutores()
})

watch([estado, ramo, ejecutor], () => {
  props.filtrar({ estado: estado.value, ramo: ramo.value, ejecutor: ejecutor.value })
})
function limpiarFiltros(){
    estado.value=null;
    ramo.value=null;
    ejecutor.value=null;
}

interface Entidad_federativaInterface {
  id_entidad_federativa: number
  entidad_federativa: string
}

interface RamoInterface {
  id_ramo: number
  ramo: string
}
interface EjecutorInterface {
  id_ur: string
  descripcion_ur: string
}
interface Props {
  filtrar: (filtros: Filtros) => void
}
</script>
<template>
  <section
    class="shadow-xl bg-white rounded-xl w-full lg:w-[30%] max-w-full lg:max-w-[30%] min-w-full lg:min-w-[30%] p-4"
  >
    <div class="flex flex-col gap-4" v-if="EstadosSelect">
      <SelectInputBusqueda
        id="ef"
        label="Entidad federativa"
        placeholder="Todas las entidades federativas"
        :options="EstadosSelect"
        :bloquear-deseleccionar="false"
        v-model="estado"
      />

      <SelectInputBusqueda
        id="ramo"
        label="Ramo"
        placeholder="Todos los ramos"
        :options="ramosSelect ?? []"
        :bloquear-deseleccionar="false"
        v-model="ramo"
      />
      <SelectInputBusqueda
        id="ejecutor"
        label="Ejecutor"
        placeholder="Todos los ejecutores"
        :options="ejecutorSelect ?? []"
        :bloquear-deseleccionar="false"
        v-model="ejecutor"
      />
      <div class="text-end">
        <button type="button" class="boton-limpiar rounded-full shadow-xl" @click="limpiarFiltros">Limpiar filtros</button>
      </div>
    </div>
  </section>
</template>
<style lang="css" scoped>
.boton-limpiar{
    background-color: var(--color-terciario);
    padding: 0.125rem 1rem;
    color: var(--color-blanco);
    transition: all 0.3s ease;
    cursor: pointer;
}
.boton-limpiar:hover{
    background-color: var(--color-gris);
}
</style>
