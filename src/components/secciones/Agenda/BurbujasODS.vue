<template>

    <div ref="contenedor" class="ods__contenedor">

        <button v-for="burbuja in burbujas" :key="burbuja.id" class="ods__burbuja" :style="estiloBurbuja(burbuja)"
            type="button" @click="seleccionarBurbuja(burbuja)">

            <div class="ods__burbuja-contenido">

                <!-- Nombre del ODS -->
                <span v-if="obtenerPorcentajeCumplimiento(burbuja) > 0.49" class="ods__texto">
                    {{ burbuja.texto }}
                </span>

                <!-- Número del ODS -->
                <span v-if="obtenerPorcentajeCumplimiento(burbuja) <= 0.49" class="ods__numero">
                    {{ burbuja.id }}
                </span>

                <!-- Imagen -->
                <img v-if="burbuja.imagen" :src="getImagen(burbuja.imagen)" :alt="burbuja.texto" class="ods__icono"
                    :class="{
                        'ods__icono--solo':
                            obtenerPorcentajeCumplimiento(burbuja) <= 0.49
                    }" />

                <!-- Tooltip solamente para burbujas sin título -->
                <span v-if="obtenerPorcentajeCumplimiento(burbuja) <= 0.49" class="ods__tooltip">
                    {{ burbuja.texto }}
                </span>

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
let intersectionObserver = null
let animacionEjecutada = false


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

function obtenerPorcentajeCumplimiento(burbuja) {
    if (!burbuja.metas || burbuja.metas <= 0) {
        return 0
    }

    return burbuja.cumplidas / burbuja.metas
}

// =============================================
// CALCULAR TAMAÑO
// =============================================

function calcularTamanos(ancho) {
    if (!burbujas.length) {
        return
    }

    /*
        Escala responsive.
        Reduce el tamaño general de las burbujas
        cuando la pantalla es más pequeña.
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
        190 * escalaPantalla

    burbujas.forEach(burbuja => {

        /*
            Porcentaje de cumplimiento.

            Ejemplos:
            8 / 8   = 1.00 = 100%
            7 / 8   = 0.875 = 87.5%
            15 / 19 = 0.789 = 78.9%
        */
        const porcentajeCumplimiento =
            burbuja.metas > 0
                ? burbuja.cumplidas / burbuja.metas
                : 0

        /*
            Limitamos el valor entre 0 y 1
            por seguridad.
        */
        const porcentaje = Math.max(
            0,
            Math.min(
                1,
                porcentajeCumplimiento
            )
        )

        /*
            0%   -> diámetro mínimo
            100% -> diámetro máximo
        */
        burbuja.diametro =
            diametroMinimo +
            porcentaje *
            (
                diametroMaximo -
                diametroMinimo
            )

        burbuja.radio =
            burbuja.diametro / 2
    })
}

function prepararBurbujasEnCentro() {

    if (!contenedor.value || !burbujas.length) {
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

    burbujas.forEach((burbuja, index) => {

        // Pequeña distribución circular inicial
        // para evitar que estén exactamente
        // una encima de otra.
        const angulo =
            (index / burbujas.length) *
            Math.PI *
            2

        const distancia = 15

        burbuja.x =
            centroX +
            Math.cos(angulo) *
            distancia

        burbuja.y =
            centroY +
            Math.sin(angulo) *
            distancia

        burbuja.fx = null
        burbuja.fy = null
    })
}

// =============================================
// CREAR DISTRIBUCIÓN
// =============================================

function crearDistribucion(desdeCentro = false) {

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

    burbujas.forEach((burbuja, index) => {

        burbuja.fx = null
        burbuja.fy = null

        if (desdeCentro) {

            // Todas comienzan muy cerca del centro.
            // El pequeño desplazamiento evita que tengan
            // exactamente las mismas coordenadas.
            const angulo =
                (index / burbujas.length) *
                Math.PI *
                2

            const distanciaInicial =
                10 + Math.random() * 20

            burbuja.x =
                centroX +
                Math.cos(angulo) *
                distanciaInicial

            burbuja.y =
                centroY +
                Math.sin(angulo) *
                distanciaInicial

        } else {

            burbuja.x =
                centroX +
                (Math.random() - 0.5) *
                ancho *
                0.4

            burbuja.y =
                centroY +
                (Math.random() - 0.5) *
                alto *
                0.4
        }

    })


    // =========================================
    // BURBUJA MÁS GRANDE
    // =========================================

    const burbujaPrincipal =
        [...burbujas]
            .sort((a, b) => {

                const porcentajeA =
                    a.metas > 0
                        ? a.cumplidas / a.metas
                        : 0

                const porcentajeB =
                    b.metas > 0
                        ? b.cumplidas / b.metas
                        : 0

                return porcentajeB - porcentajeA
            })[0]


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

        .force(
            'x',
            forceX(
                centroX
            )
                .strength(0.055)
        )

        .force(
            'y',
            forceY(
                centroY
            )
                .strength(0.055)
        )

        .force(
            'collision',
            forceCollide()
                .radius(
                    burbuja =>
                        burbuja.radio + 7
                )
                .strength(.3)
                .iterations(2)
        )

        .alpha(1)
        .alphaDecay(0.021)
        .velocityDecay(0.32)

        .on(
            'tick',
            () => {

                burbujas.forEach(
                    burbuja => {

                        const margen =
                            burbuja.radio + 4

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

    if (!contenedor.value) {
        return
    }

    // Las mostramos desde el principio
    // agrupadas en el centro.
    prepararBurbujasEnCentro()

    // =============================================
    // OBSERVAR ENTRADA AL VIEWPORT
    // =============================================

    intersectionObserver =
        new IntersectionObserver(
            entries => {

                const entry = entries[0]

                if (
                    entry.isIntersecting &&
                    !animacionEjecutada
                ) {

                    animacionEjecutada = true

                    // Las burbujas empiezan juntas
                    // y D3 las distribuye.
                    crearDistribucion(true)

                    // Solo queremos hacer
                    // la animación una vez.
                    intersectionObserver.unobserve(
                        contenedor.value
                    )
                }

            },
            {
                threshold: 0.45
            }
        )

    intersectionObserver.observe(
        contenedor.value
    )


    // =============================================
    // RESPONSIVE
    // =============================================

    let anchoAnterior = 0

    resizeObserver =
        new ResizeObserver(() => {

            if (!animacionEjecutada) {
                return
            }

            const anchoActual =
                contenedor.value?.clientWidth || 0

            // Evita ejecutar por pequeños cambios internos
            if (
                Math.abs(
                    anchoActual - anchoAnterior
                ) < 10
            ) {
                return
            }

            anchoAnterior = anchoActual

            crearDistribucion()

        })

    anchoAnterior =
        contenedor.value.clientWidth

    resizeObserver.observe(
        contenedor.value
    )

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

    if (intersectionObserver) {
        intersectionObserver.disconnect()
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

    overflow: visible;

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
            0.9rem);

    font-weight: 700;

    line-height: 1.15;

}

.ods__numero {
    display: block;
    font-weight: 700;
    line-height: 1;
    text-align: center;
}


/* =============================================
   ICONO
============================================= */

.ods__icono {

    width: 100%;

    max-width: 75px;

    /* margin-top: 7px; */

    object-fit: contain;

}

.ods__icono--solo {
    max-width: 90px;
}

/* =============================================
   TOOLTIP
============================================= */

.ods__tooltip {
    position: absolute;

    left: 50%;
    bottom: calc(100% + 10px);

    transform: translateX(-50%) translateY(5px);

    width: max-content;
    max-width: 180px;

    padding: 7px 10px;

    background-color: #333;
    color: #fff;

    border-radius: 6px;

    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.3;

    text-align: center;

    opacity: 0;
    visibility: hidden;

    pointer-events: none;

    transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        visibility 0.2s ease;

    z-index: 100;
}


/* Flechita */

.ods__tooltip::after {
    content: '';

    position: absolute;

    top: 100%;
    left: 50%;

    transform: translateX(-50%);

    border-width: 6px;
    border-style: solid;

    border-color:
        #333 transparent transparent transparent;
}


/* Mostrar tooltip */

.ods__burbuja:hover .ods__tooltip,
.ods__burbuja:focus-visible .ods__tooltip {
    opacity: 1;
    visibility: visible;

    transform:
        translateX(-50%) translateY(0);
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