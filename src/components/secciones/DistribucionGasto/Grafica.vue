<template>
  <div class="grafica-wrapper">
    <div ref="container" class="d3-container"></div>

    <!-- Tooltip -->
    <div ref="tooltip" class="tooltip" v-show="tooltipVisible">
      <span class="tt-ramo" v-if="tooltipData.ramoCorto">{{ tooltipData.ramoCorto }}</span>
      <span class="tt-pct">{{ tooltipData.porcentaje }}%</span>
      <span class="tt-tendencia" :class="claseTendencia(tooltipData.tendencia)">
        {{ tooltipData.tendencia || '–' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  datos: { type: Array, required: true }, // ahora es array de barras
  onClick: {type:Function, required:true},
  activa: {type:Number, required:true}
})

const container = ref(null)
const tooltip = ref(null)
const tooltipVisible = ref(false)
const tooltipData = ref({})

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

const claseTendencia = (t) => {
  if (t === '▲') return 'sube'
  if (t === '▼') return 'baja'
  return 'neutral'
}

const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return true
  return window.innerWidth <= 768
})

let resizeObserver = null

const render = () => {
  if (!container.value || !props.datos?.length) return

  const el = container.value
  el.innerHTML = ''

  const width = el.clientWidth
  const mobile = isMobile.value

  /* Layout por fila */
  const barHeight = mobile ? 32 : 44
  const barGap = mobile ? 90 : 110
  const leftLabelWidth = mobile ? 0 : 240
  const margin = {
    top: 24,
    right: 16,
    bottom: 8,
    left: leftLabelWidth + 16,
  }

  const innerWidth = Math.max(width - margin.left - margin.right, 200)
  const totalHeight = margin.top + props.datos.length * barGap + margin.bottom

  const svg = d3.select(el).append('svg').attr('width', width).attr('height', totalHeight)

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleLinear().domain([0, 100]).range([0, innerWidth])

  props.datos.forEach((barra, i) => {
    const rowG = g
  .append('g')
  .attr('transform', `translate(0, ${i * barGap})`)
  .style(
    'opacity',
    props.activa === null || props.activa === i ? 1 : 0.3
  )

    /* ── Porcentaje arriba ── */
    rowG
      .append('text')
      .attr('x', 0)
      .attr('y', barHeight + 16)
      .attr('text-anchor', 'start')
      .style('font-size', mobile ? '15px' : '18px')
      .style('font-weight', '800')
      .style('fill', '#222')
      .text(`${barra.porcentajeTotal}%`)

    /* ── Label izquierda (solo desktop) ── */
    if (!mobile) {
      const labelG = rowG
        .append('g')
        .attr('transform', `translate(-${leftLabelWidth + 12}, ${barHeight / 2})`)

      labelG
        .append('text')
        .attr('x', leftLabelWidth)
        .attr('y', 0)
        .attr('text-anchor', 'end')
        .attr('dy', '-0.1em')
        .style('font-size', '13px')
        .style('font-weight', '700')
        .style('fill', '#333')
        .text(truncar(barra.nombre, 38))

      labelG
        .append('text')
        .attr('x', leftLabelWidth)
        .attr('y', 16)
        .attr('text-anchor', 'end')
        .attr('dy', '0.2em')
        .style('font-size', '11px')
        .style('fill', '#666')
        .text(`${barra.total}  ·  ${barra.respecto} ${barra.tendencia}`)
    }

    /* ── Barra apilada ── */
    let acum = 0
    const segs = (barra.segmentos || []).map((s, idx) => {
      const start = acum
      acum += s.porcentaje
      return {
        ...s,
        x0: x(start),
        width: x(s.porcentaje),
        color: colores[idx % colores.length],
      }
    })

    const barGroup = rowG.append('g')

    /* Clip redondeado solo en extremos de la barra completa */
    const defs = svg.append('defs')
    const clipId = `bc-${barra.id}-${Math.random().toString(36).slice(2, 7)}`
    defs
      .append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', barHeight)
      .attr('rx', 10)
      .attr('ry', 10)

    const clipG = barGroup.append('g').attr('clip-path', `url(#${clipId})`)

    const rects = clipG
      .selectAll('rect.seg')
      .data(segs)
      .enter()
      .append('rect')
      .attr('class', 'seg')
      .attr('x', (d) => d.x0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', barHeight)
      .attr('fill', (d) => d.color)
      .style('cursor', 'pointer')
      .style('stroke', '#fff')
      .style('stroke-width', 1.5)

    rects
      .transition()
      .duration(600)
      .delay((d, idx) => idx * 50)
      .attr('width', (d) => d.width)

    rects
      .on('mouseenter', (event, d) => {
        d3.select(event.target).style('filter', 'brightness(1.15)')
        tooltipData.value = d
        tooltipVisible.value = true
        positionTooltip(event)
      })
      .on('mousemove', (event) => positionTooltip(event))
      .on('mouseleave', (event) => {
        d3.select(event.target).style('filter', 'none')
        d3.select(event.target).style('transform', 'scale(1)')
        tooltipVisible.value = false
      }).on('click',()=>{
        props.onClick(i) 
      })

    /* ── Labels móvil (arriba de barra) ── */
    if (mobile) {
      rowG
        .append('text')
        .attr('x', 0)
        .attr('y', -5)
        .style('font-size', '14px')
        .style('font-weight', '700')
        .style('fill', '#333')
        .text(truncar(barra.nombre, 100))

      rowG
        .append('text')
        .attr('x', 0)
        .attr('y', barHeight + 32)
        .style('font-size', '11px')
        .style('fill', '#555')
        .text(`${barra.total}  ·  ${barra.respecto} ${barra.tendencia}`)
    } else {
      /* ── Meta debajo de barra (desktop) ── */
      rowG
        .append('text')
        .attr('x', 0)
        .attr('y', barHeight + 18)
        .style('font-size', '12px')
        .style('font-weight', '700')
        .style('fill', '#222')
        .text(barra.total)

      rowG
        .append('text')
        .attr('x', barra.total.length * 7.5 + 8)
        .attr('y', barHeight + 18)
        .style('font-size', '11px')
        .style('fill', '#666')
        .text(`${barra.respecto} ${barra.tendencia}`)
    }
  })
}

const truncar = (texto, max) => (texto.length > max ? texto.slice(0, max) + '…' : texto)

const positionTooltip = (event) => {
  if (!tooltip.value || !container.value) return
  const rect = container.value.getBoundingClientRect()
  let left = event.clientX - rect.left + 14
  let top = event.clientY - rect.top - 10
  const ttW = tooltip.value.offsetWidth || 180
  if (left + ttW > rect.width) left = event.clientX - rect.left - ttW - 10
  tooltip.value.style.left = left + 'px'
  tooltip.value.style.top = top + 'px'
}

onMounted(() => {
  nextTick(() => {
    render()
    resizeObserver = new ResizeObserver(() => nextTick(render))
    resizeObserver.observe(container.value)
  })
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

watch(
  [() => props.datos, ()=>props.activa],
  () => nextTick(render),
  { deep: true },
)
</script>

<style scoped>
.grafica-wrapper {
  position: relative;
  width: 100%;
}

.d3-container {
  width: 100%;
}

/* Tooltip */
.tooltip {
  position: absolute;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  pointer-events: none;
  z-index: 100;
  font-size: 0.88rem;
  display: flex;
  gap:6px;
  align-items: center;
  justify-content: start;
}

.tt-ramo {
  font-weight: 700;
  color: #0b4f4f;
 
}

.tt-monto {
  color: #333;
  font-weight: 600;
}

.tt-pct {
  color: #1a8a9e;
  font-weight: 800;
}

.tt-tendencia {
  font-weight: 700;
}

.tt-tendencia.sube {
  color: #2a9d8f;
}

.tt-tendencia.baja {
  color: #e63946;
}

.tt-tendencia.neutral {
  color: #888;
}
</style>
