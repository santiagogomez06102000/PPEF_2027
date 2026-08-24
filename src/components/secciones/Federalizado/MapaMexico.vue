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

const props = defineProps<{
    datos: EntidadFederativaDatos[]
}>()

const emit = defineEmits<{
    seleccionar: [estado: EstadoSeleccionado]
}>()

const mapaContainer = ref<HTMLElement | null>(null)
const svgMapa = ref('')

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

async function obtenerMapa() {
    const respuesta = await fetchPublicText('/mapa/mx.svg')

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

    svg.removeAttribute('viewbox')
    svg.setAttribute('viewBox', '0 0 1000 630')

    svg.removeAttribute('width')
    svg.removeAttribute('height')

    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

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

    estados.forEach((estado) => {
        const codigo = estado.id
        const nombre = estado.getAttribute('name') ?? codigo
        const id = entidades[codigo]

        if (!id) {
            console.warn(`No existe id_entidad_federativa para ${codigo}`)
            return
        }

        estado.classList.add('estado-mexico')
        estado.dataset.entidadId = String(id)
        estado.dataset.entidadNombre = nombre

        estado.style.setProperty('stroke', '#ffffff', 'important')
        estado.style.setProperty('stroke-width', '1.5px', 'important')

        estado.addEventListener('click', () => {
            seleccionarEstado(estado)
        })
    })

    pintarMapa()
}

function obtenerColor(valorNormalizado: number): string {
    const t = Math.max(0, Math.min(1, valorNormalizado))

    const r = Math.round(
        COLOR_CLARO.r + (COLOR_OSCURO.r - COLOR_CLARO.r) * t
    )

    const g = Math.round(
        COLOR_CLARO.g + (COLOR_OSCURO.g - COLOR_CLARO.g) * t
    )

    const b = Math.round(
        COLOR_CLARO.b + (COLOR_OSCURO.b - COLOR_CLARO.b) * t
    )

    return `rgb(${r}, ${g}, ${b})`
}

function pintarMapa() {
    if (!mapaContainer.value) return
    if (!props.datos.length) return

    const valores = props.datos
        .map(item => Number(item.total))
        .filter(valor => Number.isFinite(valor))

    if (!valores.length) return

    const minimo = Math.min(...valores)
    const maximo = Math.max(...valores)

    props.datos.forEach((entidad) => {
        const path =
            mapaContainer.value?.querySelector<SVGPathElement>(
                `[data-entidad-id="${entidad.id_entidad_federativa}"]`
            )

        if (!path) return

        const normalizado =
            maximo === minimo
                ? 0.5
                : (entidad.total - minimo) / (maximo - minimo)

        const color = obtenerColor(normalizado)

        path.style.setProperty('fill', color, 'important')
        path.dataset.total = String(entidad.total)
        path.dataset.color = color
    })
}

function seleccionarEstado(estado: SVGPathElement) {
    if (!mapaContainer.value) return

    const id = Number(estado.dataset.entidadId)
    const nombre = estado.dataset.entidadNombre ?? ''
    const codigo = estado.id
    const pathD = estado.getAttribute('d') ?? ''
    const color = estado.dataset.color ?? 'rgb(6, 101, 122)'

    const bbox = estado.getBBox()
    const padding = 12

    const viewBox = [
        bbox.x - padding,
        bbox.y - padding,
        bbox.width + padding * 2,
        bbox.height + padding * 2
    ].join(' ')

    mapaContainer.value
        .querySelectorAll('.estado-mexico.activo')
        .forEach((elemento) => {
            elemento.classList.remove('activo')
        })

    estado.classList.add('activo')

    emit('seleccionar', {
        id,
        codigo,
        nombre,
        pathD,
        viewBox,
        color
    })
}

watch(
    () => props.datos,
    () => {
        pintarMapa()
    },
    { deep: true }
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

.mapa-svg-container :deep(#features > path) {
    opacity: 1 !important;
    visibility: visible !important;
    cursor: pointer;
    transform-box: fill-box;
    transform-origin: center;
    transition:
        transform 0.2s ease,
        filter 0.2s ease,
        stroke 0.2s ease;
}

.mapa-svg-container :deep(#features > path:hover) {
    transform: scale(1.05);
    stroke: #ffffff !important;
    stroke-width: 2.5px !important;
    filter:
        drop-shadow(0 4px 3px rgba(0, 0, 0, 0.18)) drop-shadow(0 7px 6px rgba(0, 0, 0, 0.12));
}

.mapa-svg-container :deep(#features > path.activo) {
    transform: scale(1.05);
    stroke: #ffffff !important;
    stroke-width: 3px !important;
    filter:
        drop-shadow(0 4px 3px rgba(0, 0, 0, 0.2)) drop-shadow(0 7px 6px rgba(0, 0, 0, 0.15));
}
</style>