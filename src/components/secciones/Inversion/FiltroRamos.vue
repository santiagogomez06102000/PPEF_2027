<script setup lang="ts">
import { fetchPublicJson } from '@/components/utils/utils';
import { ramoColores } from './mapController';
import { RamoInterface } from './FiltrosMapa.vue';
import { onMounted, ref, watch } from 'vue';
import ChevronDown from '@/components/utils/Icons/ChevronDown.vue';
import ArrowClockWise from '@/components/utils/Icons/ArrowClockWise.vue';
async function consultarRamos() {
    const respuesta = await fetchPublicJson<RamoInterface[]>('/filtros/ramos.json')
    if (respuesta) {
        ramos.value = respuesta
        const ids = respuesta.map((item: { id_ramo: number }) => item.id_ramo)
        seleccionados.value = ids;
    }
}
onMounted(async () => {
    await consultarRamos()
})
const emit = defineEmits<{
    filtrar: [ramos: number[]]
}>()

const expandido = ref<boolean>(false)
const ramos = ref<RamoInterface[] | null>(null)
const seleccionados = ref<number[]>([])

function handleClickRamo(id: number) {
    const idsRamos =
        ramos.value?.map((r) => r.id_ramo) ?? []

    const todasSeleccionadas =
        idsRamos.length > 0 &&
        idsRamos.every((id) => seleccionados.value.includes(id))

    const seleccionada = seleccionados.value.includes(id)

    if (todasSeleccionadas) {
        seleccionados.value = [id]
        return
    }

    if (seleccionada && seleccionados.value.length === 1) {
        seleccionados.value = idsRamos
        return
    }

    seleccionados.value = seleccionada
        ? seleccionados.value.filter((item) => item !== id)
        : [...seleccionados.value, id]
}
function resetear() {
    const ids = ramos.value?.map((item: { id_ramo: number }) => item.id_ramo)
    seleccionados.value = ids ?? []
}
watch(
    seleccionados,
    async (nuevosActivos: number[]) => {
        emit("filtrar", nuevosActivos);
    },
    {
        deep: true,
    },
);
</script>
<template>
    <section class="contenedor absolute left-1  z-1000 py-2
        flex flex-col
        items-start justify-start  gap-2 " :class="{
            'expandido': expandido
        }">
        <button type="button" class="rounded-full bg-white min-w-[3rem] min-h-[3rem]
             flex items-center justify-center shadow lg:hidden cursor-pointer" @click="() => { expandido = !expandido }">
            <ChevronDown class="transition duration-300 ease" :class="{ '-rotate-180': expandido }" />
        </button>
        <div class=" absolute top-4 right-[50%] lg:top-0 lg:right-0">
            <button type="button" class="rounded-full bg-white min-w-[2rem] min-h-[2rem] cursor-pointer
             flex items-center justify-center shadow " @click="resetear"
                :class="{ 'hidden': seleccionados.length === ramos?.length }">
                <ArrowClockWise class="transition duration-300 ease" />
            </button>
        </div>
        <button type="button" v-if="ramos" v-for="ramo in ramos" :key="ramo.id_ramo"
            class=" boton-ramo rounded-full px-2 py-2 shadow "
            :class="{ 'seleccionado': seleccionados.includes(ramo.id_ramo) }" :style="{
                '--color-borde': ramoColores.get(ramo.id_ramo)
            }" @click="handleClickRamo(ramo.id_ramo)">{{ ramo.ramo }}</button>
    </section>
</template>
<style scoped>
.contenedor {
    height: 100%;
    max-height: 3.5rem;
    overflow: hidden;
    top: 5rem;
    font-size: 0.9rem;
    max-width: 15rem;
    width: 15rem;
    transition: max-height 0.3s ease;
}

.contenedor.expandido {
    max-height: calc(100% - 5rem);
    overflow-y: auto;
    overflow-x: visible;
}

.boton-ramo {
    background-color: #f8f4f1;
    text-align: start;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0%;
    border-left: 5px solid var(--color-borde, #999999);
    cursor: pointer;
    transition: transform 0.3s ease;
    transform-origin: left;
    width: 10rem;
    opacity: 0.6;
}

.boton-ramo:hover,
.boton-ramo.seleccionado {
    transform: scaleX(1.05);
    opacity: 1;
}

@media (min-width:1024px) {
    .contenedor {
        max-height: calc(100% - 5rem);
    }
}
</style>