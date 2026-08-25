<script setup>
import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    nextTick,
    watch
} from 'vue'

// Ajusta únicamente esta ruta a tu utils.ts actual.
// El archivo utils puede continuar siendo TypeScript.
import { fetchPublicText } from '@/components/utils/utils'

/* =========================================================
   PROPS
========================================================= */

const props = defineProps({
    datos: {
        type: Array,
        default: () => []
    },

    seleccionadoId: {
        type: [Number, String],
        default: null
    }
})

/* =========================================================
   EMITS
========================================================= */

const emit = defineEmits([
    'seleccionar'
])

/* =========================================================
   CONSTANTES
========================================================= */

/*
 * Chihuahua y otros estados grandes terminarán cerca de 1.05.
 * Estados muy pequeños terminarán cerca de 1.35.
 */
const ESCALA_MINIMA = 1.05
const ESCALA_MAXIMA = 1.35

const COLOR_MINIMO = {
    r: 120,
    g: 226,
    b: 240
}

const COLOR_MAXIMO = {
    r: 6,
    g: 101,
    b: 122
}

const COLOR_SIN_DATOS = 'rgb(215, 220, 224)'

/*
 * Si Colima contiene las islas como elementos SVG separados,
 * se conservará únicamente la geometría principal.
 */
const REMOVER_ISLAS_COLIMA = true

/* =========================================================
   CONFIGURACIÓN CENTRALIZADA DE ENTIDADES
========================================================= */

const CONFIG_ENTIDADES = [
    {
        id: 1,
        codigo: 'MXAGU',
        nombre: 'Aguascalientes',
        archivo: '/mapa/estados/01_MXAGU_aguascalientes.svg'
    },
    {
        id: 2,
        codigo: 'MXBCN',
        nombre: 'Baja California',
        archivo: '/mapa/estados/02_MXBCN_baja_california.svg'
    },
    {
        id: 3,
        codigo: 'MXBCS',
        nombre: 'Baja California Sur',
        archivo: '/mapa/estados/03_MXBCS_baja_california_sur.svg'
    },
    {
        id: 4,
        codigo: 'MXCAM',
        nombre: 'Campeche',
        archivo: '/mapa/estados/04_MXCAM_campeche.svg'
    },
    {
        id: 5,
        codigo: 'MXCOA',
        nombre: 'Coahuila',
        archivo: '/mapa/estados/05_MXCOA_coahuila_de_zaragoza.svg'
    },
    {
        id: 6,
        codigo: 'MXCOL',
        nombre: 'Colima',
        archivo: '/mapa/estados/06_MXCOL_colima.svg'
    },
    {
        id: 7,
        codigo: 'MXCHP',
        nombre: 'Chiapas',
        archivo: '/mapa/estados/07_MXCHP_chiapas.svg'
    },
    {
        id: 8,
        codigo: 'MXCHH',
        nombre: 'Chihuahua',
        archivo: '/mapa/estados/08_MXCHH_chihuahua.svg'
    },
    {
        id: 9,
        codigo: 'MXCMX',
        nombre: 'Ciudad de México',
        archivo: '/mapa/estados/09_MXCMX_ciudad_de_mexico.svg'
    },
    {
        id: 10,
        codigo: 'MXDUR',
        nombre: 'Durango',
        archivo: '/mapa/estados/10_MXDUR_durango.svg'
    },
    {
        id: 11,
        codigo: 'MXGUA',
        nombre: 'Guanajuato',
        archivo: '/mapa/estados/11_MXGUA_guanajuato.svg'
    },
    {
        id: 12,
        codigo: 'MXGRO',
        nombre: 'Guerrero',
        archivo: '/mapa/estados/12_MXGRO_guerrero.svg'
    },
    {
        id: 13,
        codigo: 'MXHID',
        nombre: 'Hidalgo',
        archivo: '/mapa/estados/13_MXHID_hidalgo.svg'
    },
    {
        id: 14,
        codigo: 'MXJAL',
        nombre: 'Jalisco',
        archivo: '/mapa/estados/14_MXJAL_jalisco.svg'
    },
    {
        id: 15,
        codigo: 'MXMEX',
        nombre: 'Estado de México',
        archivo: '/mapa/estados/15_MXMEX_mexico.svg'
    },
    {
        id: 16,
        codigo: 'MXMIC',
        nombre: 'Michoacán',
        archivo: '/mapa/estados/16_MXMIC_michoacan_de_ocampo.svg'
    },
    {
        id: 17,
        codigo: 'MXMOR',
        nombre: 'Morelos',
        archivo: '/mapa/estados/17_MXMOR_morelos.svg'
    },
    {
        id: 18,
        codigo: 'MXNAY',
        nombre: 'Nayarit',
        archivo: '/mapa/estados/18_MXNAY_nayarit.svg'
    },
    {
        id: 19,
        codigo: 'MXNLE',
        nombre: 'Nuevo León',
        archivo: '/mapa/estados/19_MXNLE_nuevo_leon.svg'
    },
    {
        id: 20,
        codigo: 'MXOAX',
        nombre: 'Oaxaca',
        archivo: '/mapa/estados/20_MXOAX_oaxaca.svg'
    },
    {
        id: 21,
        codigo: 'MXPUE',
        nombre: 'Puebla',
        archivo: '/mapa/estados/21_MXPUE_puebla.svg'
    },
    {
        id: 22,
        codigo: 'MXQUE',
        nombre: 'Querétaro',
        archivo: '/mapa/estados/22_MXQUE_queretaro.svg'
    },
    {
        id: 23,
        codigo: 'MXROO',
        nombre: 'Quintana Roo',
        archivo: '/mapa/estados/23_MXROO_quintana_roo.svg'
    },
    {
        id: 24,
        codigo: 'MXSLP',
        nombre: 'San Luis Potosí',
        archivo: '/mapa/estados/24_MXSLP_san_luis_potosi.svg'
    },
    {
        id: 25,
        codigo: 'MXSIN',
        nombre: 'Sinaloa',
        archivo: '/mapa/estados/25_MXSIN_sinaloa.svg'
    },
    {
        id: 26,
        codigo: 'MXSON',
        nombre: 'Sonora',
        archivo: '/mapa/estados/26_MXSON_sonora.svg'
    },
    {
        id: 27,
        codigo: 'MXTAB',
        nombre: 'Tabasco',
        archivo: '/mapa/estados/27_MXTAB_tabasco.svg'
    },
    {
        id: 28,
        codigo: 'MXTAM',
        nombre: 'Tamaulipas',
        archivo: '/mapa/estados/28_MXTAM_tamaulipas.svg'
    },
    {
        id: 29,
        codigo: 'MXTLA',
        nombre: 'Tlaxcala',
        archivo: '/mapa/estados/29_MXTLA_tlaxcala.svg'
    },
    {
        id: 30,
        codigo: 'MXVER',
        nombre: 'Veracruz',
        archivo: '/mapa/estados/30_MXVER_veracruz_de_ignacio_de_la_llave.svg'
    },
    {
        id: 31,
        codigo: 'MXYUC',
        nombre: 'Yucatán',
        archivo: '/mapa/estados/31_MXYUC_yucatan.svg'
    },
    {
        id: 32,
        codigo: 'MXZAC',
        nombre: 'Zacatecas',
        archivo: '/mapa/estados/32_MXZAC_zacatecas.svg'
    }
]

/* =========================================================
   PROYECCIONES DE ESTADOS PEQUEÑOS
========================================================= */

/*
 * x / y son porcentajes dentro del contenedor responsive.
 *
 * Pacífico:
 * - Aguascalientes
 * - Colima
 *
 * Golfo:
 * - Ciudad de México
 * - Morelos
 * - Tlaxcala
 *
 * Si después quieres mover alguno, solamente modificas
 * x / y aquí.
 */
const CONFIG_PROYECCIONES = [
    {
        id: 1,
        nombre: 'Aguascalientes',
        zona: 'pacifico',
        x: 2,
        y: 27
    },
    {
        id: 6,
        nombre: 'Colima',
        zona: 'pacifico',
        x: 2,
        y: 61
    },
    {
        id: 9,
        nombre: 'Ciudad de México',
        zona: 'golfo',
        x: 62,
        y: 24
    },
    {
        id: 17,
        nombre: 'Morelos',
        zona: 'golfo',
        x: 79,
        y: 39
    },
    {
        id: 29,
        nombre: 'Tlaxcala',
        zona: 'golfo',
        x: 79,
        y: 75
    }
]

/* =========================================================
   ESTADO
========================================================= */

const mapaRef = ref(null)

const estados = ref([])

const cargando = ref(true)
const errorCarga = ref(false)

const hoverId = ref(null)

/*
 * Contenedor exterior.
 *
 * Lo usamos para:
 * - tooltip
 * - líneas de proyección
 * - posiciones responsive
 */
const mapaWrapperRef = ref(null)

/*
 * Tooltip
 */
const tooltip = ref({
    visible: false,
    nombre: '',
    x: 0,
    y: 0
})

/*
 * Responsive
 */
const esResponsive = ref(false)

/*
 * SVG ampliado de los estados pequeños.
 */
const svgsProyeccion = ref({})

/*
 * Líneas que conectan:
 *
 * estado real ─────────► proyección
 */
const lineasProyeccion = ref([])

/*
 * Referencias DOM de las proyecciones.
 */
const refsProyeccion = new Map()

const haySeleccion = computed(() => {
    return (
        props.seleccionadoId !== null &&
        props.seleccionadoId !== undefined
    )
})

const viewBoxBase = ref({
    x: 0,
    y: 0,
    width: 1000,
    height: 630
})

/* =========================================================
   ESTADO NO SELECCIONADO
========================================================= */

function mezclarConBlanco(color, intensidad = 0.55) {
    const valores = color.match(/\d+/g)

    if (!valores || valores.length < 3) {
        return color
    }

    const [r, g, b] = valores.map(Number)

    const mezclarCanal = (canal) => {
        return Math.round(
            canal +
            (255 - canal) * intensidad
        )
    }

    return `rgb(
    ${mezclarCanal(r)},
    ${mezclarCanal(g)},
    ${mezclarCanal(b)}
  )`
}

function colorEstadoAtenuado(id) {
    return mezclarConBlanco(
        colorEstado(id),
        0.58
    )
}

/* =========================================================
   TOTAL POR ENTIDAD
========================================================= */

function obtenerRegistro(id) {
    return props.datos.find(
        (item) =>
            Number(item.id_entidad_federativa) === Number(id)
    )
}

function obtenerTotal(id) {
    const registro = obtenerRegistro(id)

    if (
        !registro ||
        registro.total === null ||
        registro.total === undefined
    ) {
        return null
    }

    const valor = Number(registro.total)

    if (Number.isNaN(valor)) {
        return null
    }

    return valor
}

/* =========================================================
   MÍNIMO Y MÁXIMO
========================================================= */

const rangoTotales = computed(() => {
    const valores = props.datos
        .map((item) => item.total)
        .filter(
            (valor) =>
                valor !== null &&
                valor !== undefined &&
                !Number.isNaN(Number(valor))
        )
        .map(Number)

    if (!valores.length) {
        return {
            minimo: null,
            maximo: null
        }
    }

    return {
        minimo: Math.min(...valores),
        maximo: Math.max(...valores)
    }
})

/* =========================================================
   COLOR COROPLÉTICO
========================================================= */

function interpolar(inicio, fin, t) {
    return Math.round(
        inicio + (fin - inicio) * t
    )
}

function colorEstado(id) {
    const valor = obtenerTotal(id)

    if (valor === null) {
        return COLOR_SIN_DATOS
    }

    const {
        minimo,
        maximo
    } = rangoTotales.value

    if (minimo === null || maximo === null) {
        return COLOR_SIN_DATOS
    }

    /*
     * Si todos los estados tienen exactamente el mismo valor,
     * utilizamos el centro de la escala.
     */
    const t =
        maximo === minimo
            ? 0.5
            : (valor - minimo) / (maximo - minimo)

    const r = interpolar(
        COLOR_MINIMO.r,
        COLOR_MAXIMO.r,
        t
    )

    const g = interpolar(
        COLOR_MINIMO.g,
        COLOR_MAXIMO.g,
        t
    )

    const b = interpolar(
        COLOR_MINIMO.b,
        COLOR_MAXIMO.b,
        t
    )

    return `rgb(${r}, ${g}, ${b})`
}

/* =========================================================
   PARSEAR VIEWBOX
========================================================= */

function parsearViewBox(valor) {
    if (!valor) {
        return null
    }

    const partes = valor
        .trim()
        .split(/[\s,]+/)
        .map(Number)

    if (
        partes.length !== 4 ||
        partes.some(Number.isNaN)
    ) {
        return null
    }

    return {
        x: partes[0],
        y: partes[1],
        width: partes[2],
        height: partes[3]
    }
}

/* =========================================================
   CALCULAR VIEWBOX GLOBAL DE MÉXICO
========================================================= */

/*
 * Cada SVG viene recortado a su propio estado, por ejemplo:
 *
 * Aguascalientes:
 * viewBox="463.77 379.47 31.64 30.92"
 *
 * Pero las coordenadas del path siguen perteneciendo al
 * sistema global original.
 *
 * Por eso podemos obtener automáticamente los límites
 * completos de México uniendo los 32 viewBox.
 */
function calcularViewBoxGlobal(estados) {
    const viewBoxes = estados
        .map((estado) => estado.viewBox)
        .filter(Boolean)

    if (!viewBoxes.length) {
        return {
            x: 0,
            y: 0,
            width: 1000,
            height: 630
        }
    }

    const minX = Math.min(
        ...viewBoxes.map((viewBox) => viewBox.x)
    )

    const minY = Math.min(
        ...viewBoxes.map((viewBox) => viewBox.y)
    )

    const maxX = Math.max(
        ...viewBoxes.map(
            (viewBox) => viewBox.x + viewBox.width
        )
    )

    const maxY = Math.max(
        ...viewBoxes.map(
            (viewBox) => viewBox.y + viewBox.height
        )
    )

    /*
     * Pequeño margen alrededor de México.
     */
    const width = maxX - minX
    const height = maxY - minY

    const paddingX = width * 0.02
    const paddingY = height * 0.02

    return {
        x: minX - paddingX,
        y: minY - paddingY,
        width: width + paddingX * 2,
        height: height + paddingY * 2
    }
}


/* =========================================================
   ASIGNAR VIEWBOX GLOBAL
========================================================= */

function aplicarViewBoxGlobal(textoSvg, viewBoxGlobal) {
    if (!textoSvg) {
        return null
    }

    const parser = new DOMParser()

    const documento = parser.parseFromString(
        textoSvg,
        'image/svg+xml'
    )

    const svg = documento.documentElement

    if (
        !svg ||
        svg.tagName.toLowerCase() !== 'svg'
    ) {
        return null
    }

    const {
        x,
        y,
        width,
        height
    } = viewBoxGlobal

    /*
     * MUY IMPORTANTE:
     *
     * Cambiamos solamente el viewBox.
     *
     * NO modificamos:
     * - path d
     * - transformaciones originales
     * - coordenadas
     */
    svg.setAttribute(
        'viewBox',
        `${x} ${y} ${width} ${height}`
    )

    svg.setAttribute(
        'preserveAspectRatio',
        'xMidYMid meet'
    )

    svg.removeAttribute('width')
    svg.removeAttribute('height')

    const serializer = new XMLSerializer()

    return serializer.serializeToString(svg)
}

/* =========================================================
   PREPARAR SVG
========================================================= */

/*
 * Cada SVG se transforma a esta estructura:
 *
 * <svg class="estado-svg-root">
 *
 *   <defs>...</defs>
 *
 *   <g class="estado-shape">
 *       geometría del estado
 *   </g>
 *
 * </svg>
 *
 * Esto es importante porque el hover debe escalar
 * LA SILUETA, no el SVG completo de 1000x630.
 */
function prepararSvg(textoSvg) {
    const parser = new DOMParser()

    const documento = parser.parseFromString(
        textoSvg,
        'image/svg+xml'
    )

    const parserError =
        documento.querySelector('parsererror')

    if (parserError) {
        console.warn('SVG inválido', parserError)
        return null
    }

    const svg = documento.documentElement

    if (
        !svg ||
        svg.tagName.toLowerCase() !== 'svg'
    ) {
        return null
    }

    /*
     * Seguridad básica.
     *
     * Los SVG vienen de /public y son archivos propios,
     * pero evitamos scripts/eventos incrustados.
     */
    documento
        .querySelectorAll('script, foreignObject')
        .forEach((elemento) => elemento.remove())

    documento
        .querySelectorAll('*')
        .forEach((elemento) => {
            Array.from(elemento.attributes).forEach(
                (atributo) => {
                    if (/^on/i.test(atributo.name)) {
                        elemento.removeAttribute(
                            atributo.name
                        )
                    }
                }
            )
        })

    const viewBox =
        parsearViewBox(svg.getAttribute('viewBox'))

    svg.removeAttribute('width')
    svg.removeAttribute('height')

    svg.setAttribute(
        'preserveAspectRatio',
        'xMidYMid meet'
    )

    svg.classList.add('estado-svg-root')

    /*
     * Creamos un grupo externo que no tiene transformaciones
     * originales. De esta manera podemos escalarlo en hover
     * sin destruir transforms existentes dentro del SVG.
     */
    const namespace =
        'http://www.w3.org/2000/svg'

    const grupo =
        documento.createElementNS(
            namespace,
            'g'
        )

    grupo.classList.add('estado-shape')

    /*
     * Elementos considerados parte visible del estado.
     *
     * defs, style, metadata, etc. permanecen fuera.
     */
    const elementosGraficos = new Set([
        'g',
        'path',
        'polygon',
        'polyline',
        'rect',
        'circle',
        'ellipse',
        'line',
        'use',
        'switch'
    ])

    const hijosOriginales =
        Array.from(svg.children)

    hijosOriginales.forEach((elemento) => {
        const tag =
            elemento.tagName.toLowerCase()

        if (elementosGraficos.has(tag)) {
            grupo.appendChild(elemento)
        }
    })

    svg.appendChild(grupo)

    const serializer = new XMLSerializer()

    return {
        svg: serializer.serializeToString(svg),
        viewBox
    }
}

/* =========================================================
   CARGAR LOS 32 SVG
========================================================= */

async function cargarEstados() {
    cargando.value = true
    errorCarga.value = false

    /*
     * PASO 1
     *
     * Cargamos los 32 SVG una sola vez.
     */
    const resultados = await Promise.all(
        CONFIG_ENTIDADES.map(async (estado) => {
            const contenido =
                await fetchPublicText(estado.archivo)

            if (!contenido) {
                console.warn(
                    `No fue posible cargar ${estado.nombre}: ${estado.archivo}`
                )

                return {
                    ...estado,
                    svg: null,
                    viewBox: null,
                    bbox: null,
                    medida: null,
                    escalaHover: ESCALA_MINIMA
                }
            }

            /*
             * prepararSvg conserva todavía el viewBox
             * original recortado del estado.
             */
            const preparado =
                prepararSvg(contenido)

            if (!preparado) {
                console.warn(
                    `No fue posible procesar ${estado.nombre}`
                )

                return {
                    ...estado,
                    svg: null,
                    viewBox: null,
                    bbox: null,
                    medida: null,
                    escalaHover: ESCALA_MINIMA
                }
            }

            return {
                ...estado,

                /*
                 * SVG todavía con viewBox individual.
                 */
                svg: preparado.svg,

                /*
                 * Guardamos el viewBox original porque sus
                 * coordenadas nos indican dónde se encontraba
                 * el estado dentro de México.
                 */
                viewBox: preparado.viewBox,

                bbox: null,
                medida: null,

                escalaHover: ESCALA_MINIMA
            }
        })
    )

    const validos = resultados.filter(
        (estado) =>
            estado.svg &&
            estado.viewBox
    )

    if (!validos.length) {
        errorCarga.value = true
        cargando.value = false
        return
    }

    /*
     * PASO 2
     *
     * Calculamos el viewBox completo de México usando
     * los límites de los 32 estados.
     */
    const viewBoxGlobal =
        calcularViewBoxGlobal(validos)

    viewBoxBase.value = viewBoxGlobal

    console.log(
        '[MapaMexico] ViewBox global:',
        viewBoxGlobal
    )

    /*
     * PASO 3
     *
     * Todos los SVG reciben exactamente el mismo viewBox.
     *
     * Las coordenadas de sus paths NO cambian.
     */
    estados.value = resultados.map((estado) => {
        if (!estado.svg) {
            return estado
        }

        return {
            ...estado,

            svg: aplicarViewBoxGlobal(
                estado.svg,
                viewBoxGlobal
            )
        }
    })

    cargando.value = false

    /*
     * Esperamos que Vue inserte los 32 SVG en el DOM.
     */
    await nextTick()

    /*
     * Después podemos usar getBBox().
     */
    limpiarColima()

    await nextTick()

    medirEstados()
}

/* =========================================================
   VIEWBOX GLOBAL
========================================================= */





/* =========================================================
   COLIMA
========================================================= */

/*
 * Si el archivo de Colima contiene:
 *
 * path = territorio continental
 * path = isla 1
 * path = isla 2
 *
 * conservamos solamente la geometría de mayor tamaño.
 *
 * Si el SVG que recibes ya viene sin islas,
 * esta función no afecta nada.
 */
function limpiarColima() {
    if (!REMOVER_ISLAS_COLIMA) {
        return
    }

    const capa = mapaRef.value?.querySelector(
        '[data-estado-id="6"]'
    )

    const shape =
        capa?.querySelector('.estado-shape')

    if (!shape) {
        return
    }

    const elementos = Array.from(
        shape.querySelectorAll(
            'path, polygon, polyline'
        )
    )

    if (elementos.length <= 1) {
        return
    }

    const geometrias = elementos
        .map((elemento) => {
            try {
                const bbox = elemento.getBBox()

                return {
                    elemento,
                    bbox,
                    area:
                        bbox.width *
                        bbox.height
                }
            } catch {
                return null
            }
        })
        .filter(Boolean)
        .filter((item) => item.area > 0)

    if (geometrias.length <= 1) {
        return
    }

    geometrias.sort(
        (a, b) => b.area - a.area
    )

    const principal = geometrias[0]

    /*
     * Las geometrías extremadamente pequeñas frente
     * al territorio principal se consideran islas.
     */
    geometrias
        .slice(1)
        .forEach((item) => {
            if (
                item.area <
                principal.area * 0.12
            ) {
                item.elemento.style.display =
                    'none'
            }
        })
}

/* =========================================================
   MEDIR LOS 32 ESTADOS
========================================================= */

function medirEstados() {
    if (!mapaRef.value) {
        return
    }

    const medidasValidas = []

    estados.value.forEach((estado) => {
        if (!estado.svg) {
            return
        }

        const capa =
            mapaRef.value.querySelector(
                `[data-estado-id="${estado.id}"]`
            )

        const shape =
            capa?.querySelector('.estado-shape')

        if (!shape) {
            return
        }

        try {
            const bbox = shape.getBBox()

            if (
                bbox.width <= 0 ||
                bbox.height <= 0
            ) {
                return
            }

            /*
             * sqrt(area) convierte el área a una medida
             * lineal comparable.
             *
             * Funciona mejor que utilizar solamente width,
             * ya que Veracruz, por ejemplo, es muy largo
             * pero relativamente estrecho.
             */
            const medida =
                Math.sqrt(
                    bbox.width * bbox.height
                )

            estado.bbox = {
                x: bbox.x,
                y: bbox.y,
                width: bbox.width,
                height: bbox.height
            }

            estado.medida = medida

            medidasValidas.push(medida)
        } catch (error) {
            console.warn(
                `No fue posible medir ${estado.nombre}`,
                error
            )
        }
    })

    if (!medidasValidas.length) {
        return
    }

    const medidaMinima =
        Math.min(...medidasValidas)

    const medidaMaxima =
        Math.max(...medidasValidas)

    estados.value.forEach((estado) => {
        if (estado.medida === null) {
            return
        }

        /*
         * Estado más pequeño:
         * normalizado = 0
         * escala = 1.35
         *
         * Estado más grande:
         * normalizado = 1
         * escala = 1.05
         */
        const normalizado =
            medidaMaxima === medidaMinima
                ? 0.5
                : (
                    estado.medida -
                    medidaMinima
                ) /
                (
                    medidaMaxima -
                    medidaMinima
                )

        const escala =
            ESCALA_MAXIMA -
            normalizado *
            (
                ESCALA_MAXIMA -
                ESCALA_MINIMA
            )

        estado.escalaHover =
            limitar(
                escala,
                ESCALA_MINIMA,
                ESCALA_MAXIMA
            )
    })
}

function limitar(valor, minimo, maximo) {
    return Math.min(
        Math.max(valor, minimo),
        maximo
    )
}

/* =========================================================
   TOOLTIP
========================================================= */

function entrarEstado(estado, event) {
    hoverId.value = estado.id

    tooltip.value.visible = true
    tooltip.value.nombre = estado.nombre

    moverTooltip(event)
}

function moverTooltip(event) {
    if (!mapaWrapperRef.value) {
        return
    }

    const rect =
        mapaWrapperRef.value.getBoundingClientRect()

    let x =
        event.clientX -
        rect.left

    let y =
        event.clientY -
        rect.top

    /*
     * Evitamos que el tooltip se salga
     * horizontalmente del mapa.
     */
    x = Math.max(
        50,
        Math.min(
            x,
            rect.width - 50
        )
    )

    tooltip.value.x = x
    tooltip.value.y = y
}

function salirEstado(estado) {
    if (hoverId.value === estado.id) {
        hoverId.value = null
    }

    tooltip.value.visible = false
}

function seleccionarEstado(estado) {
    emit('seleccionar', {
        id: estado.id,
        codigo: estado.codigo,
        nombre: estado.nombre
    })
}

/* =========================================================
   PREVIEW
========================================================= */

/*
 * Esta función es utilizada por ViewMapa.vue.
 *
 * NO hace fetch.
 *
 * Clona el SVG que ya está renderizado,
 * obtiene el getBBox() real del estado y cambia el
 * viewBox para mostrar solamente la silueta.
 */
function getSvgPreview(id) {
    if (!mapaRef.value) {
        return ''
    }

    const capa =
        mapaRef.value.querySelector(
            `[data-estado-id="${id}"]`
        )

    const svg =
        capa?.querySelector(
            '.estado-svg-root'
        )

    const shape =
        capa?.querySelector(
            '.estado-shape'
        )

    if (!svg || !shape) {
        return ''
    }

    let bbox

    try {
        bbox = shape.getBBox()
    } catch {
        return ''
    }

    if (
        bbox.width <= 0 ||
        bbox.height <= 0
    ) {
        return ''
    }

    const clone =
        svg.cloneNode(true)

    /*
     * Margen alrededor de la silueta.
     */
    const dimensionMayor =
        Math.max(
            bbox.width,
            bbox.height
        )

    const padding =
        dimensionMayor * 0.08

    const x =
        bbox.x - padding

    const y =
        bbox.y - padding

    const width =
        bbox.width +
        padding * 2

    const height =
        bbox.height +
        padding * 2

    clone.setAttribute(
        'viewBox',
        `${x} ${y} ${width} ${height}`
    )

    clone.setAttribute(
        'preserveAspectRatio',
        'xMidYMid meet'
    )

    clone.setAttribute(
        'width',
        '100%'
    )

    clone.setAttribute(
        'height',
        '100%'
    )

    /*
     * Eliminamos cualquier transformación de hover.
     */
    const cloneShape =
        clone.querySelector(
            '.estado-shape'
        )

    if (cloneShape) {
        cloneShape.style.transform = 'none'
        cloneShape.style.filter = 'none'
    }

    /*
     * El SVG del preview ya no depende del CSS
     * de MapaMexico.vue.
     *
     * Le asignamos el color como estilo inline.
     */
    const color =
        colorEstado(id)

    clone
        .querySelectorAll(
            'path, polygon, polyline, rect, circle, ellipse'
        )
        .forEach((elemento) => {
            /*
             * Respetamos los elementos ocultados,
             * por ejemplo las islas de Colima.
             */
            if (
                elemento.style.display ===
                'none'
            ) {
                return
            }

            elemento.style.setProperty(
                'fill',
                color,
                'important'
            )

            elemento.style.setProperty(
                'stroke',
                '#ffffff',
                'important'
            )

            elemento.style.setProperty(
                'stroke-width',
                '1.5',
                'important'
            )

            elemento.style.setProperty(
                'vector-effect',
                'non-scaling-stroke',
                'important'
            )
        })

    const serializer =
        new XMLSerializer()

    return serializer.serializeToString(
        clone
    )
}

/*
 * Exponemos únicamente lo que necesita
 * ViewMapa.vue.
 */
defineExpose({
    getSvgPreview
})

/* =========================================================
   ASPECT RATIO DEL MAPA
========================================================= */

const estiloMapa = computed(() => {
    const {
        width,
        height
    } = viewBoxBase.value

    return {
        aspectRatio: `${width} / ${height}`
    }
})

/* =========================================================
   PROYECCIONES RESPONSIVE
========================================================= */

function registrarRefProyeccion(id, elemento) {
    if (elemento) {
        refsProyeccion.set(
            Number(id),
            elemento
        )
    } else {
        refsProyeccion.delete(
            Number(id)
        )
    }
}

function actualizarSvgsProyeccion() {
    const nuevos = {}

    CONFIG_PROYECCIONES.forEach(
        (proyeccion) => {

            nuevos[proyeccion.id] =
                getSvgPreview(
                    proyeccion.id
                )
        }
    )

    svgsProyeccion.value =
        nuevos
}

function seleccionarProyeccion(proyeccion) {
    const estado =
        estados.value.find(
            (item) =>
                item.id ===
                proyeccion.id
        )

    if (!estado) {
        return
    }

    seleccionarEstado(estado)
}

/* =========================================================
   LÍNEAS DE PROYECCIÓN
========================================================= */

function actualizarLineasProyeccion() {
    if (
        !esResponsive.value ||
        !mapaWrapperRef.value ||
        !mapaRef.value
    ) {
        lineasProyeccion.value = []
        return
    }

    const wrapperRect =
        mapaWrapperRef.value
            .getBoundingClientRect()

    const nuevasLineas = []

    CONFIG_PROYECCIONES.forEach(
        (proyeccion) => {

            /*
             * Estado real dentro del mapa.
             */
            const capa =
                mapaRef.value.querySelector(
                    `[data-estado-id="${proyeccion.id}"]`
                )

            const shape =
                capa?.querySelector(
                    '.estado-shape'
                )

            /*
             * Representación ampliada.
             */
            const destino =
                refsProyeccion.get(
                    proyeccion.id
                )

            if (
                !shape ||
                !destino
            ) {
                return
            }

            const origenRect =
                shape.getBoundingClientRect()

            const destinoRect =
                destino.getBoundingClientRect()

            /*
             * Centro del estado real.
             */
            const x1 =
                origenRect.left -
                wrapperRect.left +
                origenRect.width / 2

            const y1 =
                origenRect.top -
                wrapperRect.top +
                origenRect.height / 2

            /*
             * Centro de la proyección.
             */
            const x2 =
                destinoRect.left -
                wrapperRect.left +
                destinoRect.width / 2

            const y2 =
                destinoRect.top -
                wrapperRect.top +
                destinoRect.height / 2

            nuevasLineas.push({
                id: proyeccion.id,

                x1,
                y1,

                x2,
                y2
            })
        }
    )

    lineasProyeccion.value =
        nuevasLineas
}

function actualizarModoResponsive() {
    esResponsive.value =
        window.matchMedia(
            '(max-width: 700px)'
        ).matches
}

function actualizarResponsive() {
    actualizarModoResponsive()

    nextTick(() => {
        if (!esResponsive.value) {
            lineasProyeccion.value = []
            return
        }

        actualizarSvgsProyeccion()

        requestAnimationFrame(() => {
            actualizarLineasProyeccion()
        })
    })
}

/* =========================================================
   INICIALIZACIÓN
========================================================= */

onMounted(async () => {
    actualizarModoResponsive()

    window.addEventListener(
        'resize',
        actualizarResponsive
    )

    await cargarEstados()

    await nextTick()

    actualizarSvgsProyeccion()

    requestAnimationFrame(() => {
        actualizarLineasProyeccion()
    })
})

onBeforeUnmount(() => {
    window.removeEventListener(
        'resize',
        actualizarResponsive
    )
})

watch(
    () => props.datos,
    async () => {
        await nextTick()

        actualizarSvgsProyeccion()

        if (esResponsive.value) {
            requestAnimationFrame(() => {
                actualizarLineasProyeccion()
            })
        }
    },
    {
        deep: true
    }
)

</script>

<template>
    <div class="mapa-mexico">
        <!-- CARGANDO -->
        <div v-if="cargando" class="mapa-estado-mensaje">
            Cargando mapa...
        </div>

        <!-- ERROR -->
        <div v-else-if="errorCarga" class="mapa-estado-mensaje mapa-estado-mensaje--error">
            No fue posible cargar el mapa.
        </div>

        <!-- MAPA -->

        <div v-else ref="mapaWrapperRef" class="mapa-responsive-wrapper">
            <!-- =============================================
     LÍNEAS DE PROYECCIÓN
============================================== -->

            <svg v-if="esResponsive" class="proyecciones-lineas" aria-hidden="true">
                <g v-for="linea in lineasProyeccion" :key="`linea-${linea.id}`">
                    <line :x1="linea.x1" :y1="linea.y1" :x2="linea.x2" :y2="linea.y2" />

                    <circle :cx="linea.x1" :cy="linea.y1" r="2.5" />
                </g>
            </svg>
            <!-- =============================================
     PROYECCIONES RESPONSIVE
============================================== -->

            <template v-if="esResponsive">
                <button v-for="proyeccion in CONFIG_PROYECCIONES" :key="`proyeccion-${proyeccion.id}`" :ref="(elemento) =>
                    registrarRefProyeccion(
                        proyeccion.id,
                        elemento
                    )
                    " type="button" class="estado-proyeccion" :class="{
                        'estado-proyeccion--seleccionado':
                            Number(seleccionadoId) ===
                            proyeccion.id,

                        'estado-proyeccion--atenuado':
                            haySeleccion &&
                            Number(seleccionadoId) !==
                            proyeccion.id
                    }" :style="{
                        left: `${proyeccion.x}%`,
                        top: `${proyeccion.y}%`
                    }" :aria-label="`Seleccionar ${proyeccion.nombre}`
                        " @click="
                            seleccionarProyeccion(
                                proyeccion
                            )
                            ">
                    <div class="estado-proyeccion__svg">
                        <div v-if="
                            svgsProyeccion[
                            proyeccion.id
                            ]
                        " v-html="svgsProyeccion[
                            proyeccion.id
                        ]
                            " />
                    </div>

                    <span class="estado-proyeccion__nombre">
                        {{ proyeccion.nombre }}
                    </span>
                </button>
            </template>
            <div ref="mapaRef" class="mapa-svg-container" :style="estiloMapa">
                <div v-for="estado in estados" v-show="estado.svg" :key="estado.codigo" class="estado-capa" :class="{
                    'estado-hover':
                        hoverId === estado.id,
                    'estado-seleccionado':
                        Number(seleccionadoId) === estado.id,
                    'estado-atenuado':
                        haySeleccion &&
                        Number(seleccionadoId) !== estado.id
                }" :data-estado-id="estado.id" :style="{
                    '--estado-fill':
                        colorEstado(estado.id),
                    '--estado-fill-atenuado':
                        colorEstadoAtenuado(estado.id),
                    '--hover-scale':
                        estado.escalaHover
                }" role="button" :aria-label="`Seleccionar ${estado.nombre}`" @pointerenter="
                    entrarEstado(estado, $event)
                    " @pointermove="
                        moverTooltip($event)
                        " @pointerleave="
                            salirEstado(estado)
                            " @click="
                                seleccionarEstado(estado)
                                ">
                    <div class="estado-svg" v-html="estado.svg" />

                </div>
                <!-- TOOLTIP -->
                <div v-show="tooltip.visible" class="estado-tooltip" :style="{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y}px`
                }">
                    {{ tooltip.nombre }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.mapa-mexico {
    width: 100%;
    min-width: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: visible;
}

/* =========================================================
   CONTENEDOR PRINCIPAL
========================================================= */

.mapa-svg-container {
    position: relative;

    width: 100%;
    max-width: 100%;

    min-width: 0;

    overflow: visible;

    /*
   * Evita seleccionar texto durante interacción.
   */
    user-select: none;
    -webkit-user-select: none;
}

/* =========================================================
   CAPAS
========================================================= */

/*
 * Los 32 estados ocupan EXACTAMENTE el mismo espacio.
 *
 * Como todos conservan el mismo viewBox,
 * al superponerlos reconstruyen México.
 */
.estado-capa {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    pointer-events: none;

    z-index: 1;
}

/*
 * El seleccionado permanece ligeramente
 * por encima del resto.
 */
.estado-capa.estado-seleccionado {
    z-index: 20;
}

/*
 * El hover siempre queda hasta arriba.
 */
.estado-capa.estado-hover {
    z-index: 100;
}

.estado-svg {
    width: 100%;
    height: 100%;
}

/* =========================================================
   SVG ROOT
========================================================= */

/*
 * v-html no recibe el atributo scoped de Vue.
 * Por eso todos los estilos internos utilizan :deep().
 */
.estado-capa :deep(.estado-svg-root) {
    display: block;

    width: 100%;
    height: 100%;

    overflow: visible;

    pointer-events: none;
}

/* =========================================================
   SILUETA
========================================================= */

.estado-capa :deep(.estado-shape) {
    transform-box: fill-box;
    transform-origin: center;

    transition:
        transform 160ms ease-out,
        filter 180ms ease;

    pointer-events: visiblePainted;

    cursor: pointer;
}

/*
 * Los elementos internos también son interactivos.
 */
.estado-capa :deep(.estado-shape *) {
    pointer-events: visiblePainted;

    cursor: pointer;
}

/* =========================================================
   COLOR
========================================================= */

.estado-capa :deep(.estado-shape path),
.estado-capa :deep(.estado-shape polygon),
.estado-capa :deep(.estado-shape polyline),
.estado-capa :deep(.estado-shape rect),
.estado-capa :deep(.estado-shape circle),
.estado-capa :deep(.estado-shape ellipse) {
    fill: var(--estado-fill) !important;

    stroke: #ffffff !important;
    stroke-width: 1.1;

    /*
   * El borde no se vuelve grueso al escalar.
   */
    vector-effect: non-scaling-stroke;

    transition:
        fill 450ms ease,
        stroke 300ms ease,
        stroke-width 180ms ease,
        filter 180ms ease;
}

/* =========================================================
   HOVER
========================================================= */

.estado-capa.estado-hover :deep(.estado-shape) {
    transform:
        scale(var(--hover-scale));

    filter:
        drop-shadow(0 4px 5px rgba(0, 0, 0, 0.22));
}

.estado-capa:active :deep(.estado-shape) {
    transform: scale(0.985);

    transition:
        transform 70ms ease-out,
        filter 70ms ease-out;
}

/*
 * Si el estado está en hover y lo pulsamos,
 * NO queremos pasar, por ejemplo, de:
 *
 * scale(1.30) -> scale(0.985)
 *
 * porque daría un salto enorme.
 *
 * En cambio hacemos:
 *
 * 1.30 * 0.985 = 1.2805
 *
 * Es decir, solamente se hunde ligeramente.
 */
.estado-capa.estado-hover:active :deep(.estado-shape) {
    transform:
        scale(calc(var(--hover-scale) * 0.985));

    filter:
        drop-shadow(0 2px 3px rgba(0, 0, 0, 0.18));

    transition:
        transform 70ms ease-out,
        filter 70ms ease-out;
}

.estado-capa.estado-hover :deep(.estado-shape path),
.estado-capa.estado-hover :deep(.estado-shape polygon),
.estado-capa.estado-hover :deep(.estado-shape polyline),
.estado-capa.estado-hover :deep(.estado-shape rect),
.estado-capa.estado-hover :deep(.estado-shape circle),
.estado-capa.estado-hover :deep(.estado-shape ellipse) {
    /*
   * El fill NO cambia.
   */
    fill: var(--estado-fill) !important;

    stroke: #164e63 !important;
    stroke-width: 2;
}

/* =========================================================
   SELECCIONADO
========================================================= */

.estado-capa.estado-seleccionado :deep(.estado-shape) {
    /*
   * No dejamos permanentemente escalado el estado.
   */
    filter:
        drop-shadow(0 2px 3px rgba(0, 0, 0, 0.18));
}

.estado-capa.estado-seleccionado :deep(.estado-shape path),
.estado-capa.estado-seleccionado :deep(.estado-shape polygon),
.estado-capa.estado-seleccionado :deep(.estado-shape polyline),
.estado-capa.estado-seleccionado :deep(.estado-shape rect),
.estado-capa.estado-seleccionado :deep(.estado-shape circle),
.estado-capa.estado-seleccionado :deep(.estado-shape ellipse) {
    stroke: #164e63 !important;
    stroke-width: 2;
}

/*
 * Si además está seleccionado Y tiene hover,
 * gana el comportamiento de hover.
 */
.estado-capa.estado-seleccionado.estado-hover :deep(.estado-shape) {
    transform:
        scale(var(--hover-scale));

    filter:
        drop-shadow(0 5px 6px rgba(0, 0, 0, 0.25));
}

/* =========================================================
   ESTADOS ATENUADOS
========================================================= */

.estado-capa.estado-atenuado :deep(.estado-shape path),
.estado-capa.estado-atenuado :deep(.estado-shape polygon),
.estado-capa.estado-atenuado :deep(.estado-shape polyline),
.estado-capa.estado-atenuado :deep(.estado-shape rect),
.estado-capa.estado-atenuado :deep(.estado-shape circle),
.estado-capa.estado-atenuado :deep(.estado-shape ellipse) {

    fill:
        var(--estado-fill-atenuado) !important;

    stroke:
        rgba(255, 255, 255, 0.8) !important;
}

/*
 * Aunque hagamos hover sobre otro estado,
 * mientras exista una selección ese estado
 * continúa atenuado.
 */
.estado-capa.estado-atenuado.estado-hover :deep(.estado-shape path),
.estado-capa.estado-atenuado.estado-hover :deep(.estado-shape polygon),
.estado-capa.estado-atenuado.estado-hover :deep(.estado-shape polyline),
.estado-capa.estado-atenuado.estado-hover :deep(.estado-shape rect),
.estado-capa.estado-atenuado.estado-hover :deep(.estado-shape circle),
.estado-capa.estado-atenuado.estado-hover :deep(.estado-shape ellipse) {

    fill:
        var(--estado-fill-atenuado) !important;

    stroke:
        #164e63 !important;
}

/* =========================================================
   PULSACIÓN DE ESTADO YA SELECCIONADO
========================================================= */

/*
 * Estado seleccionado + pulsación.
 *
 * Se reduce apenas para dar sensación de presión.
 * Aplica principalmente en dispositivos donde no hay hover.
 */
.estado-capa.estado-seleccionado:active :deep(.estado-shape) {

    transform: scale(0.985);

    filter:
        drop-shadow(0 1px 2px rgba(0, 0, 0, 0.14));

    transition:
        transform 70ms ease-out,
        filter 70ms ease-out;
}


/*
 * Estado seleccionado + hover + pulsación.
 *
 * Conservamos la escala de hover y solamente
 * la reducimos ligeramente durante el click.
 *
 * Ejemplo:
 *
 * hover = 1.20
 * pulsado = 1.20 * 0.985
 */
.estado-capa.estado-seleccionado.estado-hover:active :deep(.estado-shape) {

    transform:
        scale(calc(var(--hover-scale) * 0.985));

    filter:
        drop-shadow(0 2px 3px rgba(0, 0, 0, 0.16));

    transition:
        transform 70ms ease-out,
        filter 70ms ease-out;
}

/* =========================================================
   MENSAJES
========================================================= */

.mapa-estado-mensaje {
    width: 100%;

    padding: 3rem 1rem;

    text-align: center;
}

.mapa-estado-mensaje--error {
    font-size: 0.95rem;
}

/* =========================================================
   TOOLTIP
========================================================= */

.estado-tooltip {
    position: absolute;

    z-index: 1000;

    padding:
        0.45rem 0.7rem;

    background:
        rgba(20, 30, 35, 0.92);

    color: #ffffff;

    border-radius: 6px;

    font-size: 0.82rem;
    font-weight: 600;

    line-height: 1;

    white-space: nowrap;

    pointer-events: none;

    transform:
        translate(-50%, calc(-100% - 12px));

    box-shadow:
        0 3px 8px rgba(0, 0, 0, 0.18);
}

@media (hover: none) {
    .estado-tooltip {
        display: none;
    }
}

/* =========================================================
   WRAPPER
========================================================= */

.mapa-responsive-wrapper {
    position: relative;

    width: 100%;
    min-width: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: visible;
}


/* =========================================================
   LÍNEAS
========================================================= */

.proyecciones-lineas {
    position: absolute;

    inset: 0;

    width: 100%;
    height: 100%;

    z-index: 150;

    overflow: visible;

    pointer-events: none;
}

.proyecciones-lineas line {
    stroke: #52727a;
    stroke-width: 1.4;

    vector-effect:
        non-scaling-stroke;
}

.proyecciones-lineas circle {
    fill: #52727a;
}


/* =========================================================
   PROYECCIÓN
========================================================= */

.estado-proyeccion {
    position: absolute;

    z-index: 200;

    width: 68px;
    min-height: 68px;

    padding: 5px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 3px;

    border: 1px solid rgba(22, 78, 99, 0.35);

    border-radius: 8px;

    background:
        rgba(255, 255, 255, 0.96);

    box-shadow:
        0 3px 8px rgba(0, 0, 0, 0.14);

    cursor: pointer;

    transition:
        transform 160ms ease,
        box-shadow 160ms ease,
        opacity 160ms ease;
}

.estado-proyeccion:active {
    transform:
        scale(0.96);
}


/* =========================================================
   SVG DE LA PROYECCIÓN
========================================================= */

.estado-proyeccion__svg {
    width: 52px;
    height: 42px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.estado-proyeccion__svg>div {
    width: 100%;
    height: 100%;
}

.estado-proyeccion__svg :deep(svg) {

    display: block;

    width: 100%;
    height: 100%;

    overflow: visible;
}


/* =========================================================
   NOMBRE
========================================================= */

.estado-proyeccion__nombre {
    max-width: 100%;

    font-size: 0.62rem;
    font-weight: 600;

    line-height: 1.1;

    text-align: center;
}


/* =========================================================
   PROYECCIÓN SELECCIONADA
========================================================= */

.estado-proyeccion--seleccionado {
    border:
        2px solid #164e63;

    box-shadow:
        0 4px 10px rgba(22, 78, 99, 0.28);
}


/* =========================================================
   PROYECCIÓN ATENUADA
========================================================= */

.estado-proyeccion--atenuado {
    opacity: 0.55;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
    .mapa-mexico {
        width: 100%;
    }

    .mapa-svg-container {
        width: 100%;
    }
}

@media (max-width: 480px) {

    /*
   * Evita cualquier desbordamiento horizontal
   * provocado por el contenedor.
   */
    .mapa-mexico {
        max-width: 100%;
    }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 700px) {

    /*
   * Le damos espacio vertical a las proyecciones.
   */
    .mapa-responsive-wrapper {
        min-height: 390px;

        padding:
            1rem 0;
    }

    /*
   * México ocupa menos ancho para dejar dos
   * columnas visuales a sus costados.
   */
    .mapa-svg-container {
        width: 74%;

        margin:
            0 auto;
    }

    .estado-proyeccion {
        width: 75px;
        min-height: 75px;

        padding: 4px;
    }

    .estado-proyeccion__svg {
        width: 48px;
        height: 38px;
    }

    .estado-proyeccion__nombre {
        font-size: 0.58rem;
    }
}

@media (max-width: 390px) {

    .mapa-responsive-wrapper {
        min-height: 370px;
    }

    .mapa-svg-container {
        width: 70%;
    }

    .estado-proyeccion {
        width: 57px;
        min-height: 58px;
    }

    .estado-proyeccion__svg {
        width: 43px;
        height: 35px;
    }

    .estado-proyeccion__nombre {
        font-size: 0.54rem;
    }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
    .estado-capa :deep(.estado-shape) {
        transition: none;
    }

    .estado-capa :deep(.estado-shape path),
    .estado-capa :deep(.estado-shape polygon),
    .estado-capa :deep(.estado-shape polyline),
    .estado-capa :deep(.estado-shape rect),
    .estado-capa :deep(.estado-shape circle),
    .estado-capa :deep(.estado-shape ellipse) {
        transition: none;
    }
}
</style>