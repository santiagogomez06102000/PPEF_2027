<script setup lang="ts">

const props = defineProps<Props>();

interface Props {
    detalle: Barra
    subtitulo: string
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
    '#00b3c3',
    '#00909d',
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
        <span class="text-[#757575] col-span-12 text-right" v-html="subtitulo"></span>
        <table class="col-span-12">
            <colgroup>
                <col style="width: 20%" />
                <col style="width: 12%" />
                <col style="width: auto" />
                <col style="width: auto" />
            </colgroup>
            <thead>
                <tr>
                    <td class="text-[#0a5a45] text-center bg-[#f5f2ed] font-bold px-2">% del total</td>
                    <td class="text-[#0a5a45] text-center bg-[#f5f2ed] font-bold px-2">Variación</td>
                    <td class="text-[#0a5a45] text-center bg-[#f5f2ed] font-bold px-2">Desagregado</td>
                    <td class="text-[#0a5a45] text-end bg-[#f5f2ed] font-bold    px-2">2027</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(fila, i) in detalle.segmentos" :key="i">
                    <td class="px-2 text-center text-white " :style="{
                        backgroundColor: colores[i]
                    }">{{ fila.porcentaje }}</td>
                    <td class="px-2 text-center " :style="{
                        color: fila.tendencia === '▲' ? '#2a9d8f' : fila.tendencia === '▼' ? '#e63946' : '#888888'
                    }">{{
                        fila.tendencia }}</td>
                    <td class="px-2 text-center text-black ">{{ fila.ramo }}</td>
                    <td class="px-2 text-end text-black ">{{ fila.monto }}</td>
                </tr>
            </tbody>
            <tfoot v-if="detalle.nota">
                <tr>
                    <td colspan="4" class="pt-3 text-xs">
                        {{ detalle.nota }}
                    </td>
                </tr>
            </tfoot>
        </table>
    </section>

</template>
<style lang="css" scoped>
.text-outline {
    -webkit-text-stroke: 1px white;
    font-size: 2rem;
    color: var(--color-flecha);
}
</style>