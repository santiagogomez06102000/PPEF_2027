<script setup lang="ts">
import {
    nextTick,
    onMounted,
    ref,
    watch
} from 'vue'

import { fetchPublicText } from '@/components/utils/utils.js'

interface EntidadFederativaDatos {
    id_entidad_federativa: number
    entidad_federativa: string
    total: number
    participaciones_federales: number
    aportaciones_federales: number
    convenios: number
    subsidios: number | null
}

interface EstadoSeleccionado {
    id: number
    codigo: string
    nombre: string
    pathD: string
    viewBox: string
    color: string
}

interface CajaEstado {
    x: number
    y: number
    width: number
    height: number
}

const props = defineProps<{
    datos: EntidadFederativaDatos[]
}>()

const emit = defineEmits<{
    seleccionar: [estado: EstadoSeleccionado]
}>()

const mapaContainer = ref<HTMLElement | null>(null)
const svgMapa = ref('')

/*
 * Capa independiente para dibujar el estado
 * que tiene hover.
 *
 * Nunca moveremos el path original.
 */
const hoverLayer = ref<SVGGElement | null>(null)

/* =========================================================
   ENTIDADES
========================================================= */

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

/* =========================================================
   COLORES COROPLÉTICOS
========================================================= */

const COLOR_CLARO = {
    r: 120,
    g: 226,
    b: 240
}

const COLOR_OSCURO = {
    r: 6,
    g: 101,
    b: 122
}

/* =========================================================
   HOVER PROPORCIONAL
========================================================= */

const ESCALA_MINIMA = 1.05
const ESCALA_MAXIMA = 1.35

/*
 * Cuántas unidades visuales queremos agregar
 * aproximadamente al estado.
 */
const CRECIMIENTO_VISUAL = 12

/*
 * Espacio alrededor del estado cuando se muestra
 * individualmente en el panel derecho.
 */
const MARGEN_PREVIEW = 0.25

/* =========================================================
   CARGAR MAPA
========================================================= */

async function obtenerMapa() {
    const respuesta =
        await fetchPublicText('/mapa/mx.svg')

    if (!respuesta) {
        console.warn(
            'No fue posible cargar el mapa de México'
        )
        return
    }

    svgMapa.value = respuesta

    await nextTick()

    prepararMapa()
}

/* =========================================================
   PREPARACIÓN
========================================================= */

function prepararMapa() {
    if (!mapaContainer.value) return

    const svg =
        mapaContainer.value.querySelector<SVGSVGElement>(
            'svg'
        )

    if (!svg) {
        console.warn('No se encontró el SVG')
        return
    }

    svg.removeAttribute('viewbox')

    svg.setAttribute(
        'viewBox',
        '0 0 1000 630'
    )

    svg.removeAttribute('width')
    svg.removeAttribute('height')

    svg.setAttribute(
        'preserveAspectRatio',
        'xMidYMid meet'
    )

    svg.style.display = 'block'
    svg.style.width = '100%'
    svg.style.height = 'auto'
    svg.style.overflow = 'visible'

    const grupoEstados =
        svg.querySelector('#features')

    if (!grupoEstados) {
        console.warn(
            'No se encontró #features'
        )
        return
    }

    /*
     * Creamos la capa que siempre estará
     * encima del resto del SVG.
     */
    crearCapaHover(svg)

    const estados =
        grupoEstados.querySelectorAll<SVGPathElement>(
            'path'
        )

    console.log(
        'Estados encontrados:',
        estados.length
    )

    estados.forEach((estado) => {

        const codigo = estado.id

        const nombre =
            estado.getAttribute('name') ??
            codigo

        const id =
            entidades[codigo]

        if (!id) {
            console.warn(
                `No existe id_entidad_federativa para ${codigo}`
            )
            return
        }

        estado.classList.add(
            'estado-mexico'
        )

        estado.dataset.entidadId =
            String(id)

        estado.dataset.entidadNombre =
            nombre

        /*
         * Calculamos una escala diferente
         * dependiendo del tamaño del estado.
         */
        const escala =
            calcularEscalaHover(estado)

        estado.dataset.hoverScale =
            escala.toFixed(3)

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

        /*
         * IMPORTANTE:
         *
         * Ya NO hacemos appendChild(estado).
         */
        estado.addEventListener(
            'pointerenter',
            () => {
                mostrarHover(estado)
            }
        )

        estado.addEventListener(
            'pointerleave',
            () => {
                ocultarHover()
            }
        )

        estado.addEventListener(
            'click',
            () => {
                seleccionarEstado(estado)
            }
        )
    })

    pintarMapa()
}

/* =========================================================
   CAPA DE HOVER
========================================================= */

function crearCapaHover(
    svg: SVGSVGElement
) {
    const existente =
        svg.querySelector<SVGGElement>(
            '#hover-layer'
        )

    if (existente) {
        hoverLayer.value = existente
        return
    }

    const namespace =
        'http://www.w3.org/2000/svg'

    const capa =
        document.createElementNS(
            namespace,
            'g'
        )

    capa.setAttribute(
        'id',
        'hover-layer'
    )

    /*
     * Fundamental:
     *
     * Esta copia visual jamás recibe
     * eventos del cursor.
     */
    capa.setAttribute(
        'pointer-events',
        'none'
    )

    /*
     * Al agregarla al final del SVG,
     * todo lo que dibujemos aquí
     * queda encima de los estados.
     */
    svg.appendChild(capa)

    hoverLayer.value = capa
}

/* =========================================================
   MOSTRAR HOVER
========================================================= */

function mostrarHover(
    estado: SVGPathElement
) {
    const capa = hoverLayer.value

    if (!capa) return

    /*
     * Solo debe existir un clon.
     */
    capa.replaceChildren()

    const clon =
        estado.cloneNode(true)
        as SVGPathElement

    /*
     * Evitamos tener IDs duplicados.
     */
    clon.removeAttribute('id')

    clon.classList.remove(
        'estado-mexico',
        'activo'
    )

    clon.classList.add(
        'estado-hover-clone'
    )

    clon.style.pointerEvents = 'none'

    /*
     * Recuperamos la escala calculada
     * para este estado.
     */
    const escala =
        estado.dataset.hoverScale ??
        String(ESCALA_MINIMA)

    clon.style.setProperty(
        '--hover-scale',
        escala
    )

    /*
     * Conservamos el color coroplético.
     */
    const color =
        estado.dataset.color

    if (color) {
        clon.style.setProperty(
            'fill',
            color,
            'important'
        )
    }

    capa.appendChild(clon)

    /*
     * Dos frames permiten que el navegador
     * registre scale(1) antes de animar.
     */
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            clon.classList.add(
                'visible'
            )
        })
    })
}

function ocultarHover() {
    if (!hoverLayer.value) return

    hoverLayer.value.replaceChildren()
}

/* =========================================================
   TAMAÑO DEL ESTADO
========================================================= */

function obtenerCajaEstado(
    estado: SVGPathElement
): CajaEstado {

    const bbox =
        estado.getBBox()

    return {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height
    }
}

/* =========================================================
   ESCALA PROPORCIONAL
========================================================= */

function calcularEscalaHover(
    estado: SVGPathElement
): number {

    const bbox =
        obtenerCajaEstado(estado)

    const dimension =
        Math.max(
            bbox.width,
            bbox.height
        )

    if (dimension <= 0) {
        return ESCALA_MINIMA
    }

    /*
     * Estados grandes:
     * escala cercana a 1.05
     *
     * Estados pequeños:
     * escala progresivamente mayor.
     */
    const escala =
        1 +
        CRECIMIENTO_VISUAL /
        dimension

    return Math.min(
        ESCALA_MAXIMA,
        Math.max(
            ESCALA_MINIMA,
            escala
        )
    )
}

/* =========================================================
   VIEWBOX DEL PANEL DERECHO
========================================================= */

function crearViewBoxPreview(
    estado: SVGPathElement
): string {

    const bbox =
        obtenerCajaEstado(estado)

    const dimensionMayor =
        Math.max(
            bbox.width,
            bbox.height
        )

    const margen =
        dimensionMayor *
        MARGEN_PREVIEW

    return [
        bbox.x - margen,
        bbox.y - margen,

        bbox.width +
        margen * 2,

        bbox.height +
        margen * 2
    ].join(' ')
}

/* =========================================================
   COLOR COROPLÉTICO
========================================================= */

function obtenerColor(
    valorNormalizado: number
): string {

    const t =
        Math.max(
            0,
            Math.min(
                1,
                valorNormalizado
            )
        )

    const r =
        Math.round(
            COLOR_CLARO.r +
            (
                COLOR_OSCURO.r -
                COLOR_CLARO.r
            ) * t
        )

    const g =
        Math.round(
            COLOR_CLARO.g +
            (
                COLOR_OSCURO.g -
                COLOR_CLARO.g
            ) * t
        )

    const b =
        Math.round(
            COLOR_CLARO.b +
            (
                COLOR_OSCURO.b -
                COLOR_CLARO.b
            ) * t
        )

    return `rgb(${r}, ${g}, ${b})`
}

/* =========================================================
   PINTAR MAPA
========================================================= */

function pintarMapa() {
    if (!mapaContainer.value) return
    if (!props.datos.length) return

    const valores =
        props.datos
            .map(
                item =>
                    Number(item.total)
            )
            .filter(
                valor =>
                    Number.isFinite(valor)
            )

    if (!valores.length) return

    const minimo =
        Math.min(...valores)

    const maximo =
        Math.max(...valores)

    props.datos.forEach(
        entidad => {

            const path =
                mapaContainer.value
                    ?.querySelector<
                        SVGPathElement
                    >(
                        `[data-entidad-id="${entidad.id_entidad_federativa}"]`
                    )

            if (!path) return

            const normalizado =
                maximo === minimo
                    ? 0.5
                    : (
                        entidad.total -
                        minimo
                    ) /
                    (
                        maximo -
                        minimo
                    )

            const color =
                obtenerColor(
                    normalizado
                )

            path.style.setProperty(
                'fill',
                color,
                'important'
            )

            path.dataset.total =
                String(
                    entidad.total
                )

            path.dataset.color =
                color
        }
    )
}

/* =========================================================
   SELECCIÓN
========================================================= */

function seleccionarEstado(
    estado: SVGPathElement
) {
    if (!mapaContainer.value) return

    const id =
        Number(
            estado.dataset.entidadId
        )

    const nombre =
        estado.dataset
            .entidadNombre ?? ''

    const codigo =
        estado.id

    const pathD =
        estado.getAttribute('d') ??
        ''

    const color =
        estado.dataset.color ??
        'rgb(6, 101, 122)'

    const viewBox =
        crearViewBoxPreview(
            estado
        )

    /*
     * Quitamos selección anterior.
     */
    mapaContainer.value
        .querySelectorAll(
            '.estado-mexico.activo'
        )
        .forEach(
            elemento => {
                elemento.classList.remove(
                    'activo'
                )
            }
        )

    estado.classList.add(
        'activo'
    )

    /*
     * El emit vuelve a funcionar normalmente
     * porque el path original nunca se mueve.
     */
    emit('seleccionar', {
        id,
        codigo,
        nombre,
        pathD,
        viewBox,
        color
    })
}

/* =========================================================
   WATCH
========================================================= */

watch(
    () => props.datos,
    () => {
        pintarMapa()
    },
    {
        deep: true
    }
)

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
   ESTADOS ORIGINALES
========================================= */

.mapa-svg-container :deep(#features > path) {
    opacity: 1 !important;
    visibility: visible !important;

    cursor: pointer;

    /*
     * El estado original ya NO escala.
     *
     * Esto evita el parpadeo.
     */
    transition:
        stroke 0.18s ease,
        filter 0.18s ease;
}

/* =========================================
   ESTADO SELECCIONADO
========================================= */

.mapa-svg-container :deep(#features > path.activo) {
    stroke: #ffffff !important;
    stroke-width: 3px !important;

    filter:
        drop-shadow(0 3px 3px rgba(0, 0, 0, 0.18));
}

/* =========================================
   CAPA SUPERIOR DEL HOVER
========================================= */

.mapa-svg-container :deep(#hover-layer) {
    pointer-events: none;
}

/*
 * El clon comienza exactamente
 * en la posición original.
 */
.mapa-svg-container :deep(.estado-hover-clone) {
    pointer-events: none;

    transform-box: fill-box;
    transform-origin: center;

    transform: scale(1);

    stroke: #ffffff !important;
    stroke-width: 2.5px !important;

    transition:
        transform 0.18s ease,
        filter 0.18s ease;
}

/*
 * Después pasa a la escala proporcional.
 */
.mapa-svg-container :deep(.estado-hover-clone.visible) {
    transform:
        scale(var(--hover-scale,
                1.05));

    filter:
        drop-shadow(0 4px 3px rgba(0, 0, 0, 0.18)) drop-shadow(0 7px 6px rgba(0, 0, 0, 0.12));
}
</style>