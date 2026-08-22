<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { fetchPublicText } from '@/components/utils/utils.js'

const mapaContainer = ref<HTMLElement | null>(null)

const svgMapa = ref('')

const emit = defineEmits<{
    seleccionar: [
        estado: {
            id: number
            codigo: string
            nombre: string
        }
    ]
}>()

/*
 * Relación entre código ISO del SVG
 * y el id_entidad_federativa de tus datos.
 */
const entidades: Record<string, number> = {
    MXAGU: 1,
    MXBCN: 2,
    MXBCS: 3,
    MXCAM: 4,
    MXCOA: 5,
    MXCOL: 6,
    MXCHP: 7,
    MXCHH: 8,
    MXCMX: 9,
    MXDUR: 10,
    MXGUA: 11,
    MXGRO: 12,
    MXHID: 13,
    MXJAL: 14,
    MXMEX: 15,
    MXMIC: 16,
    MXMOR: 17,
    MXNAY: 18,
    MXNLE: 19,
    MXOAX: 20,
    MXPUE: 21,
    MXQUE: 22,
    MXROO: 23,
    MXSLP: 24,
    MXSIN: 25,
    MXSON: 26,
    MXTAB: 27,
    MXTAM: 28,
    MXTLA: 29,
    MXVER: 30,
    MXYUC: 31,
    MXZAC: 32
}

async function obtenerMapa() {
    const respuesta = await fetchPublicText('/mapas/mx.svg')

    if (!respuesta) {
        console.warn('No fue posible cargar el mapa de México')
        return
    }

    svgMapa.value = respuesta

    await nextTick()

    prepararMapa()
}

function prepararMapa() {
    if (!mapaContainer.value) return

    const svg = mapaContainer.value.querySelector('svg')

    if (!svg) {
        console.warn('No se encontró el SVG')
        return
    }

    // El SVG original usa "viewbox" en minúsculas
    svg.removeAttribute('viewbox')
    svg.setAttribute('viewBox', '0 0 1000 630')

    svg.removeAttribute('width')
    svg.removeAttribute('height')

    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    // Evitamos que estilos externos oculten el SVG
    svg.style.display = 'block'
    svg.style.width = '100%'
    svg.style.height = 'auto'
    svg.style.overflow = 'visible'

    const grupoEstados = svg.querySelector('#features')

    if (!grupoEstados) {
        console.warn('No se encontró #features')
        return
    }

    const estados = grupoEstados.querySelectorAll<SVGPathElement>('path')

    console.log('Estados encontrados:', estados.length)

    estados.forEach((estado) => {
        const codigo = estado.id
        const nombre = estado.getAttribute('name') ?? codigo
        const id = entidades[codigo]

        if (!id) {
            console.warn(
                `No existe id_entidad_federativa para ${codigo}`
            )
            return
        }

        estado.classList.add('estado-mexico')

        estado.dataset.entidadId = String(id)
        estado.dataset.entidadNombre = nombre

        /*
         * IMPORTANTE:
         * Aplicamos los colores directamente al SVG.
         *
         * Así evitamos conflictos con CSS global del proyecto.
         */
        estado.style.setProperty(
            'fill',
            '#5dc1be',
            'important'
        )

        estado.style.setProperty(
            'stroke',
            '#ffffff',
            'important'
        )

        estado.style.setProperty(
            'stroke-width',
            '1.5px',
            'important'
        )

        estado.addEventListener('click', () => {
            seleccionarEstado(estado)
        })
    })
}

function seleccionarEstado(estado: SVGPathElement) {
    if (!mapaContainer.value) return

    const id = Number(estado.dataset.entidadId)

    const nombre =
        estado.dataset.entidadNombre ?? ''

    const codigo = estado.id

    /*
     * Quitamos selección anterior.
     */
    mapaContainer.value
        .querySelectorAll('.estado-mexico.activo')
        .forEach((elemento) => {
            elemento.classList.remove('activo')
        })

    /*
     * Marcamos estado actual.
     */
    estado.classList.add('activo')

    emit('seleccionar', {
        id,
        codigo,
        nombre
    })
}

onMounted(async () => {
    await obtenerMapa()
})
</script>

<template>
    <div class="mapa-mexico">
        <div ref="mapaContainer" class="mapa-svg-container" v-html="svgMapa"></div>
    </div>
</template>

<style scoped>
.mapa-mexico {
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}

.mapa-svg-container {
    width: 100%;
    max-width: 1000px;
}

.mapa-svg-container :deep(svg) {
    width: 100%;
    height: auto;

    display: block;

    overflow: visible;
}

/* =========================================
   ESTADOS
========================================= */

.mapa-svg-container :deep(#features > path) {
    fill: #5dc1be !important;
    stroke: #ffffff !important;
    stroke-width: 1.5px !important;

    opacity: 1 !important;
    visibility: visible !important;

    cursor: pointer;

    transform-box: fill-box;
    transform-origin: center;

    transition:
        transform 0.2s ease,
        fill 0.2s ease,
        filter 0.2s ease;
}

.mapa-svg-container :deep(#features > path:hover) {
    fill: #ad8617 !important;

    transform: scale(1.05);

    filter:
        drop-shadow(0 4px 3px rgba(0, 0, 0, 0.18)) drop-shadow(0 7px 6px rgba(0, 0, 0, 0.12));
}

.mapa-svg-container :deep(#features > path.activo) {
    fill: #ad8617 !important;

    transform: scale(1.05);

    filter:
        drop-shadow(0 4px 3px rgba(0, 0, 0, 0.18)) drop-shadow(0 7px 6px rgba(0, 0, 0, 0.12));
}

/*
 * El SVG también contiene puntos que no necesitamos
 * visualizar.
 */
.mapa-svg-container :deep(#points),
.mapa-svg-container :deep(#label_points) {
    display: none;
}
</style>