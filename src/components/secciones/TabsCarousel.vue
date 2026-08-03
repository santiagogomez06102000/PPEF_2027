<!-- ─────────────────────────────────────────────────────────────────────────
  TabsCarousel.vue
  Carrusel infinito de pestañas (tabs) horizontales con diseño responsive.

  ┌─ Comportamiento ──────────────────────────────────────────────────────┐
  │  • Muestra un número DINÁMICO de pestañas según el ancho del          │
  │    contenedor (visibleCount):                                          │
  │      < 480 px  → 3 tabs   (mobile)                                    │
  │      480–767px → 5 tabs   (tablet)                                    │
  │      ≥ 768 px  → 7 tabs   (desktop)                                   │
  │  • Los extremos siempre están difuminados.                            │
  │  • El carrusel es infinito (técnica de triple copia).                 │
  └───────────────────────────────────────────────────────────────────────┘

  ┌─ Técnica: "triple copia" ──────────────────────────────────────────────┐
  │  virtualTabs = [ ...tabs, ...tabs, ...tabs ]   (3 × N botones)         │
  │  Siempre se trabaja con la copia CENTRAL [N, 2N-1].                    │
  │  Al terminar cada animación se hace un "snap silencioso" al rango      │
  │  central: invisible porque translateX cambia en exactamente N × tw,   │
  │  que es un ciclo visual completo.                                       │
  └───────────────────────────────────────────────────────────────────────┘

  ┌─ Props ────────────────────────────────────────────────────────────────┐
  │  tabs        Object   { [key]: { label: string, component: Component }}│
  │  modelValue  String   clave del tab activo  (v-model)                  │
  │  ariaLabel   String   aria-label del tablist                           │
  └───────────────────────────────────────────────────────────────────────┘

  ┌─ CSS Custom Properties ────────────────────────────────────────────────┐
  │  --tabs-fade-color   Color de fondo del contenedor padre.              │
  │                      Debe coincidir con el fondo real para que el      │
  │                      gradiente sea correcto. Default: white.           │
  └───────────────────────────────────────────────────────────────────────┘
──────────────────────────────────────────────────────────────────────────── -->

<template>
  <div
    class="tabs-carousel"
    :class="{ 'tabs-carousel--ready': initialized }"
    :style="{ '--fade-width': fadeWidthPercent }"
    ref="containerRef"
  >
    <!-- ① Fades fijos en los extremos ────────────────────────────────────
         Siempre visibles, width = 1 tab = 100% / visibleCount.
         pointer-events: none → los clics llegan a los botones debajo.  -->
    <div class="tabs-carousel__fade tabs-carousel__fade--left" aria-hidden="true" />
    <div class="tabs-carousel__fade tabs-carousel__fade--right" aria-hidden="true" />

    <!-- ② Viewport ─────────────────────────────────────────────────────────
         Ventana recortada con overflow: hidden (en el contenedor raíz).
         No hace scroll; el movimiento es con CSS transform en la pista.  -->
    <div class="tabs-carousel__viewport" role="tablist" :aria-label="ariaLabel">
      <!-- ③ Pista deslizante ───────────────────────────────────────────────
           Contiene 3 × N botones. Width y transform vienen de trackStyle.
           @transitionend filtra solo 'transform' para evitar disparos
           falsos de otras propiedades con transición (p. ej. color).     -->
      <div
        class="tabs-carousel__track"
        :style="trackStyle"
        @transitionend="(e) => e.propertyName === 'transform' && onTransitionEnd()"
      >
        <button
          v-for="(tab, vIdx) in virtualTabs"
          :key="vIdx"
          role="tab"
          class="tabs-carousel__btn"
          :class="{ 'tabs-carousel__btn--active': tab.key === modelValue }"
          :style="{ width: tabWidth + 'px' }"
          :aria-selected="tab.key === modelValue"
          :tabindex="isInVisibleRange(vIdx) ? 0 : -1"
          @click="onTabClick(vIdx)"
        >
          <span class="tabs-carousel__label">{{ tab.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// ═══════════════════════════════════════════════════════════════════════════
//  CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════

/** Duración en ms de la animación de deslizamiento. */
const ANIM_DURATION = 340

/**
 * Breakpoints para el número de pestañas visibles.
 * Ajustar según el diseño del proyecto.
 *   < 480 px  → 3 tabs  (mobile)
 *   480–767px → 5 tabs  (tablet pequeño)
 *   ≥ 768 px  → 7 tabs  (desktop)
 */
const BREAKPOINTS = [
  { maxWidth: 479, count: 3 },
  { maxWidth: 767, count: 5 },
  { maxWidth: Infinity, count: 7 },
]

// ═══════════════════════════════════════════════════════════════════════════
//  PROPS & EMITS
// ═══════════════════════════════════════════════════════════════════════════

const props = defineProps({
  /** Objeto de tabs: { [key]: { label, component } } */
  tabs: { type: Object, required: true },
  /** Clave del tab activo (v-model). */
  modelValue: { type: String, required: true },
  /** aria-label del tablist para accesibilidad. */
  ariaLabel: { type: String, default: 'Navegación de pestañas' },
})

const emit = defineEmits(['update:modelValue'])

// ═══════════════════════════════════════════════════════════════════════════
//  DATOS DERIVADOS
// ═══════════════════════════════════════════════════════════════════════════

/** Array ordenado de { key, label, component } generado desde props.tabs. */
const tabsArray = computed(() =>
  Object.entries(props.tabs).map(([key, data]) => ({ key, ...data })),
)

/** Número total de tabs reales (N). */
const N = computed(() => tabsArray.value.length)

/**
 * Array virtual = 3 copias del arreglo original.
 * Índices:   [0 … N-1]  copia izquierda  (buffer)
 *            [N … 2N-1] copia central    ← operamos aquí
 *            [2N … 3N-1] copia derecha   (buffer)
 */
const virtualTabs = computed(() => [...tabsArray.value, ...tabsArray.value, ...tabsArray.value])

// ═══════════════════════════════════════════════════════════════════════════
//  ESTADO REACTIVO
// ═══════════════════════════════════════════════════════════════════════════

/** Referencia al elemento DOM del contenedor raíz. */
const containerRef = ref(null)

/**
 * Número de pestañas visibles simultáneamente.
 * Reactivo: se actualiza por el ResizeObserver según el ancho del contenedor.
 * Siempre impar para tener una pestaña central bien definida.
 */
const visibleCount = ref(7)

/**
 * Posición central dentro de la ventana visible.
 * Computed derivado de visibleCount para que sea siempre consistente.
 * Ej.: visibleCount=7 → halfVisible=3 (posición 0-indexed del centro)
 */
const halfVisible = computed(() => Math.floor(visibleCount.value / 2))

/** Ancho en px de cada pestaña. = containerWidth / visibleCount. */
const tabWidth = ref(0)

/**
 * Porcentaje de ancho de los fades = 100% / visibleCount.
 * Se pasa como CSS custom property --fade-width al contenedor.
 * El CSS de los fades usa var(--fade-width) para su `width`.
 */
const fadeWidthPercent = computed(() => `${(100 / visibleCount.value).toFixed(2)}%`)

/**
 * Índice activo dentro de virtualTabs.
 * Estado normal: [N, 2N-1] (copia central).
 * Durante animación puede salir de ese rango; se normaliza en onTransitionEnd.
 */
const virtualActiveIdx = ref(0)

/** true mientras hay una transición CSS activa. */
const isAnimating = ref(false)

/** true tras el primer recalcTabWidth exitoso (evita flash inicial). */
const initialized = ref(false)

// ═══════════════════════════════════════════════════════════════════════════
//  ESTILO DINÁMICO DE LA PISTA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Estilos inline de la pista deslizante.
 *
 * width     = total de botones × tabWidth
 * transform = centra el tab activo en la ventana:
 *               translateX = (halfVisible − virtualActiveIdx) × tabWidth
 * transition = activo solo durante animación; 'none' para el snap silencioso.
 */
const trackStyle = computed(() => ({
  width: `${virtualTabs.value.length * tabWidth.value}px`,
  transform: `translateX(${(halfVisible.value - virtualActiveIdx.value) * tabWidth.value}px)`,
  transition: isAnimating.value
    ? `transform ${ANIM_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
    : 'none',
}))

// ═══════════════════════════════════════════════════════════════════════════
//  UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convierte un índice virtual al índice real en tabsArray.
 * Doble módulo para manejar correctamente valores negativos.
 */
const toRealIdx = (vIdx) => ((vIdx % N.value) + N.value) % N.value

/**
 * true si vIdx está dentro de la ventana visible actual.
 * Se usa para asignar tabindex="-1" a botones fuera de vista (accesibilidad).
 */
const isInVisibleRange = (vIdx) => {
  const lo = virtualActiveIdx.value - halfVisible.value
  const hi = virtualActiveIdx.value + halfVisible.value
  return vIdx >= lo && vIdx <= hi
}

/**
 * Inicializa virtualActiveIdx apuntando a la copia CENTRAL del tab activo.
 * Se llama al montar y cuando tabsArray cambia externamente.
 */
const initVirtualIdx = () => {
  const realActive = tabsArray.value.findIndex((t) => t.key === props.modelValue)
  virtualActiveIdx.value = N.value + (realActive >= 0 ? realActive : 0)
}

/**
 * Recalcula tabWidth y visibleCount según el ancho actual del contenedor.
 * Llamado por ResizeObserver; desactiva animación activa para que el
 * reposicionamiento causado por el cambio de ancho sea instantáneo.
 */
const recalcTabWidth = () => {
  if (!containerRef.value) return
  const w = containerRef.value.clientWidth

  // Determinar visibleCount según breakpoints
  const bp = BREAKPOINTS.find((b) => w <= b.maxWidth)
  visibleCount.value = bp ? bp.count : 7

  isAnimating.value = false
  tabWidth.value = w / visibleCount.value

  if (!initialized.value) initialized.value = true
}

// ═══════════════════════════════════════════════════════════════════════════
//  MANEJADORES DE EVENTOS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Clic en una pestaña del carrusel.
 *  1. Ignora si hay animación en curso.
 *  2. Emite la nueva clave al padre (v-model).
 *  3. Si no es el tab actual, activa animación y actualiza virtualActiveIdx.
 */
const onTabClick = (vIdx) => {
  if (isAnimating.value) return

  emit('update:modelValue', virtualTabs.value[vIdx].key)
  if (vIdx === virtualActiveIdx.value) return

  isAnimating.value = true
  virtualActiveIdx.value = vIdx
}

/**
 * Fin de la transición CSS (evento transitionend, filtrado a 'transform').
 * Realiza el snap silencioso:
 *  1. Desactiva isAnimating → transition pasa a 'none'.
 *  2. Mueve virtualActiveIdx al equivalente en la copia central.
 *     El cambio de translateX es ±N×tabWidth = un ciclo visual completo,
 *     por lo que es invisible para el usuario.
 */
const onTransitionEnd = () => {
  isAnimating.value = false
  virtualActiveIdx.value = N.value + toRealIdx(virtualActiveIdx.value)
}

// ═══════════════════════════════════════════════════════════════════════════
//  WATCHERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Si el arreglo de tabs cambia (añadir/quitar tabs dinámicamente),
 * reinicializa virtualActiveIdx sin animación.
 */
watch(tabsArray, () => initVirtualIdx())

// ═══════════════════════════════════════════════════════════════════════════
//  CICLO DE VIDA
// ═══════════════════════════════════════════════════════════════════════════

let resizeObserver = null

onMounted(() => {
  recalcTabWidth() // calcula tabWidth y visibleCount iniciales
  initVirtualIdx() // posiciona en la copia central

  // ResizeObserver detecta cambios del contenedor específico,
  // incluyendo reflows causados por panels laterales, etc.
  resizeObserver = new ResizeObserver(recalcTabWidth)
  if (containerRef.value) resizeObserver.observe(containerRef.value)
})

onUnmounted(() => resizeObserver?.disconnect())
</script>

<style scoped>
/* ── Contenedor raíz ──────────────────────────────────────────────────────── */
/*
  overflow: hidden recorta la pista a la ventana visible.
  Oculto hasta que tabWidth esté calculado (evita flash de layout vacío).
*/
.tabs-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.tabs-carousel--ready {
  opacity: 1;
}

/* ── Fades ────────────────────────────────────────────────────────────────── */
/*
  --fade-width se calcula en JS: 100% / visibleCount (ancho de 1 tab).
  Actualiza automáticamente al cambiar el breakpoint.
  El color del gradiente usa --tabs-fade-color del padre.
*/
.tabs-carousel__fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--fade-width, 14.3%);
  pointer-events: none;
  z-index: 2;
}

.tabs-carousel__fade--left {
  left: 0;
  background: linear-gradient(to right, var(--tabs-fade-color, white) 15%, transparent 100%);
}

.tabs-carousel__fade--right {
  right: 0;
  background: linear-gradient(to left, var(--tabs-fade-color, white) 15%, transparent 100%);
}

/* ── Viewport ─────────────────────────────────────────────────────────────── */
/* border-bottom = línea base horizontal común a todas las pestañas. */
.tabs-carousel__viewport {
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
}

/* ── Pista ────────────────────────────────────────────────────────────────── */
/* align-items: flex-end → botones alineados en la base del viewport. */
.tabs-carousel__track {
  display: flex;
  align-items: flex-end;
  will-change: transform; /* hint GPU para animaciones fluidas */
}

/* ── Botones ──────────────────────────────────────────────────────────────── */
/* flex-shrink: 0 evita comprensión; width via :style (JS). */
.tabs-carousel__btn {
  flex-shrink: 0;
  padding: 13px 8px 11px;
  border: none;
  border-top: 3px solid transparent;
  border-radius: 10px 10px 0 0;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  white-space: nowrap;
  text-align: center;
  outline: none;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}

.tabs-carousel__btn:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #111827;
}

.tabs-carousel__btn:focus-visible {
  box-shadow: 0 0 0 2px #3b82f6;
  position: relative;
  z-index: 1;
}

/* ── Tab activo ───────────────────────────────────────────────────────────── */
/*
  margin-bottom: -1px + padding-bottom extra → el tab activo cubre el
  border-bottom del viewport con su fondo blanco, creando el efecto
  clásico de "pestaña conectada" con el panel de contenido.
*/
.tabs-carousel__btn--active {
  background: white;
  color: #06a5c1;
  font-weight: 600;
  border-top-color: #06a5c1;
  position: relative;
  z-index: 1;
  margin-bottom: -1px;
  padding-bottom: 12px;
}

/* ── Texto del botón ──────────────────────────────────────────────────────── */
/* Trunca con "…" si el label es más largo que el ancho disponible. */
.tabs-carousel__label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
