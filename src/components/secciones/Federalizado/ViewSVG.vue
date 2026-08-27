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
    /*
     * Si hacemos click sobre el estado que ya
     * está seleccionado, lo deseleccionamos.
     */
    if (
        estadoSeleccionado.value?.id === estado.id
    ) {
        estadoSeleccionado.value = null
        svgSeleccionado.value = ''

        return
    }

    /*
     * Si es otro estado, lo seleccionamos normalmente.
     */
    estadoSeleccionado.value = estado

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
            return (
                item[clave] !== null &&
                item[clave] !== undefined
            )
        })
        .map(({ clave, etiqueta }) => {
            return {
                clave,
                etiqueta,
                valor: `$${formatearNumero(item[clave])}`
            }
        })
})

const totalSeleccionado = computed(() => {
    const item = datosEstadoSeleccionado.value

    if (
        !item ||
        item.total === null ||
        item.total === undefined
    ) {
        return null
    }

    return `$${formatearNumero(item.total)}`
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

                <!-- =========================================
                     ESTADO INICIAL
                ========================================== -->
                <div v-if="!estadoSeleccionado" class="panel-inicial">
                    <div class="panel-inicial__mascota">
                        <Mascota :mascota="7" ancho="12rem" alto="12rem" />
                    </div>

                    <p class="panel-inicial__texto">
                        <strong class="panel-inicial__destacado">
                            Selecciona un estado
                        </strong>

                        <span class="panel-inicial__descripcion">
                            para conocer el monto designado
                        </span>
                    </p>
                </div>


                <!-- =========================================
                     ENTIDAD SELECCIONADA
                ========================================== -->
                <div v-else class="panel-estado">
                    <!-- SVG DEL ESTADO -->
                    <div class="estado-preview-wrapper">
                        <div v-if="svgSeleccionado" class="estado-preview" v-html="svgSeleccionado" />

                        <div v-else class="estado-preview-cargando">
                            Cargando entidad...
                        </div>
                    </div>


                    <!-- INFORMACIÓN -->
                    <div class="estado-informacion">

                        <!-- TOTAL -->
                        <template v-if="totalSeleccionado">
                            <p class="estado-total">
                                {{ totalSeleccionado }}
                            </p>

                            <p class="estado-unidad">
                                millones de pesos
                            </p>
                        </template>


                        <!-- NOMBRE -->
                        <h3 class="estado-nombre">
                            {{ estadoSeleccionado.nombre }}
                        </h3>


                        <!-- DESGLOSE -->
                        <div v-if="listaDatos.length" class="estado-datos">
                            <ul>
                                <li v-for="item in listaDatos" :key="item.clave">
                                    <strong>
                                        {{ item.etiqueta }}:
                                    </strong>

                                    {{ item.valor }}
                                </li>
                            </ul>
                        </div>


                        <p v-else-if="!cargandoDatos" class="estado-sin-datos">
                            No hay información disponible para esta entidad.
                        </p>

                    </div>
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
   LAYOUT GENERAL
========================================================= */

.view-mapa__contenido {
    display: flex;
    align-items: stretch;

    width: 100%;
    min-width: 0;

    /* gap: 1.5rem; */
}

.view-mapa__mapa {
    flex: 80 1 0;

    min-width: 0;

    display: flex;
    align-items: center;
    justify-content: center;
}


.view-mapa__panel {
    flex: 44 1 0;

    min-width: 320px;

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

/*
 * Mascota izquierda
 * Texto derecha
 */
.panel-inicial {
    width: 100%;

    display: flex;
    flex-direction: row;

    justify-content: center;
    align-items: center;

    gap: 1.5rem;
}


.panel-inicial__mascota {
    flex: 0 0 auto;

    display: flex;
    justify-content: center;
    align-items: center;
}


.panel-inicial__texto {
    margin: 0;

    max-width: 280px;

    display: flex;
    flex-direction: column;

    text-align: left;

    line-height: 1.2;
}


/*
 * Texto principal grande.
 */
.panel-inicial__destacado {
    display: block;

    font-size: clamp(1.6rem,
            2.2vw,
            2.3rem);

    font-weight: 700;
    color: rgb(0, 161, 205);
}


/*
 * Texto secundario.
 */
.panel-inicial__descripcion {
    display: block;

    margin-top: 0.3rem;

    font-size: 1.1rem;
    font-weight: 400;

    line-height: 1.35;
}


/* =========================================================
   ENTIDAD SELECCIONADA
========================================================= */

.panel-estado {
    width: 100%;

    display: flex;
    flex-direction: row;

    justify-content: center;
    align-items: center;

    gap: 1.75rem;
}


/* =========================================================
   SVG DEL ESTADO
========================================================= */

.estado-preview-wrapper {
    width: 190px;
    height: 170px;

    flex: 0 0 190px;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;
}


.estado-preview {
    width: 100%;
    height: 100%;
}


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
   CONTENEDOR DE INFORMACIÓN
========================================================= */

.estado-informacion {
    flex: 1;

    min-width: 0;
    max-width: 390px;

    display: flex;
    flex-direction: column;
}


/* =========================================================
   TOTAL PRINCIPAL
========================================================= */

.estado-total {
    margin: 0;

    font-size: clamp(2.2rem,
            3.2vw,
            3.4rem);

    font-weight: 700;

    line-height: 1;

    letter-spacing: -0.03em;
    color: rgb(64, 157, 162);
}


.estado-unidad {
    margin: 0.25rem 0 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
}


/* =========================================================
   NOMBRE DEL ESTADO
========================================================= */

.estado-nombre {
    margin: 1rem 0 0.75rem;
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    color: rgb(0, 161, 205);
}


/* =========================================================
   INFORMACIÓN
========================================================= */

.estado-datos {
    width: 100%;
}


.estado-datos ul {
    margin: 0;
    padding-left: 1.25rem;
    list-style: disc;
}


.estado-datos li {
    margin-bottom: 0.5rem;

    font-size: 0.95rem;

    line-height: 1.4;
}


.estado-datos li:last-child {
    margin-bottom: 0;
}

.estado-datos li::marker {
    color: rgb(6, 101, 122);
}


.estado-datos strong {
    font-weight: 700;
}


.estado-sin-datos,
.error-datos {
    margin: 0;

    font-size: 0.9rem;

    text-align: left;
}


.error-datos {
    margin-top: 1rem;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1100px) {

    .view-mapa__contenido {
        gap: 1rem;
    }


    .view-mapa__mapa {
        flex: 58 1 0;
    }


    .view-mapa__panel {
        flex: 42 1 0;

        min-width: 280px;

        padding: 0.5rem;
    }


    .panel-inicial {
        gap: 0.75rem;
    }


    .panel-inicial__mascota {
        transform: scale(0.85);
    }


    .panel-estado {
        gap: 1rem;
    }


    .estado-preview-wrapper {
        width: 150px;
        height: 145px;

        flex-basis: 150px;
    }
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {

    .view-mapa__contenido {
        flex-direction: column;

        gap: 1.5rem;
    }


    .view-mapa__mapa,
    .view-mapa__panel {
        flex: none;

        width: 100%;
        min-width: 0;
    }


    .view-mapa__mapa {
        /*
         * En móvil MapaMexico necesita todo el ancho
         * disponible para las proyecciones de los
         * estados pequeños.
         */
        width: 100%;
    }


    .view-mapa__panel {
        min-height: auto;

        padding:
            1rem 0;
    }


    /*
     * En tablet/móvil todavía mantenemos mascota
     * y texto juntos mientras haya espacio.
     */
    .panel-inicial {
        max-width: 520px;

        margin: 0 auto;
    }


    .panel-estado {
        max-width: 560px;

        margin: 0 auto;
    }
}


/* =========================================================
   TELÉFONO
========================================================= */

@media (max-width: 600px) {

    /*
     * Aquí sí pasamos mascota y texto a columna
     * porque ya no existe suficiente ancho.
     */
    .panel-inicial {
        flex-direction: column;

        gap: 0.5rem;

        text-align: center;
    }


    .panel-inicial__mascota {
        transform: none;
    }


    .panel-inicial__texto {
        align-items: center;

        max-width: 320px;

        text-align: center;
    }


    .panel-inicial__destacado {
        font-size: 1.8rem;
    }


    .panel-inicial__descripcion {
        font-size: 1rem;
    }


    /*
     * Estado seleccionado:
     * SVG arriba e información abajo.
     */
    .panel-estado {
        flex-direction: column;

        gap: 0.75rem;
    }


    .estado-preview-wrapper {
        width: 180px;
        height: 145px;

        flex-basis: auto;
    }


    .estado-informacion {
        width: 100%;
        max-width: 350px;

        align-items: center;

        text-align: center;
    }


    .estado-total {
        font-size: 2.5rem;
    }


    .estado-nombre {
        text-align: center;
    }


    .estado-datos {
        text-align: left;
    }


    .estado-sin-datos,
    .error-datos {
        text-align: center;
    }
}
</style>