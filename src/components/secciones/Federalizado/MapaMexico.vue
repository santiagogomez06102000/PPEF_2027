<script setup>
import {
    ref,
    computed,
    onMounted,
    nextTick
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
   ESTADO
========================================================= */

const mapaRef = ref(null)

const estados = ref([])

const cargando = ref(true)
const errorCarga = ref(false)

const hoverId = ref(null)

const viewBoxBase = ref({
    x: 0,
    y: 0,
    width: 1000,
    height: 630
})

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
   INTERACCIÓN
========================================================= */

function entrarEstado(estado) {
    hoverId.value = estado.id
}

function salirEstado(estado) {
    if (hoverId.value === estado.id) {
        hoverId.value = null
    }
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
   INICIALIZACIÓN
========================================================= */

onMounted(() => {
    cargarEstados()
})
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
        <div v-else ref="mapaRef" class="mapa-svg-container" :style="estiloMapa">
            <div v-for="estado in estados" v-show="estado.svg" :key="estado.codigo" class="estado-capa" :class="{
                'estado-hover':
                    hoverId === estado.id,

                'estado-seleccionado':
                    Number(seleccionadoId) ===
                    estado.id
            }" :data-estado-id="estado.id" :style="{
                '--estado-fill':
                    colorEstado(estado.id),

                '--hover-scale':
                    estado.escalaHover
            }" role="button" :aria-label="`Seleccionar ${estado.nombre}`" @pointerenter="
                entrarEstado(estado)
                " @pointerleave="
                    salirEstado(estado)
                    " @click="
                        seleccionarEstado(estado)
                        ">
                <div class="estado-svg" v-html="estado.svg" />
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
    /*
   * MUY IMPORTANTE:
   *
   * transform-box: fill-box hace que el origen de escala
   * se calcule usando el bounding box DEL ESTADO,
   * no el viewBox completo de México.
   */
    transform-box: fill-box;
    transform-origin: center;

    transition:
        transform 180ms ease,
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