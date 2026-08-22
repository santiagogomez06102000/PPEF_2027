<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPublicJson } from '@/components/utils/utils.js'
import MapaMexico from './MapaMexico.vue'

interface EntidadFederativaDatos {
    id_entidad_federativa: number
    entidad_federativa: string
    total: number
    participaciones_federales: number
    aportaciones_federales: number
    convenios: number
    subsidios: number | null
}

const datos = ref<EntidadFederativaDatos[]>([])

const estadoSeleccionado =
    ref<EntidadFederativaDatos | null>(null)

async function obtenerDatos() {
    const respuesta =
        await fetchPublicJson<EntidadFederativaDatos[]>(
            '/db/gasto_federalizado_mapa.json'
        )

    if (respuesta) {
        datos.value = respuesta
    }
}

function seleccionarEstado(id: number) {
    const estado = datos.value.find(
        item => item.id_entidad_federativa === id
    )

    if (!estado) {
        console.warn(
            `No se encontraron datos para la entidad ${id}`
        )

        return
    }

    estadoSeleccionado.value = estado

    console.log('Estado seleccionado:', estado)
}

onMounted(async () => {
    await obtenerDatos()
})
</script>

<template>
    <section class="view-mapa">

        <div class="mapa-container">

            <MapaMexico @seleccionar="seleccionarEstado" />

        </div>

    </section>
</template>

<style scoped>
.view-mapa {
    width: 100%;
}

.mapa-container {
    width: 100%;
    min-height: 500px;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>