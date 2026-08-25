<template>

    <div ref="contenedor" class="ods__contenedor">

        <button v-for="burbuja in burbujas" :key="burbuja.id" class="ods__burbuja" :style="estiloBurbuja(burbuja)"
            type="button" @click="seleccionarBurbuja(burbuja)">

            <div class="ods__burbuja-contenido">

                <!-- Cantidad de metas cumplidas -->
                <span class="ods__cantidad">
                    {{ burbuja.cumplidas }}
                </span>

                <!-- Nombre del ODS -->
                <span class="ods__texto">
                    {{ burbuja.texto }}
                </span>

                <!-- Imagen -->
                <img v-if="burbuja.imagen" :src="getImagen(burbuja.imagen)" :alt="burbuja.texto" class="ods__icono" />

            </div>

        </button>

    </div>

</template>


<script setup>

import {
    ref,
    reactive,
    onMounted,
    onUnmounted,
    nextTick
} from 'vue'

import {
    forceSimulation,
    forceCollide,
    forceX,
    forceY
} from 'd3-force'


// =============================================
// PROPS
// =============================================

const props = defineProps({

    botones: {
        type: Array,
        default: () => []
    }

})


// =============================================
// EMITS
// =============================================

const emit = defineEmits([
    'seleccionar'
])


// =============================================
// REFERENCIAS
// =============================================

const contenedor = ref(null)

let simulation = null
let resizeObserver = null


// =============================================
// COLORES ODS
// =============================================

const coloresODS = {

    1: '#E5243B',
    2: '#DDA63A',
    3: '#4C9F38',
    4: '#C5192D',
    5: '#FF3A21',
    6: '#26BDE2',
    7: '#FCC30B',
    8: '#A21942',
    9: '#FD6925',
    10: '#DD1367',
    11: '#FD9D24',
    12: '#BF8B2E',
    13: '#3F7E44',
    14: '#0A97D9',
    15: '#56C02B',
    16: '#00689D',
    17: '#19486A'

}


// =============================================
// CREAR BURBUJAS
// =============================================

/*
    IMPORTANTE:

    Aquí eliminamos el ID 18.

    Por lo tanto solamente existirán
    burbujas del ODS 1 al 17.
*/

const burbujas = reactive(

    props.botones

        .filter(
            item => String(item.id) !== '18'
        )

        .map(item => ({

            ...item,

            metas:
                Number(item.metas),

            cumplidas:
                Number(item.cumplidas),

            color:
                coloresODS[Number(item.id)]
                || '#666666',

            x: 0,

            y: 0,

            radio: 0,

            diametro: 0

        }))

)


// =============================================
// CALCULAR TAMAÑO
// =============================================

function calcularTamanos(ancho) {

    if (!burbujas.length) {
        return
    }


    const valores = burbujas.map(
        item => item.cumplidas
    )


    const minimo =
        Math.min(...valores)

    const maximo =
        Math.max(...valores)


    /*
        La escala reduce las burbujas
        en pantallas pequeñas.
    */

    const escalaPantalla = Math.max(
        0.60,
        Math.min(
            1,
            ancho / 900
        )
    )


    const diametroMinimo =
        90 * escalaPantalla

    const diametroMaximo =
        200 * escalaPantalla


    burbujas.forEach(burbuja => {

        let porcentaje = 0


        if (maximo !== minimo) {

            porcentaje =

                (
                    Math.sqrt(
                        burbuja.cumplidas
                    )

                    -

                    Math.sqrt(
                        minimo
                    )
                )

                /

                (
                    Math.sqrt(
                        maximo
                    )

                    -

                    Math.sqrt(
                        minimo
                    )
                )

        }


        burbuja.diametro =

            diametroMinimo

            +

            porcentaje

            *

            (
                diametroMaximo
                -
                diametroMinimo
            )


        burbuja.radio =
            burbuja.diametro / 2

    })

}


// =============================================
// CREAR DISTRIBUCIÓN
// =============================================

function crearDistribucion() {

    if (!contenedor.value) {
        return
    }


    if (!burbujas.length) {
        return
    }


    const ancho =
        contenedor.value.clientWidth

    const alto =
        contenedor.value.clientHeight


    if (!ancho || !alto) {
        return
    }


    calcularTamanos(ancho)


    const centroX =
        ancho / 2

    const centroY =
        alto / 2


    // =========================================
    // POSICIONES INICIALES
    // =========================================

    burbujas.forEach(burbuja => {

        burbuja.fx = null
        burbuja.fy = null


        burbuja.x =

            centroX

            +

            (Math.random() - 0.5)

            *

            ancho

            *

            0.4


        burbuja.y =

            centroY

            +

            (Math.random() - 0.5)

            *

            alto

            *

            0.4

    })


    // =========================================
    // BURBUJA MÁS GRANDE
    // =========================================

    const burbujaPrincipal =

        [...burbujas]

            .sort(
                (a, b) =>
                    b.cumplidas
                    -
                    a.cumplidas
            )[0]


    /*
        La que tenga más metas cumplidas
        permanece en el centro.
    */

    if (burbujaPrincipal) {

        burbujaPrincipal.x =
            centroX

        burbujaPrincipal.y =
            centroY

        burbujaPrincipal.fx =
            centroX

        burbujaPrincipal.fy =
            centroY

    }


    // =========================================
    // DETENER SIMULACIÓN ANTERIOR
    // =========================================

    if (simulation) {
        simulation.stop()
    }


    // =========================================
    // D3 FORCE
    // =========================================

    simulation = forceSimulation(
        burbujas
    )


        // Atracción horizontal

        .force(

            'x',

            forceX(
                centroX
            )
                .strength(0.055)

        )


        // Atracción vertical

        .force(

            'y',

            forceY(
                centroY
            )
                .strength(0.055)

        )


        // Evitar que las burbujas se encimen

        .force(

            'collision',

            forceCollide()

                .radius(
                    burbuja =>
                        burbuja.radio + 7
                )

                .strength(1)

                .iterations(4)

        )


        .alpha(1)

        .alphaDecay(0.025)


        .on(
            'tick',
            () => {

                burbujas.forEach(
                    burbuja => {

                        const margen =
                            burbuja.radio + 4


                        /*
                            Evita que salgan
                            del contenedor.
                        */

                        burbuja.x = Math.max(

                            margen,

                            Math.min(

                                ancho - margen,

                                burbuja.x

                            )

                        )


                        burbuja.y = Math.max(

                            margen,

                            Math.min(

                                alto - margen,

                                burbuja.y

                            )

                        )

                    }
                )

            }
        )

}


// =============================================
// ESTILOS DINÁMICOS
// =============================================

function estiloBurbuja(burbuja) {

    return {

        width:
            `${burbuja.diametro}px`,

        height:
            `${burbuja.diametro}px`,

        backgroundColor:
            burbuja.color,

        transform: `
            translate(
                ${burbuja.x - burbuja.radio}px,
                ${burbuja.y - burbuja.radio}px
            )
        `

    }

}


// =============================================
// IMÁGENES
// =============================================

function getImagen(ruta) {

    if (!ruta) {
        return ''
    }


    return (

        import.meta.env.BASE_URL

        +

        ruta.replace(
            /^\/+/,
            ''
        )

    )

}


// =============================================
// CLICK EN BURBUJA
// =============================================

function seleccionarBurbuja(burbuja) {

    emit(
        'seleccionar',
        {
            id: burbuja.id,
            texto: burbuja.texto,
            metas: burbuja.metas,
            cumplidas: burbuja.cumplidas
        }
    )

}


// =============================================
// MOUNTED
// =============================================

onMounted(async () => {

    await nextTick()

    crearDistribucion()


    resizeObserver =
        new ResizeObserver(() => {

            crearDistribucion()

        })


    if (contenedor.value) {

        resizeObserver.observe(
            contenedor.value
        )

    }

})


// =============================================
// UNMOUNTED
// =============================================

onUnmounted(() => {

    if (simulation) {
        simulation.stop()
    }


    if (resizeObserver) {
        resizeObserver.disconnect()
    }

})

</script>


<style scoped>
/* =============================================
   CONTENEDOR
============================================= */

.ods__contenedor {

    position: relative;

    width: 100%;

    max-width: 1000px;

    height: 650px;

    margin: 0 auto;

    overflow: hidden;

}


/* =============================================
   BURBUJAS
============================================= */

.ods__burbuja {

    position: absolute;

    top: 0;
    left: 0;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 12px;

    border: none;

    border-radius: 50%;

    color: white;

    cursor: pointer;

    will-change: transform;

}


/* =============================================
   HOVER
============================================= */

.ods__burbuja:hover {

    filter: brightness(1.08);

    z-index: 20;

}


/* =============================================
   CONTENIDO
============================================= */

.ods__burbuja-contenido {

    width: 80%;

    height: 80%;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;

}


/* =============================================
   CANTIDAD
============================================= */

.ods__cantidad {

    display: block;

    margin-bottom: 3px;

    font-size: clamp(0.75rem,
            1.2vw,
            1rem);

    font-weight: 800;

}


/* =============================================
   TEXTO
============================================= */

.ods__texto {

    display: block;

    font-size: clamp(0.55rem,
            0.9vw,
            0.8rem);

    font-weight: 700;

    line-height: 1.15;

}


/* =============================================
   ICONO
============================================= */

.ods__icono {

    width: 20%;

    max-width: 28px;

    margin-top: 7px;

    object-fit: contain;

}


/* =============================================
   RESPONSIVE
============================================= */

@media (max-width: 768px) {

    .ods__contenedor {
        height: 550px;
    }

}


@media (max-width: 480px) {

    .ods__contenedor {
        height: 480px;
    }

}
</style>