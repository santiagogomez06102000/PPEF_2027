<template>
    <section class="ods">
        <h2 class="ods__titulo">
            {{ subtitulo }}
        </h2>

        <div ref="contenedor" class="ods__contenedor">
            <button v-for="burbuja in burbujas" :key="burbuja.id" class="ods__burbuja" :style="estiloBurbuja(burbuja)"
                @click="seleccionarBurbuja(burbuja)">
                <div class="ods__burbuja-contenido">

                    <span class="ods__cantidad">
                        {{ burbuja.cumplidas }}
                    </span>

                    <span class="ods__texto">
                        {{ burbuja.texto }}
                    </span>

                    <img v-if="burbuja.imagen" :src="getImagen(burbuja.imagen)" :alt="burbuja.texto" class="ods__icono">

                </div>
            </button>
        </div>
    </section>
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

const emit = defineEmits([
    'seleccionar'
])

const contenedor = ref(null)

const subtitulo = ref('')

const burbujas = reactive([])

let simulation = null
let resizeObserver = null


// ======================================================
// COLORES DE LOS 17 ODS
// ======================================================

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


// ======================================================
// CARGAR JSON
// ======================================================

const cargarAgenda = async () => {
    try {

        const response = await fetch(
            `${import.meta.env.BASE_URL}ODS/agenda.json`
        )

        if (!response.ok) {
            throw new Error('No fue posible cargar agenda.json')
        }

        const data = await response.json()

        subtitulo.value = data.subtitulo

        const botones = data.botones || []

        botones.forEach(item => {

            burbujas.push({
                ...item,

                metas: Number(item.metas),
                cumplidas: Number(item.cumplidas),

                color:
                    coloresODS[Number(item.id)] ||
                    '#666666',

                x: 0,
                y: 0,

                radio: 0,
                diametro: 0
            })

        })

        await nextTick()

        crearDistribucion()

    } catch (error) {

        console.error(
            'Error cargando agenda:',
            error
        )

    }
}


// ======================================================
// CALCULAR TAMAÑO DE CADA BURBUJA
// ======================================================

const calcularTamanos = (ancho) => {

    if (!burbujas.length) return

    const valores = burbujas.map(
        item => item.cumplidas
    )

    const minimo = Math.min(...valores)
    const maximo = Math.max(...valores)

    /*
     * Escala general según tamaño de pantalla.
     *
     * Escritorio:
     * 70px - 155px
     *
     * Pantallas pequeñas:
     * se reducen proporcionalmente.
     */

    const escalaPantalla = Math.max(
        0.60,
        Math.min(1, ancho / 900)
    )

    const diametroMinimo =
        70 * escalaPantalla

    const diametroMaximo =
        155 * escalaPantalla


    burbujas.forEach(burbuja => {

        let porcentaje = 0

        if (maximo !== minimo) {

            /*
             * sqrt hace que la diferencia visual
             * entre burbujas no sea exagerada.
             */

            porcentaje =
                (
                    Math.sqrt(burbuja.cumplidas) -
                    Math.sqrt(minimo)
                )
                /
                (
                    Math.sqrt(maximo) -
                    Math.sqrt(minimo)
                )

        }

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


// ======================================================
// CREAR DISTRIBUCIÓN
// ======================================================

const crearDistribucion = () => {

    if (!contenedor.value) return
    if (!burbujas.length) return

    const ancho =
        contenedor.value.clientWidth

    const alto =
        contenedor.value.clientHeight

    if (!ancho || !alto) return


    // --------------------------------------------
    // 1. Calculamos tamaños
    // --------------------------------------------

    calcularTamanos(ancho)


    const centroX = ancho / 2
    const centroY = alto / 2


    // --------------------------------------------
    // 2. Liberamos posiciones anteriores
    // --------------------------------------------

    burbujas.forEach(burbuja => {

        burbuja.fx = null
        burbuja.fy = null

        /*
         * Empezamos cerca del centro,
         * pero con una pequeña variación.
         */

        burbuja.x =
            centroX +
            (Math.random() - 0.5) * ancho * 0.4

        burbuja.y =
            centroY +
            (Math.random() - 0.5) * alto * 0.4
    })


    // --------------------------------------------
    // 3. Encontramos la burbuja más grande
    // --------------------------------------------

    const burbujaPrincipal =
        [...burbujas]
            .sort(
                (a, b) =>
                    b.cumplidas - a.cumplidas
            )[0]


    /*
     * La burbuja con más metas cumplidas
     * permanece en el centro.
     */

    if (burbujaPrincipal) {

        burbujaPrincipal.x = centroX
        burbujaPrincipal.y = centroY

        burbujaPrincipal.fx = centroX
        burbujaPrincipal.fy = centroY
    }


    // --------------------------------------------
    // 4. Detenemos simulación anterior
    // --------------------------------------------

    if (simulation) {
        simulation.stop()
    }


    // --------------------------------------------
    // 5. Simulación
    // --------------------------------------------

    simulation = forceSimulation(burbujas)

        /*
         * Todas las burbujas intentan acercarse
         * horizontalmente al centro.
         */

        .force(
            'x',
            forceX(centroX)
                .strength(0.055)
        )

        /*
         * Todas intentan acercarse
         * verticalmente al centro.
         */

        .force(
            'y',
            forceY(centroY)
                .strength(0.055)
        )

        /*
         * Evita que las burbujas se encimen.
         */

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

        .on('tick', () => {

            /*
             * Evitamos que las burbujas
             * salgan del contenedor.
             */

            burbujas.forEach(burbuja => {

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

            })

        })
}


// ======================================================
// ESTILO DE BURBUJA
// ======================================================

const estiloBurbuja = (burbuja) => {

    return {

        width:
            `${burbuja.diametro}px`,

        height:
            `${burbuja.diametro}px`,

        backgroundColor:
            burbuja.color,

        transform:
            `
        translate(
          ${burbuja.x - burbuja.radio}px,
          ${burbuja.y - burbuja.radio}px
        )
      `
    }
}


// ======================================================
// IMÁGENES
// ======================================================

const getImagen = (ruta) => {

    if (!ruta) return ''

    return (
        import.meta.env.BASE_URL +
        ruta.replace(/^\/+/, '')
    )
}


// ======================================================
// CLICK
// ======================================================

const seleccionarBurbuja = (burbuja) => {

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


// ======================================================
// CICLO DE VIDA
// ======================================================

onMounted(async () => {

    await cargarAgenda()

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
.ods {
    width: 100%;
}


/* ==========================================
   TÍTULO
========================================== */

.ods__titulo {
    max-width: 900px;
    margin: 0 auto 2rem;
    text-align: center;
    font-size: 1.5rem;
    line-height: 1.4;
}


/* ==========================================
   CONTENEDOR
========================================== */

.ods__contenedor {
    position: relative;

    width: 100%;
    max-width: 1000px;

    height: 650px;

    margin: 0 auto;

    overflow: hidden;
}


/* ==========================================
   BURBUJA
========================================== */

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

    color: #ffffff;

    cursor: pointer;

    transition:
        transform 0.08s linear,
        filter 0.25s ease;

    will-change: transform;
}


.ods__burbuja:hover {
    filter: brightness(1.08);
    z-index: 10;
}


/* ==========================================
   CONTENIDO
========================================== */

.ods__burbuja-contenido {
    width: 80%;
    height: 80%;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    text-align: center;
}


/* ==========================================
   CANTIDAD
========================================== */

.ods__cantidad {
    display: block;

    margin-bottom: 3px;

    font-size: clamp(0.75rem,
            1.2vw,
            1rem);

    font-weight: 800;
}


/* ==========================================
   TEXTO
========================================== */

.ods__texto {
    display: block;

    font-size: clamp(0.55rem,
            0.9vw,
            0.8rem);

    font-weight: 700;

    line-height: 1.15;
}


/* ==========================================
   ICONO
========================================== */

.ods__icono {
    width: 20%;
    max-width: 28px;

    margin-top: 7px;

    object-fit: contain;
}


/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 768px) {

    .ods__contenedor {
        height: 550px;
    }

    .ods__titulo {
        font-size: 1.2rem;
    }

}


@media (max-width: 480px) {

    .ods__contenedor {
        height: 480px;
    }

}
</style>