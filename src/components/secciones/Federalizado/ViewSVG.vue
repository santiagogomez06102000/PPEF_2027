<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPublicJson } from '@/components/utils/utils.js'
import Mascota from '@/components/utils/Mascota.vue'
import MapaMexico from './MapaMexico.vue'

interface EntidadFederativaDatos {
    id_entidad_federativa: number
    entidad_federativa: string
    total: number | null
    participaciones_federales: number | null
    aportaciones_federales: number | null
    convenios: number | null
    subsidios: number | null
}

interface EstadoMapa {
    id: number
    codigo: string
    nombre: string
    pathD: string
    viewBox: string
    color: string
}

interface EstadoSeleccionadoCompleto extends EntidadFederativaDatos {
    codigo: string
    nombre: string
    pathD: string
    viewBox: string
    color: string
}

const datos = ref<EntidadFederativaDatos[]>([])
const estadoSeleccionado = ref<EstadoSeleccionadoCompleto | null>(null)

async function obtenerDatos() {
    const respuesta =
        await fetchPublicJson<EntidadFederativaDatos[]>(
            '/db/gasto_federalizado_mapa.json'
        )

    if (respuesta) {
        datos.value = respuesta
    }
}

function seleccionarEstado(estadoMapa: EstadoMapa) {
    const estado = datos.value.find(
        item => item.id_entidad_federativa === estadoMapa.id
    )

    if (!estado) {
        console.warn(`No se encontraron datos para ${estadoMapa.nombre}`)
        return
    }

    estadoSeleccionado.value = {
        ...estado,
        ...estadoMapa
    }
}

function formatearNumero(valor: number | null): string {
    if (valor === null || valor === undefined) {
        return 'N/D'
    }

    return valor.toLocaleString('es-MX', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    })
}

onMounted(async () => {
    await obtenerDatos()
})
</script>

<template>
    <section class="view-mapa">
        <div class="contenido-mapa">

            <!-- MAPA -->
            <div class="mapa-container">
                <MapaMexico :datos="datos" @seleccionar="seleccionarEstado" />
            </div>

            <!-- PANEL DERECHO -->
            <div class="panel-estado">

                <!-- Si no hay selección, se ve la mascota -->
                <template v-if="!estadoSeleccionado">
                    <div class="mascota-wrapper">
                        <Mascota :mascota="7" ancho="12rem" alto="12rem" />
                    </div>

                    <p class="mensaje">
                        Selecciona un estado
                    </p>
                </template>

                <!-- Si hay selección, se reemplaza por la silueta del estado -->
                <template v-else>
                    <div class="estado-preview-card">

                        <div class="estado-preview-wrapper">
                            <svg class="estado-preview-svg" :viewBox="estadoSeleccionado.viewBox"
                                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path :d="estadoSeleccionado.pathD" :fill="estadoSeleccionado.color" stroke="#ffffff"
                                    stroke-width="1.5" />
                            </svg>
                        </div>
                        <p v-if="estadoSeleccionado.total !== null">
                            <strong>Total:</strong>
                            {{ formatearNumero(estadoSeleccionado.total) }}
                        </p>
                        <h3 class="estado-nombre">
                            {{ estadoSeleccionado.entidad_federativa }}
                        </h3>

                        <div class="estado-datos">
                            <ul class="lista-datos">

                                <li v-if="estadoSeleccionado.participaciones_federales !== null">
                                    <strong>Participaciones federales:</strong>
                                    {{ formatearNumero(estadoSeleccionado.participaciones_federales) }}
                                </li>

                                <li v-if="estadoSeleccionado.aportaciones_federales !== null">
                                    <strong>Aportaciones federales:</strong>
                                    {{ formatearNumero(estadoSeleccionado.aportaciones_federales) }}
                                </li>

                                <li v-if="estadoSeleccionado.convenios !== null">
                                    <strong>Convenios:</strong>
                                    {{ formatearNumero(estadoSeleccionado.convenios) }}
                                </li>

                                <li v-if="estadoSeleccionado.subsidios !== null">
                                    <strong>Subsidios:</strong>
                                    {{ formatearNumero(estadoSeleccionado.subsidios) }}
                                </li>

                            </ul>
                        </div>

                    </div>
                </template>

            </div>
        </div>
    </section>
</template>

<style scoped>
.view-mapa {
    width: 100%;
}

.contenido-mapa {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 2rem;
}

/* ============================
   MAPA
============================ */

.mapa-container {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* ============================
   PANEL DERECHO
============================ */

.panel-estado {
    width: 32%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* ============================
   ESTADO / MASCOTA
============================ */

.mascota-wrapper,
.estado-preview-wrapper {
    width: 100%;
    max-width: 260px;
    min-height: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.estado-preview-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.estado-preview-svg {
    width: 100%;
    max-width: 240px;
    height: auto;
    display: block;
    overflow: visible;
}

.estado-nombre {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
}

.mensaje {
    margin-top: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
}

/* ============================
   DATOS
============================ */

.estado-datos {
    width: 100%;
    margin-top: 0.5rem;
}

.lista-datos {
    margin: 0;
    padding-left: 1.5rem;

    text-align: left;

    list-style-type: disc;
}

.lista-datos li {
    margin-bottom: 0.6rem;

    font-size: 1rem;
    line-height: 1.4;
}

.lista-datos li:last-child {
    margin-bottom: 0;
}

.lista-datos strong {
    font-weight: 700;
}

/* ============================
   RESPONSIVE
============================ */

@media (max-width: 1024px) {
    .contenido-mapa {
        flex-direction: column;
    }

    .mapa-container,
    .panel-estado {
        width: 100%;
    }

    .panel-estado {
        max-width: 420px;
        margin: 0 auto;
    }
}
</style>