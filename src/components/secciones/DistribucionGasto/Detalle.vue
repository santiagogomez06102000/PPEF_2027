<script setup lang="ts">

const props = defineProps<Props>();

interface Props {
    detalle: Barra
}
type Tendencia = "▲" | "▼" | "-";

export interface Barra {
    id: string;
    nombre: string;
    total: string;
    porcentajeTotal: number;
    tendencia: Tendencia;
    respecto: string;
    nota: string | null;
    segmentos: Segmento[];
}
const colores = [
    '#0b4f4f',
    '#136f63',
    '#1a8a9e',
    '#2a9d8f',
    '#5bc4bf',
    '#7fdbda',
    '#90e0ef',
    '#457b9d',
    '#1d3557',
    '#264653',
    '#2b9348',
    '#83c5be',
    '#006d77',
    '#e29578',
    '#ffddd2',
    '#a8dadc',
]

interface Segmento {
    ramo: string;
    monto: string;
    porcentaje: number;
    tendencia: Tendencia;
}
</script>
<template>
    <section class="grid grid-cols-12 w-full gap-x-1 text">
        <h5 v-html="detalle.nombre" class="col-span-12 text-xl font-bold text-[#0a5a45]"></h5>
        <h6 v-html="`${detalle.porcentajeTotal}% del gasto programable`" class="col-span-12 text-[#757575] text-sm">
        </h6>
        <h6 v-html="`${detalle.total} - ${detalle.respecto}`" class="col-span-12 text-[#757575] text-sm"></h6>
        <span class="text-[#757575] col-span-12 text-right">Clasificación administrativa</span>
        <div class="hidden md:grid grid-cols-24 col-span-12">
            <span class="col-span-5 truncate px-2 text-[#0a5a45] text-center bg-[#f5f2ed] font-bold" title="%">%</span>
            <span class="col-span-3 truncate px-2 text-[#0a5a45] text-center bg-[#f5f2ed] font-bold" title="Variación">Variación</span>
            <span class="col-span-8 truncate px-2  text-[#0a5a45] bg-[#f5f2ed] font-bold" title="Desagregado">Desagregado</span>
            <span class="col-span-8 truncate px-2 text-[#0a5a45] text-center bg-[#f5f2ed] font-bold" title="2026">2026</span>
        </div>
        <div class="hidden md:grid grid-cols-24 col-span-12 gap-0" v-for="(row, i) in detalle.segmentos">
            <span class="col-span-5  px-2 truncate text-center text-white bg-[var(--color-porcentaje)]" :style="{
                '--color-porcentaje': colores[i]
            }" :title="row.porcentaje.toString()" v-html="row.porcentaje"></span>
            <span class="col-span-3 text-center truncate px-2 text-[var(--color-flecha)]" v-html="row.tendencia" :style="{
                '--color-flecha': row.tendencia === '▲' ? '#2a9d8f' : row.tendencia === '▼' ? '#e63946' : '#888888'
            }"></span>
            <span class="col-span-8 px-2  text-black truncate " v-html="row.ramo" :title="row.ramo"></span>
            <span class="col-span-8 px-2 text-center text-black truncate" :title="row.monto" v-html="row.monto"></span>
            
            
        </div>
        <!--MOBILE-->
        <div class="grid grid-cols-1 text-white md:hidden col-span-6 gap-2 bg-[var(--color-porcentaje)] px-2 py-1"
            v-for="(row, i) in detalle.segmentos" :style="{
                '--color-porcentaje': colores[i]
            }">
            <div class="font-bold text-lg" v-html="row.ramo"></div>
            <div v-html="row.monto"></div>
            <div v-html="row.porcentaje + '%'"></div>
            <div v-html="row.tendencia" class="text-outline" :style="{
                '--color-flecha': row.tendencia === '▲' ? '#2a9d8f' : row.tendencia === '▼' ? '#e63946' : '#888888'
            }"></div>



        </div>
        <div class="col-span-12 pt-3 text-xs" v-if="detalle.nota" v-html="detalle.nota">

        </div>

    </section>

</template>
<style lang="css" scoped>
.text-outline {
    -webkit-text-stroke: 1px white;
    font-size: 2rem;
    color: var(--color-flecha);
}
</style>