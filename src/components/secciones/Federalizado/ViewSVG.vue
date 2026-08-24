<script setup>
import { ref, computed, onMounted } from 'vue'

import Mascota from '@/components/utils/Mascota.vue'
import MapaMexico from './MapaMexico.vue'

// Ajusta únicamente esta ruta al archivo utils.ts que ya utilizas.
// NO es necesario modificar utils.ts.
import { fetchPublicJson } from '@/components/utils/utils'

const datos = ref([])
const estadoSeleccionado = ref(null)
const svgSeleccionado = ref('')

const cargandoDatos = ref(true)
const errorDatos = ref(false)

const mapaMexicoRef = ref(null)

/* =========================================================
   CARGA DE DATOS
========================================================= */

async function cargarDatos() {
    cargandoDatos.value = true
    errorDatos.value = false

    const respuesta = await fetchPublicJson(
        '/db/gasto_federalizado_mapa.json'
    )

    if (!Array.isArray(respuesta)) {
        datos.value = []
        errorDatos.value = true
        cargandoDatos.value = false
        return
    }

    datos.value = respuesta
    cargandoDatos.value = false
}

onMounted(() => {
    cargarDatos()
})

/* =========================================================
   SELECCIÓN
========================================================= */

function seleccionarEstado(estado) {
    estadoSeleccionado.value = estado

    /*
     * El SVG NO se vuelve a descargar.
     *
     * MapaMexico ya tiene los 32 SVG en memoria.
     * Solamente solicitamos una versión preparada para preview.
     */
    svgSeleccionado.value =
        mapaMexicoRef.value?.getSvgPreview(estado.id) || ''
}

/* =========================================================
   DATOS DE LA ENTIDAD SELECCIONADA
========================================================= */

const datosEstadoSeleccionado = computed(() => {
    if (!estadoSeleccionado.value) {
        return null
    }

    return (
        datos.value.find(
            (item) =>
                Number(item.id_entidad_federativa) ===
                Number(estadoSeleccionado.value.id)
        ) || null
    )
})

/* =========================================================
   FORMATO
========================================================= */

function formatearNumero(valor) {
    return Number(valor).toLocaleString('es-MX', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    })
}

/* =========================================================
   LISTA DE DATOS
========================================================= */

const listaDatos = computed(() => {
    const item = datosEstadoSeleccionado.value

    if (!item) {
        return []
    }

    const campos = [
        {
            clave: 'total',
            etiqueta: 'Total'
        },
        {
            clave: 'participaciones_federales',
            etiqueta: 'Participaciones federales'
        },
        {
            clave: 'aportaciones_federales',
            etiqueta: 'Aportaciones federales'
        },
        {
            clave: 'convenios',
            etiqueta: 'Convenios'
        },
        {
            clave: 'subsidios',
            etiqueta: 'Subsidios'
        }
    ]

    return campos
        .filter(({ clave }) => {
            return item[clave] !== null && item[clave] !== undefined
        })
        .map(({ clave, etiqueta }) => {
            return {
                clave,
                etiqueta,
                valor: formatearNumero(item[clave])
            }
        })
})
</script>

<template>
    <section class="view-mapa">
        <div class="view-mapa__contenido">
            <!-- =============================================
           MAPA
      ============================================== -->
            <div class="view-mapa__mapa">
                <MapaMexico ref="mapaMexicoRef" :datos="datos" :seleccionado-id="estadoSeleccionado?.id ?? null"
                    @seleccionar="seleccionarEstado" />
            </div>

            <!-- =============================================
           PANEL DERECHO
      ============================================== -->
            <aside class="view-mapa__panel">
                <!-- ESTADO INICIAL -->
                <div v-if="!estadoSeleccionado" class="panel-inicial">
                    <Mascota :mascota="7" ancho="12rem" alto="12rem" />

                    <p class="panel-inicial__texto">
                        Selecciona un estado
                    </p>
                </div>

                <!-- ENTIDAD SELECCIONADA -->
                <div v-else class="panel-estado">
                    <!-- SVG -->
                    <div class="estado-preview-wrapper">
                        <div v-if="svgSeleccionado" class="estado-preview" v-html="svgSeleccionado" />

                        <div v-else class="estado-preview-cargando">
                            Cargando entidad...
                        </div>
                    </div>

                    <!-- NOMBRE -->
                    <h3 class="estado-nombre">
                        {{ estadoSeleccionado.nombre }}
                    </h3>

                    <!-- DATOS -->
                    <div v-if="listaDatos.length" class="estado-datos">
                        <ul>
                            <li v-for="item in listaDatos" :key="item.clave">
                                <strong>{{ item.etiqueta }}:</strong>
                                {{ item.valor }}
                            </li>
                        </ul>
                    </div>

                    <p v-else-if="!cargandoDatos" class="estado-sin-datos">
                        No hay información disponible para esta entidad.
                    </p>
                </div>

                <p v-if="errorDatos" class="error-datos">
                    No fue posible cargar la información del mapa.
                </p>
            </aside>
        </div>
    </section>
</template>

<style scoped>
.view-mapa {
    width: 100%;
    min-width: 0;
}

/* =========================================================
   LAYOUT
========================================================= */

.view-mapa__contenido {
    display: flex;
    align-items: stretch;

    width: 100%;
    min-width: 0;

    gap: 2rem;
}

.view-mapa__mapa {
    flex: 7 1 0;

    min-width: 0;

    display: flex;
    align-items: center;
    justify-content: center;
}

.view-mapa__panel {
    flex: 3 1 0;

    min-width: 260px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;

    padding: 1rem;
}

/* =========================================================
   ESTADO INICIAL
========================================================= */

.panel-inicial {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 1rem;

    text-align: center;
}

.panel-inicial__texto {
    margin: 0;

    font-size: 1.1rem;
    font-weight: 600;
}

/* =========================================================
   ENTIDAD SELECCIONADA
========================================================= */

.panel-estado {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 1rem;
}

/* Contenedor SIEMPRE del mismo tamaño */
.estado-preview-wrapper {
    width: min(220px, 100%);
    height: 180px;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;

    flex-shrink: 0;
}

/* Contenedor generado mediante v-html */
.estado-preview {
    width: 100%;
    height: 100%;
}

/*
 * El SVG se inyecta mediante v-html,
 * por eso usamos :deep().
 */
.estado-preview :deep(svg) {
    display: block;

    width: 100%;
    height: 100%;

    max-width: 100%;
    max-height: 100%;

    overflow: visible;
}

.estado-preview-cargando {
    font-size: 0.9rem;
    opacity: 0.7;
}

/* =========================================================
   NOMBRE
========================================================= */

.estado-nombre {
    margin: 0;

    font-size: 1.5rem;
    font-weight: 700;

    text-align: center;
}

/* =========================================================
   INFORMACIÓN
========================================================= */

.estado-datos {
    width: 100%;
    max-width: 360px;
}

.estado-datos ul {
    margin: 0;
    padding-left: 1.3rem;
}

.estado-datos li {
    margin-bottom: 0.55rem;

    line-height: 1.45;
}

.estado-datos li:last-child {
    margin-bottom: 0;
}

.estado-sin-datos,
.error-datos {
    margin: 0;

    font-size: 0.9rem;
    text-align: center;
}

.error-datos {
    margin-top: 1rem;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
    .view-mapa__contenido {
        flex-direction: column;
    }

    .view-mapa__mapa,
    .view-mapa__panel {
        flex: none;

        width: 100%;
        min-width: 0;
    }

    .view-mapa__panel {
        min-height: 300px;
    }
}

@media (max-width: 480px) {
    .view-mapa__contenido {
        gap: 1rem;
    }

    .view-mapa__panel {
        padding-left: 0;
        padding-right: 0;
    }

    .estado-preview-wrapper {
        width: 190px;
        height: 155px;
    }
}
</style>