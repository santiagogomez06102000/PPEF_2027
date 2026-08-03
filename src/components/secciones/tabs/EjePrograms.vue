<!-- ─────────────────────────────────────────────────────────────────────────
  EjePrograms.vue
  Componente genérico para cualquier Eje General o Transversal.

  Props:
    titulo      String  — Título del eje (h3)
    descripcion String  — Párrafo descriptivo bajo la imagen
    imagen      String  — Ruta a la imagen (/secciones/programas/images/...)
    jsonPath    String  — Ruta al JSON del dataset (/secciones/programas/eje_X.json)
──────────────────────────────────────────────────────────────────────────── -->
<template>
  <h3>{{ titulo }}</h3>

  <!-- ── Media Object ──────────────────────────────────────────────────── -->
  <div class="media-object">
    <div class="media-image-wrapper">
      <figure class="media-figure">
        <img :src="imagenUrl" :alt="titulo" class="media-img" />
      </figure>
    </div>
    <div class="media-body">
      <p>{{ descripcion }}</p>
    </div>
  </div>

  <!-- ── Programas institucionales ─────────────────────────────────────── -->
  <div class="institutional-programs">
    <div class="demo-body">
      <div class="preview-panel">
        <div class="programs-list">
          <ul>
            <li v-for="(programa, idx) in pestaña[activeTab].programas" :key="idx">
              <div class="programa-row">
                <button
                  @click="mostrarGrafica(programa)"
                  class="programa-btn"
                  :class="{ 'programa-btn--active': programaActivo === programa.denominacion }"
                >
                  <span class="programa-numero">{{ String(idx + 1).padStart(2, '0') }}.</span>

                  <span
                    :class="{ 'programa-nombre--bold': programaActivo === programa.denominacion }"
                  >
                    {{ programa.denominacion }}
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="programa-icon"
                    viewBox="-4 0 20 16"
                  >
                    <path
                      d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1
         1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6
         7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1
         0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0
         0 1-1 1H2a1 1 0 0 1-1-1z"
                    />
                  </svg>
                </button>
              </div>

              <Transition name="grafica-slide" @after-enter="onAfterEnter">
                <div
                  v-if="programaActivo === programa.denominacion"
                  ref="graficaRef"
                  class="grafica-container"
                >
                  <div class="grafica-header">
                    <h3 class="grafica-title">{{ programa.rawData?.programa?.nombre }}</h3>
                    <button @click="cerrarGrafica" class="btn-cerrar" aria-label="Cerrar gráfica">
                      ✕
                    </button>
                  </div>

                  <div class="grafica-wrapper" ref="wrapperRef">
                    <svg ref="svgRef"></svg>
                  </div>

                  <div class="leyenda-2027">
                    <span class="leyenda-texto">
                      El monto total para el próximo año 2027 es:
                      <strong class="leyenda-monto">
                        {{ monto2027.toLocaleString('es-MX') }} MDP
                      </strong>
                    </span>
                  </div>
                </div>
              </Transition>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as d3 from 'd3'

// ════════════════════════════════════════════════════════════════════════════
// PROPS — todo lo que varía entre ejes se recibe desde el padre
// ════════════════════════════════════════════════════════════════════════════
const props = defineProps({
  /** Título del eje mostrado en el h3 */
  titulo: { type: String, required: true },
  /** Párrafo descriptivo bajo la imagen */
  descripcion: { type: String, required: true },
  /** Ruta a la imagen del eje */
  imagen: { type: String, required: true },
  /**
   * Ruta al JSON del dataset relativa a /public.
   * Ej.: '/secciones/programas/eje_1.json'
   * Se concatena con BASE_URL en onMounted.
   */
  jsonPath: { type: String, required: true },
})

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN BASE DE LA GRÁFICA
// ════════════════════════════════════════════════════════════════════════════
const CHART_BASE = {
  maxWidth: 870,
  minWidth: 300,
  aspectRatio: 580 / 800,
  colors: ['rgb(142, 216, 167)', 'rgb(154, 136, 251)', 'rgb(246, 219, 50)', 'rgb(221, 138, 209)', 'rgb(2, 188, 167)'],
  line: {
    color: 'rgb(93, 93, 93)',
    width: 2.5,
    dotRadius: 5,
    dotFill: 'rgb(93, 93, 93)',
    dotStrokeWidth: 2,
  },
}

const STACK_KEYS = ['servicios_personales', 'operacion', 'inversion', 'subsidios', 'otros']
const STACK_LABELS = ['Servicios Personales', 'Operación', 'Inversión', 'Subsidios', 'Otros']
const LINE_KEY = 'monto'
const hiddenKeys = ref(new Set())

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN RESPONSIVE
// ════════════════════════════════════════════════════════════════════════════
function getResponsiveConfig(availableWidth) {
  const width = Math.min(Math.max(availableWidth, CHART_BASE.minWidth), CHART_BASE.maxWidth)
  const isMobile = width < 480
  const isTablet = width < 660

  return {
    width,
    height: isMobile ? Math.round(width * 1.35) : Math.round(width * CHART_BASE.aspectRatio),
    margin: {
      top: 30,
      right: isMobile ? 45 : 80,
      bottom: isMobile ? 160 : isTablet ? 130 : 100,
      left: isMobile ? 52 : 70,
    },
    fontSize: {
      axis: isMobile ? 9 : isTablet ? 11 : 13,
      tick: isMobile ? 8 : isTablet ? 10 : 12,
      legend: isMobile ? 10 : isTablet ? 11 : 12,
    },
    legendColumns: isMobile ? 1 : isTablet ? 2 : 3,
    isMobile,
    isTablet,
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ESTADO
// Declarados antes del watch para evitar TDZ con const/let.
// ════════════════════════════════════════════════════════════════════════════
const activeTab = ref(0)
const programaSeleccionado = ref(null)
const programaActivo = ref(null)
const jsonData = ref([])

// Refs de DOM — dentro de v-for Vue 3 los convierte en arrays; [0] = activo.
const graficaRef = ref([])
const svgRef = ref([])
const wrapperRef = ref([])

const urlBase = import.meta.env.BASE_URL

let resizeObserver = null

// ── Tooltip flotante en <body> con estilos inline (evita problemas de scoped) ──
let tooltipEl = null
function getTooltip() {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    Object.assign(tooltipEl.style, {
      position: 'fixed',
      pointerEvents: 'none',
      background: 'rgba(255,255,255,0.97)',
      border: '1px solid #e1e5e8',
      borderRadius: '6px',
      padding: '10px 14px',
      fontSize: '13px',
      lineHeight: '1.8',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      opacity: '0',
      transition: 'opacity 0.15s ease',
      zIndex: '9999',
      maxWidth: '280px',
      fontFamily: 'NotoSans, sans-serif',
    })
    document.body.appendChild(tooltipEl)
  }
  return tooltipEl
}

// Ramos del eje (actualmente la gráfica usa el primero)
const RAMOS = ['R14 Trabajo y Previsión Social', 'R15 Desarrollo Agrario, Territorial y Urbano']

// ── Helper: resuelve refs simples o arrays (dentro/fuera de v-for) ────────
function resolveRef(r) {
  return Array.isArray(r?.value) ? r.value[0] : r?.value
}

// ════════════════════════════════════════════════════════════════════════════
// COMPUTED
// ════════════════════════════════════════════════════════════════════════════
const pestaña = computed(() => {
  const programas = (jsonData.value || []).map((item) => ({
    denominacion: item.programa?.nombre || '',
    rawData: item,
  }))
  return RAMOS.map((ramo) => ({ tipo_programas: ramo, programas }))
})

const monto2027 = computed(() => {
  const item =
    jsonData.value.find((d) => d.programa?.nombre === programaSeleccionado.value?.denominacion) ||
    jsonData.value[0]
  return item?.anios?.find((a) => a.anio === 2027)?.monto || 0
})

const imagenUrl = computed(() => {
  // Si ya es URL absoluta externa, devolver tal cual
  if (/^https?:\/\//.test(props.imagen)) return props.imagen
  // Prefijar con BASE_URL y quitar barra inicial duplicada
  return `${urlBase}${props.imagen.replace(/^\//, '')}`
})

// ════════════════════════════════════════════════════════════════════════════
// CICLO DE VIDA
// ════════════════════════════════════════════════════════════════════════════
onMounted(async () => {
  try {
    // jsonPath viene del prop; se prefija con BASE_URL para Vite
    const res = await fetch(`${urlBase}${props.jsonPath.replace(/^\//, '')}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    jsonData.value = await res.json()

    const primer = pestaña.value[0]?.programas?.[0]
    if (primer) {
      programaSeleccionado.value = primer
      programaActivo.value = primer.denominacion
    }
  } catch (err) {
    console.error(`[EjePrograms] Error cargando ${props.jsonPath}:`, err)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  if (tooltipEl?.parentNode) tooltipEl.parentNode.removeChild(tooltipEl)
  tooltipEl = null // permite re-creación si el componente se vuelve a montar
})

// ════════════════════════════════════════════════════════════════════════════
// WATCH
// ════════════════════════════════════════════════════════════════════════════
watch(
  () => programaSeleccionado.value,
  async (nuevo) => {
    if (!nuevo) {
      resizeObserver?.disconnect()
      resizeObserver = null
      return
    }
    hiddenKeys.value.clear()   // ← resetea visibilidad
    await nextTick()
    renderChart()
    setupResizeObserver()
  },
)

// ════════════════════════════════════════════════════════════════════════════
// RESIZE OBSERVER
// ════════════════════════════════════════════════════════════════════════════
function setupResizeObserver() {
  resizeObserver?.disconnect()
  const wrapper = resolveRef(wrapperRef)
  if (!wrapper) return

  resizeObserver = new ResizeObserver(() => requestAnimationFrame(() => renderChart()))
  resizeObserver.observe(wrapper)
}

function toggleKey(key) {
  if (hiddenKeys.value.has(key)) hiddenKeys.value.delete(key)
  else hiddenKeys.value.add(key)
  renderChart()
}

// ════════════════════════════════════════════════════════════════════════════
// ACCIONES
// ════════════════════════════════════════════════════════════════════════════
const mostrarGrafica = async (programa) => {
  if (programaActivo.value === programa.denominacion) {
    cerrarGrafica()
    return
  }
  programaSeleccionado.value = programa
  programaActivo.value = programa.denominacion
}

const cerrarGrafica = () => {
  programaSeleccionado.value = null
  programaActivo.value = null
}

const onAfterEnter = () => {
  if (!programaActivo.value) return
  requestAnimationFrame(() => {
    const el = resolveRef(graficaRef)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    window.scrollTo({ top: scrollTop + rect.top - 150, behavior: 'smooth' })
  })
}

// ════════════════════════════════════════════════════════════════════════════
// D3 — RENDERIZADO
// ════════════════════════════════════════════════════════════════════════════
function renderChart() {
  const svgNode = resolveRef(svgRef)
  const wrapperNode = resolveRef(wrapperRef)
  if (!svgNode || !programaSeleccionado.value) return

  // 1. Datos
  const item =
    jsonData.value.find((d) => d.programa?.nombre === programaSeleccionado.value?.denominacion) ||
    jsonData.value[0]
  if (!item) return

  const data = (item.anios || [])
    .sort((a, b) => a.anio - b.anio)
    .map((a) => {
      const row = { anio: String(a.anio) }
      STACK_KEYS.forEach((k) => (row[k] = +a[k] || 0))
      row[LINE_KEY] = +a[LINE_KEY] || 0
      return row
    })

  // 2. Config responsive
  const availableWidth = wrapperNode?.clientWidth || CHART_BASE.maxWidth
  const cfg = getResponsiveConfig(availableWidth)
  const { width, height, margin, fontSize } = cfg
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  // 3. SVG
  const svgEl = d3.select(svgNode)
  svgEl.selectAll('*').remove()
  svgEl
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  const g = svgEl.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  // 4. Escalas
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.anio))
    .range([0, innerW])
    .padding(0.3)

  const maxStack = d3.max(data, (d) => d3.sum(STACK_KEYS, (k) => d[k]))
  const maxLine = d3.max(data, (d) => d[LINE_KEY])
  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(maxStack, maxLine) * 1.15])
    .range([innerH, 0])
    .nice()

  const colorScale = d3.scaleOrdinal().domain(STACK_KEYS).range(CHART_BASE.colors)

  // 5. Stack
  const series = d3.stack().keys(STACK_KEYS).order(d3.stackOrderNone).offset(d3.stackOffsetNone)(
    data,
  )

  // 6. Grid
  g.append('g')
    .call(d3.axisLeft(yScale).ticks(6).tickSize(-innerW).tickFormat(''))
    .call((s) => s.select('.domain').remove())
    .call((s) => s.selectAll('line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'))

  // 7. Barras apiladas
  g.append('g')
    .selectAll('g.layer')
    .data(series)
    .join('g')
    .attr('fill', (d) => colorScale(d.key))
    .selectAll('rect')
    .data((d) => d)
    .join('rect')
    .attr('x', (d) => xScale(d.data.anio))
    .attr('y', (d) => yScale(d[1]))
    .attr('height', (d) => Math.max(0, yScale(d[0]) - yScale(d[1])))
    .attr('width', xScale.bandwidth())
    .attr('rx', 2)
    .on('mouseenter', function (event, d) {
      d3.select(this).attr('opacity', 0.75)
      showTooltip(event, d.data)
    })
    .on('mousemove', (e) => moveTooltip(e))
    .on('mouseleave', function () {
      d3.select(this).attr('opacity', 1)
      hideTooltip()
    })

  // 8. Línea
  const lineGen = d3
    .line()
    .x((d) => xScale(d.anio) + xScale.bandwidth() / 2)
    .y((d) => yScale(d[LINE_KEY]))
    .curve(d3.curveMonotoneX)

  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', CHART_BASE.line.color)
    .attr('stroke-width', CHART_BASE.line.width)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', lineGen)

  // Puntos
  g.append('g')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', (d) => xScale(d.anio) + xScale.bandwidth() / 2)
    .attr('cy', (d) => yScale(d[LINE_KEY]))
    .attr('r', CHART_BASE.line.dotRadius)
    .attr('fill', CHART_BASE.line.dotFill)
    .attr('stroke', CHART_BASE.line.color)
    .attr('stroke-width', CHART_BASE.line.dotStrokeWidth)
    .attr('cursor', 'pointer')
    .on('mouseenter', function (event, d) {
      d3.select(this)
        .attr('r', CHART_BASE.line.dotRadius * 1.6)
        .attr('stroke-width', CHART_BASE.line.dotStrokeWidth * 1.5)
      showLineTooltip(event, d)
    })
    .on('mousemove', (e) => moveTooltip(e))
    .on('mouseleave', function () {
      d3.select(this)
        .attr('r', CHART_BASE.line.dotRadius)
        .attr('stroke-width', CHART_BASE.line.dotStrokeWidth)
      hideTooltip()
    })

  // 9. Ejes
  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .call((s) => s.select('.domain').attr('stroke', '#9ca3af'))
    .call((s) =>
      s
        .selectAll('text')
        .attr('font-size', fontSize.axis)
        .attr('fill', '#374151')
        .attr('transform', cfg.isMobile ? 'rotate(-35)' : null)
        .attr('text-anchor', cfg.isMobile ? 'end' : 'middle')
        .attr('dx', cfg.isMobile ? '-0.5em' : null)
        .attr('dy', cfg.isMobile ? '0.1em' : '0.9em'),
    )

  g.append('text')
    .attr('x', innerW / 2)
    .attr('y', innerH + (cfg.isMobile ? 52 : 44))
    .attr('text-anchor', 'middle')
    .attr('font-size', fontSize.axis)
    .attr('fill', '#6b7280')
    .text('Años')

  g.append('g')
    .call(
      d3
        .axisLeft(yScale)
        .ticks(6)
        .tickFormat((v) =>
          cfg.isMobile && v >= 1000 ? `${(v / 1000).toFixed(0)}k` : d3.format(',.0f')(v),
        ),
    )
    .call((s) => s.select('.domain').attr('stroke', '#9ca3af'))
    .call((s) => s.selectAll('text').attr('font-size', fontSize.tick).attr('fill', '#374151'))

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerH / 2)
    .attr('y', -(margin.left - 12))
    .attr('text-anchor', 'middle')
    .attr('font-size', fontSize.axis)
    .attr('fill', '#6b7280')
    .text('MDP')

  // 10. Leyenda
  renderLegend(g, innerW, innerH, cfg)
}

// ════════════════════════════════════════════════════════════════════════════
// D3 — LEYENDA RESPONSIVE
// ════════════════════════════════════════════════════════════════════════════
function renderLegend(g, innerW, innerH, cfg) {
  // ── Labels cortos solo en móvil ──
  const displayLabels = cfg.isMobile
    ? ['Serv. Pers.', 'Operación', 'Inversión', 'Subsidios', 'Otros', 'Total']
    : [...STACK_LABELS, 'Monto total']

  const allItems = [
    ...STACK_KEYS.map((k, i) => ({
      label: displayLabels[i],
      color: CHART_BASE.colors[i],
      type: 'rect',
    })),
    { label: displayLabels[5], color: CHART_BASE.line.color, type: 'line' },
  ]

  const rowH = 24          // más alto para que no se amontonen
  const gapX = 20          // espacio entre items horizontales
  const iconW = 18         // ancho reservado para el icono + separación hasta texto
  let currentX = 0
  let currentY = 20

  // Offset vertical base debajo del eje X
  const offsetY = innerH + (cfg.isMobile ? 50 : 40)
  const lg = g.append('g').attr('transform', `translate(0,${offsetY})`)

  allItems.forEach((item) => {
    // Ancho estimado del texto: ~0.6×fontSize por carácter (Noto Sans)
    const textW = item.label.length * cfg.fontSize.legend * 0.65
    const itemW = iconW + textW + gapX

    // Si no cabe en la fila actual, baja una fila
    if (currentX + itemW > innerW && currentX > 0) {
      currentX = 0
      currentY += rowH
    }

    const li = lg
      .append('g')
      .attr('transform', `translate(${currentX},${currentY})`)

    // Dibuja icono (igual que antes)
    if (item.type === 'rect') {
      li.append('rect')
        .attr('width', 12).attr('height', 12)
        .attr('y', -6).attr('rx', 2)
        .attr('fill', item.color)
    } else {
      li.append('line')
        .attr('x1', 0).attr('x2', 12)
        .attr('stroke', item.color).attr('stroke-width', 2.5)
      li.append('circle')
        .attr('cx', 6).attr('cy', 0).attr('r', 3)
        .attr('fill', '#fff')
        .attr('stroke', item.color).attr('stroke-width', 2)
    }

    // Dibuja texto
    li.append('text')
      .attr('x', 18)
      .attr('y', 0)
      .attr('dominant-baseline', 'middle')
      .attr('font-size', cfg.fontSize.legend)
      .attr('fill', '#374151')
      .text(item.label)

    currentX += itemW
  })
}

// ════════════════════════════════════════════════════════════════════════════
// TOOLTIP
// Usa clientX/clientY (coordenadas de viewport) porque el elemento tiene
// position:fixed — pageX/pageY incluyen el scroll y desplazan el tooltip.
// ════════════════════════════════════════════════════════════════════════════
function showTooltip(event, d) {
  const el = getTooltip()
  const lines = STACK_KEYS.map(
    (k, i) =>
      `<span style="color:${CHART_BASE.colors[i]}">■</span> ` +
      `${STACK_LABELS[i]}: <strong>${d3.format(',.0f')(d[k])}</strong>`,
  )
  lines.push(
    `<span style="color:${CHART_BASE.line.color}">◆</span> ` +
      `Monto total: <strong>${d3.format(',.0f')(d[LINE_KEY])}</strong>`,
  )
  el.innerHTML =
    `<div style="font-weight:700;margin-bottom:6px">Año ${d.anio}</div>` + lines.join('<br/>')
  el.style.opacity = '1'
  moveTooltip(event)
}

function showLineTooltip(event, d) {
  const el = getTooltip()
  el.innerHTML =
    `<div style="font-weight:700;margin-bottom:6px">Año ${d.anio}</div>` +
    `<span style="color:${CHART_BASE.line.color}">◆</span> ` +
    `Monto total: <strong>${d3.format(',.0f')(d[LINE_KEY])} MDP</strong>`
  el.style.opacity = '1'
  moveTooltip(event)
}

function moveTooltip(event) {
  const el = getTooltip()
  const OFFSET_X = 14
  const OFFSET_Y = 28
  const tooltipW = el.offsetWidth || 280
  const tooltipH = el.offsetHeight || 160
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight

  let x = event.clientX + OFFSET_X
  let y = event.clientY - OFFSET_Y

  if (x + tooltipW > viewportW - 8) x = event.clientX - tooltipW - OFFSET_X
  if (y < 8) y = event.clientY + OFFSET_X
  if (y + tooltipH > viewportH - 8) y = viewportH - tooltipH - 8

  el.style.left = `${Math.max(8, x)}px`
  el.style.top = `${Math.max(8, y)}px`
}

function hideTooltip() {
  getTooltip().style.opacity = '0'
}
</script>

<style scoped>
/* (estilos idénticos a los de Eje_G_1.vue — sin cambios) */
.institutional-programs {
  font-family: NotoSans, sans-serif;
}
.demo-body {
  display: flex;
  min-height: auto;
}
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
}
.programs-list {
  background: transparent;
  padding: 20px;
  border-radius: 20px;
  border: 2px solid #e0e0e0;
}
.programs-list ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.programs-list li {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.programs-list li:last-child {
  margin-bottom: 0;
}
/* ─────────────────────────────────────────────────────────────────────────
   Programa Row & Botón
   ───────────────────────────────────────────────────────────────────────── */
.programa-row {
  display: flex;
  align-items: center;
}

.programa-numero {
  font-size: 18px;
  font-family: 'Noto Sans Bold';
  color: #1d4ed8;
  flex-shrink: 0;
  min-width: 2.2em;
  font-variant-numeric: tabular-nums;
  user-select: none;
  display: inline-flex;
  align-items: center;
}

.programa-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 18px;
  color: #000;
  text-align: left;
  padding: 6px 12px;
  border-radius: 20px;
  transition:
    color 0.15s,
    background 0.15s;
  /* Evita que flexbox fuerce el desbordamiento del texto */
  min-width: 0;
}

/* Todos los spans dentro del botón (nombre del programa) pueden romper línea */
.programa-btn span {
  min-width: 0;
  overflow-wrap: break-word;
}

.programa-btn:hover {
  text-decoration: underline;
  color: #2563eb;
}

.programa-btn--active {
  background: rgba(29, 78, 216, 0.08);
}

.programa-nombre--bold {
  font-family: 'Noto Sans Bold';
  color: #1d4ed8;
}

.programa-icon {
  flex-shrink: 0;
  color: #2563eb;
  width: 22px;
  height: 22px;
}

/* ─────────────────────────────────────────────────────────────────────────
   Gráfica / Preview
   ───────────────────────────────────────────────────────────────────────── */
.grafica-container {
  margin-top: 16px;
  margin-bottom: 20px;
  background: transparent;
  border-radius: 4px;
}

.grafica-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 0 clamp(1rem, 8vw, 10rem);
  gap: 12px;
}

.grafica-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #333;
  flex: 1;
  line-height: 1.4;
  min-width: 0; 
}

.btn-cerrar {
  background-color: rgb(81, 81, 229);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  border: none;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition:
    background-color 200ms,
    transform 200ms;
}

.btn-cerrar:hover {
  background-color: rgb(214, 18, 231);
  transform: scale(1.1) rotate(90deg);
}

.btn-cerrar:active {
  transform: scale(0.95);
}
.grafica-wrapper {
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
  margin: 0 clamp(1rem, 5vw, 3rem);
}
.grafica-wrapper svg {
  display: block;
  max-width: 100%;
  height: auto;
}
.leyenda-2027 {
  margin-top: 14px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #edf2fc 0%, #fff 60%);
  border-left: 4px solid rgb(56, 78, 158);
  border-radius: 0 8px 8px 0;
  font-family: 'Noto Sans', sans-serif;
  font-size: 14px;
  color: #4b0082;
}
.leyenda-monto {
  color: rgb(3, 104, 219);
  font-size: 16px;
  font-weight: 700;
}

/* Transición */
.grafica-slide-enter-from,
.grafica-slide-leave-to {
  opacity: 0;
  transform: translateY(-24px);
  max-height: 0;
  margin-top: 0;
  margin-bottom: 0;
}
.grafica-slide-enter-to,
.grafica-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 900px;
  margin-top: 16px;
  margin-bottom: 20px;
}
.grafica-slide-enter-active,
.grafica-slide-leave-active {
  overflow: hidden;
  transition:
    opacity 350ms ease-out,
    transform 350ms ease-out,
    max-height 350ms ease-out,
    margin-top 350ms ease-out,
    margin-bottom 350ms ease-out;
}
.grafica-slide-leave-active {
  transition-duration: 250ms;
  transition-timing-function: ease-in;
}

/* Media Object */
.media-object {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  margin: 0.5rem auto;
  gap: 2rem;
  padding: 1rem 0;
}
@media (min-width: 640px) {
  .media-object {
    flex-direction: row;
    align-items: center;
    padding: 1rem 2rem;
  }
}
.media-image-wrapper {
  flex-shrink: 0;
  padding: 0;
  align-self: center;
}
.media-figure {
  width: 8rem;
  height: 8rem;
  border-radius: 0.75rem;
  overflow: hidden;
}
.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.media-body {
  flex: 1 1 0%;
  text-align: center;
  max-width: 65ch;
  margin: 0 auto;
  min-width: 0;
}

/* ════════════════════════════════════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════════════════════════════════════ */

/* ── Laptops / Tablets horizontales ── */
@media (max-width: 1024px) {
  .grafica-header {
    margin: 0 2rem;
  }
  .programa-btn {
    font-size: 17px;
    padding: 5px 10px;
    gap: 6px;
  }
  .programa-numero {
    font-size: 17px;
  }
}

/* ── Móvil grande ── */
@media (max-width: 640px) {
  .preview-panel,
  .programs-list {
    padding: 12px;
  }

  .programa-numero,
  .programa-btn {
    font-size: 15px;
  }

  .programa-btn {
    padding: 5px 8px;
    gap: 5px;
    border-radius: 16px;
  }

  .programa-icon {
    width: 20px;
    height: 20px;
  }

  .leyenda-2027 {
    font-size: 13px;
  }

  .leyenda-monto {
    font-size: 14px;
  }

  /* .media-image-wrapper {
    padding: 0 20px;
  } */

  .media-figure {
    width: 5rem;
    height: 5rem;
  }

  .grafica-header {
    margin: 0 1rem;
    gap: 8px;
  }

  .grafica-title {
    font-size: 14px;
  }

  .btn-cerrar {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
}

/* ── Móvil pequeño ── */
@media (max-width: 480px) {
  .programa-btn {
    font-size: 14px;
    padding: 4px 6px;
    gap: 4px;
    border-radius: 12px;
  }

  .programa-numero {
    font-size: 14px;
    min-width: 2em;
  }

  .programa-icon {
    width: 18px;
    height: 18px;
  }

  .grafica-title {
    font-size: 13px;
    line-height: 1.3;
  }

  .btn-cerrar {
    width: 30px;
    height: 30px;
    font-size: 15px;
  }

  .grafica-header {
    margin: 0 0.5rem;
  }
}

/* ── Móvil muy pequeño ── */
@media (max-width: 360px) {
  .programa-btn {
    font-size: 13px;
    gap: 3px;
    padding: 3px 5px;
    border-radius: 10px;
  }

  .programa-numero {
    font-size: 13px;
    min-width: 1.8em;
  }

  .programa-icon {
    width: 16px;
    height: 16px;
  }

  .grafica-title {
    font-size: 12px;
  }
}
</style>