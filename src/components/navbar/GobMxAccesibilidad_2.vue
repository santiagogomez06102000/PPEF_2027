<template>
  <div id="gobmx-accesibilidad-wrapper"></div>
</template>

<script>
// ─────────────────────────────────────────────────────────────────────────────
// GobMxAccesibilidad.vue — Barra de accesibilidad GobMX para Vue 3 + Tailwind
//
// Estrategia para Vue Router:
//   • Los estilos de body (grayscale, contrast, cursor-big) persisten solos
//     porque están en body — Vue Router no los toca.
//   • Dislexia, highlight, spacing y fontSize usan un MutationObserver
//     DEBOUNCED que ignora mutaciones causadas por el propio widget y
//     re-aplica los estilos solo a nodos NUEVOS (addedNodes), no a todo el DOM.
// ─────────────────────────────────────────────────────────────────────────────

const LS = {
  get: (k) => localStorage.getItem(k) === 'true',
  set: (k, v) => localStorage.setItem(k, String(v)),
  remove: (k) => localStorage.removeItem(k),
}

const WIDGET_IDS = new Set([
  'accessibility',
  'gobmx-separator',
  'gobmx-mask-top',
  'gobmx-mask-bottom',
  'gobmx-accesibilidad-wrapper',
])

// ¿Es un nodo perteneciente al widget?
const isWidget = (node) => {
  if (node.nodeType !== 1) return true // ignorar texto/comentarios
  if (WIDGET_IDS.has(node.id)) return true
  if (node.closest) {
    for (const id of WIDGET_IDS) {
      if (node.closest(`#${id}`)) return true
    }
  }
  return false
}

const SEL_TEXT =
  'p, li, dd, dt, a, h1, h2, h3, h4, span, figcaption, blockquote, .form-control, .btn'
const SEL_SPACING = 'p, li, dd, dt, a, h1, h2, h3, h4, figcaption, .form-control, .btn'

// ─── CSS fiel al original gob.mx (con correcciones de espaciado) ────────────
const WIDGET_CSS = `
  @font-face {
    font-family: "open_dyslexic";
    src: url("https://framework-gb.cdn.gob.mx/applications/cms/fonts/open_dyslexic/OpenDyslexic-Regular.otf") format("opentype");
  }

  #gobmx-accesibilidad-wrapper { display: contents; }

  /* ── Revert Tailwind Preflight solo dentro del widget ── */
  #accessibility,
  #accessibility * {
    all: revert;
    box-sizing: border-box;
  }

  /* ── Restaurar Font Awesome tras all:revert ── */
  #accessibility .fas, #accessibility .far,
  #accessibility .fad, #accessibility .fab, #accessibility .fa {
    display: inline-block !important;
    font-style: normal !important;
    font-variant: normal !important;
    line-height: 1 !important;
    text-rendering: auto !important;
    -webkit-font-smoothing: antialiased !important;
  }
  #accessibility .fas { font-family:"Font Awesome 5 Pro","FontAwesome" !important; font-weight:900 !important; }
  #accessibility .far { font-family:"Font Awesome 5 Pro","FontAwesome" !important; font-weight:400 !important; }
  #accessibility .fad { font-family:"Font Awesome 5 Duotone","FontAwesome" !important; font-weight:900 !important; }
  #accessibility .fab { font-family:"Font Awesome 5 Brands","FontAwesome" !important; font-weight:400 !important; }
  #accessibility .fa  { font-family:"FontAwesome" !important; font-weight:normal !important; }
  #accessibility .fa-2x { font-size:2em !important; vertical-align:middle !important; }

  /* ══════════════════════════════════════════════════
     CONTENEDOR PRINCIPAL
     Fijo, z-index alto, sin dimensiones propias
     ══════════════════════════════════════════════════ */
  #accessibility {
    position: fixed !important;
    top: calc(12px + 1rem) !important;
    left: 18px !important;
    z-index: 10001 !important;
    display: block !important;
    font-size: 12px !important;
    font-family: "Open Sans", sans-serif !important;
    line-height: normal !important;
  }

  #accessibility .menu-container {
    position: relative !important;
    display: inline-block !important;
  }

  /* ══════════════════════════════════════════════════
     BOTÓN ÍCONO — círculo pequeño con ícono blanco
     (igual que el original: ícono claro sobre fondo)
     ══════════════════════════════════════════════════ */
  #accessibility .menu-btn {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 38px !important;
    height: 38px !important;
    color: #333 !important;
    cursor: pointer !important;
    text-decoration: none !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    line-height: 1 !important;
  }
  #accessibility .menu-btn:hover { color: #666 !important; }

  /* El ícono fa-universal-access usa .icon — color claro como el original */
  #accessibility .icon {
    color: cornflowerblue !important;   /* ← CORREGIDO: antes era #333 */
    transform: scale(1.3);
  }

  /* ══════════════════════════════════════════════════
     PANEL LATERAL — desliza desde izquierda
     Ancho 270px como el original (NO 230)
     ══════════════════════════════════════════════════ */
  #accessibility .menu-slide {
    position: fixed !important;
    top: 0 !important;
    left: -270px !important;           /* ← CORREGIDO: antes -230px */
    width: 270px !important;            /* ← CORREGIDO: antes 230px */
    height: 100vh !important;
    background-color: #e0e0e0 !important;
    z-index: 10000 !important;
    overflow-y: auto !important;
    opacity: 0 !important;
    transition: transform 0.3s ease-in-out, opacity 0.2s ease-in-out !important;
    margin: 0 !important;
    padding: 0 !important;
    pointer-events: none !important;
  }

  /* Hover sobre el contenedor O el panel mismo mantiene abierto */
  #accessibility .menu-container:hover .menu-slide,
  #accessibility .menu-slide:hover {
    transform: translate(270px, 0) !important;   /* ← CORREGIDO: antes 230px */
    opacity: 1 !important;
    pointer-events: auto !important;
  }

  /* ══════════════════════════════════════════════════
     LISTA DE OPCIONES — con padding como el original
     ══════════════════════════════════════════════════ */
  #accessibility .menu-slide ul {
    padding: 20px !important;            /* ← NUEVO: igual que el original */
    margin: 0 !important;
    list-style: none !important;
  }

  #accessibility .accesibility {
    list-style: none !important;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
  }

  /*
   * Reset manual de los li (sin all:revert) y con margen inferior de 15px
   */
  #accessibility .accesibility > li {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    flex-wrap: nowrap !important;
    width: 100% !important;
    min-height: 50px !important;
    padding: 0 !important;
    margin: 0 0 15px 0 !important;        /* ← NUEVO: separación vertical */
    border: none !important;
    outline: none !important;
    list-style: none !important;
    background: transparent !important;
    cursor: pointer !important;
    box-sizing: border-box !important;
    text-align: left !important;
    position: relative !important;
    transition: background 0.4s linear !important;
    font-family: "Open Sans", sans-serif !important;
    font-size: 12px !important;
    color: inherit !important;
    text-decoration: none !important;
    line-height: normal !important;
  }
  /* Quitar margen inferior al último elemento */
  #accessibility .accesibility > li:last-child {
    margin-bottom: 0 !important;
  }

  #accessibility .accesibility > li:hover {
    background-color: rgba(0, 0, 0, 0.05) !important;
  }

  /* ── Cuadro ícono: 40×40 con borde redondeado izquierdo ── */
  #accessibility .accesibility > li .icons {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    float: none !important;
    width: 40px !important;               /* ← CORREGIDO: antes 50px */
    height: 40px !important;              /* ← CORREGIDO: antes 50px */
    min-width: 40px !important;
    min-height: 40px !important;
    color: #fff !important;
    background-color: #9d2449 !important;
    box-shadow: -2px -2px 5px #fff, 3px 3px 5px rgba(0, 0, 0, 0.1) !important;
    border-radius: 5px 0 0 5px !important;
    padding: 0 !important;
    margin: 0 !important;
    font-size: 14px !important;
    line-height: 1 !important;
  }

  /* ── Label de texto: padding de 10px como el original ── */
  #accessibility .accesibility > li > span.item-label {
    display: inline-block !important;
    flex: 1 1 0 !important;
    min-width: 0 !important;
    color: #9d2449 !important;
    font-family: "Roboto", sans-serif !important;
    font-size: 13px !important;
    font-weight: normal !important;
    line-height: 1.35 !important;
    white-space: normal !important;
    word-break: break-word !important;
    text-decoration: none !important;
    padding: 10px !important;              /* ← CORREGIDO: antes 8px 10px */
    margin: 0 !important;
    align-self: center !important;
    vertical-align: middle !important;
  }

  /* ── Opacidad: inactivo 0.5, activo 1 ── */
  #accessibility .icon-box {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    width: 100% !important;
    min-height: 50px !important;
    opacity: 0.5 !important;
  }
  #accessibility .icon-box.icon-box-active {
    opacity: 1 !important;
  }

  /* ── Restablecer — fondo rojo completo, siempre opaco ── */
  #accessibility .icon-box-simple-reset {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    width: 100% !important;
    min-height: 50px !important;
    opacity: 1 !important;
    background-color: #9d2449 !important;
    box-shadow: -2px -2px 5px #fff, 3px 3px 5px rgba(0, 0, 0, 0.1) !important;
    border-radius: 5px !important;
    color: #fff !important;
    cursor: pointer !important;
  }
  #accessibility .icon-box-simple-reset:hover {
    opacity: 0.88 !important;
  }
  #accessibility .icon-box-simple-reset > span.item-label {
    color: #fff !important;
  }

  /* ── Fila "Cambiar tamaño": dos botones inline + label ── */
  #accessibility .row-font {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    flex-wrap: nowrap !important;
    gap: 6px !important;
    padding: 0 8px !important;
    min-height: 50px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  #accessibility .btn-font {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 2px !important;
    flex-shrink: 0 !important;
    color: #fff !important;
    background-color: #9d2449 !important;
    box-shadow: -2px -2px 5px #fff, 3px 3px 5px rgba(0, 0, 0, 0.1) !important;
    border-radius: 5px !important;
    border: none !important;
    padding: 5px 8px !important;          /* ← CORREGIDO: antes 5px 7px */
    min-width: auto !important;            /* ← CORREGIDO: quitar ancho fijo */
    height: auto !important;               /* ← CORREGIDO: quitar alto fijo */
    cursor: pointer !important;
    font-size: 11px !important;
    opacity: 0.5 !important;               /* ← CORREGIDO: antes 0.75 */
    line-height: 1.2 !important;
  }
  #accessibility .btn-font:hover {
    opacity: 1 !important;
  }
  #accessibility .row-font > span.item-label {
    align-self: center !important;
    padding: 0 6px !important;
  }

  /* ── Checkboxes: completamente ocultos pero accesibles ── */
  #accessibility input[type="checkbox"] {
    position: absolute !important;
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
    pointer-events: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  /* ── Dots de progreso (espaciado v/h) ── */
  #accessibility .progress-dots {
    display: inline-flex !important;
    align-items: center !important;
    gap: 3px !important;
    flex-shrink: 0 !important;
    padding-right: 8px !important;
    margin-left: auto !important;
  }
  #accessibility .step-dot {
    display: inline-block !important;
    width: 20px !important;
    height: 7px !important;
    border: 1px solid #aaa !important;
    background: #ccc !important;
    padding: 0 !important;
    margin: 0 !important;
    flex-shrink: 0 !important;
    box-sizing: border-box !important;
  }
  #accessibility .step-dot.active {
    border-color: #9d2449 !important;
    background: #7a1b33 !important;
  }

  /* ══════════════════════════════════════════════════
     MEDIA QUERY PARA MÓVIL (botón más a la derecha)
     ══════════════════════════════════════════════════ */
  @media only screen and (max-width: 768px) {
    #accessibility .menu-container .menu-btn {
      left: 157px !important;               /* ← NUEVO: igual que el original */
    }
  }

  /* ══════════════════════════════════════════════════
     ESTILOS GLOBALES — en body, persisten con Vue Router
     ══════════════════════════════════════════════════ */

  body.gobmx-grayscale { filter: grayscale(100%) !important; }
  body.gobmx-contrast  { filter: invert(100%) hue-rotate(180deg) !important; }
  body.gobmx-grayscale.gobmx-contrast { filter: grayscale(100%) invert(100%) !important; }

  body.cursor-big, body.cursor-big * {
    cursor: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyOS4xODhweCIgaGVpZ2h0PSI0My42MjVweCIgdmlld0JveD0iMCAwIDI5LjE4OCA0My42MjUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI5LjE4OCA0My42MjUiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iI0Q5REFEOSIgc3Ryb2tlLXdpZHRoPSIxLjE0MDYiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRzPSIyLjgsNC41NDkgMjYuODQ3LDE5LjkwMiAxNi45NjQsMjIuNzAxIDI0LjIzOSwzNy43NDkgMTguMjc4LDQyLjAxNyA5Ljc0MSwzMC43MjQgMS4xMzgsMzUuODA5ICIvPjwvZz48L3N2Zz4=") 0 0, auto !important;
  }

  a.highlight-accessibility {
    background-color: #ff0 !important;
    color: #000 !important;
    text-decoration: underline !important;
  }

  .gobmx-dyslexia { font-family: "open_dyslexic" !important; }

  /* Separador de lectura */
  #gobmx-separator {
    position: fixed !important;
    left: 0; top: -10px;
    width: 100% !important;
    height: 4px !important;
    background: #7a1b33 !important;
    z-index: 2147483646 !important;
    pointer-events: none !important;
    display: none !important;
  }
  #gobmx-separator.active { display: block !important; }

  /* Máscaras */
  #gobmx-mask-top, #gobmx-mask-bottom {
    position: fixed !important;
    left: 0;
    width: 100% !important;
    background: rgba(0,0,0,0.5) !important;
    z-index: 2147483645 !important;
    pointer-events: none !important;
    display: none !important;
  }
  #gobmx-mask-top    { top: 0; height: 40%; }
  #gobmx-mask-bottom { top: 60%; height: 100%; }
  .gobmx-mask-edge-t { position:absolute; bottom:0; left:0; width:100%; height:8px; background:#B38D5D; }
  .gobmx-mask-edge-b { position:absolute; top:0;    left:0; width:100%; height:8px; background:#7A1B33; }
  #gobmx-mask-top.active,
  #gobmx-mask-bottom.active { display: block !important; }
`

export default {
  name: 'GobMxAccesibilidad',
  emits: ['loaded', 'error'],

  data() {
    return {
      state: {
        grayscale: LS.get('activeGrayScale'),
        contrast: LS.get('activeContrast'),
        audio: LS.get('activeAudio'),
        cursor: LS.get('activeCursor'),
        mask: LS.get('activeMask'),
        lineRead: LS.get('activeLineRead'),
        dyslexia: LS.get('lsDislexia'),
        highlight: LS.get('lsResaltar'),
        spacingV: 0,
        spacingH: 0,
        fontSize: 0,
      },
      _observer: null,
      _debounceTimer: null,
      _onMouseMove: null,
      _onHover: null,
      _onLeave: null,
    }
  },

  mounted() {
    this._injectStyles()
    this._loadFA()
    this._buildDOM()
    this._applyAllToDocument()
    this._watchDOM()
  },

  beforeUnmount() {
    this._cleanup()
  },

  methods: {
    // ── CSS ──────────────────────────────────────────────────────
    _injectStyles() {
      if (document.getElementById('gobmx-css')) return
      const s = document.createElement('style')
      s.id = 'gobmx-css'
      s.textContent = WIDGET_CSS
      document.head.appendChild(s)
    },

    // ── Font Awesome ─────────────────────────────────────────────
    _loadFA() {
      const add = (id, href) => {
        if (document.getElementById(id)) return
        const l = Object.assign(document.createElement('link'), { id, rel: 'stylesheet', href })
        document.head.appendChild(l)
      }
      add('gobmx-fa5', 'https://kit-pro.fontawesome.com/releases/v5.15.4/css/pro.min.css')
      add(
        'gobmx-fa4',
        'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
      )
    },

    // ── Construir DOM ────────────────────────────────────────────
    _buildDOM() {
      if (document.getElementById('accessibility')) return

      const root = document.createElement('div')
      root.id = 'accessibility'
      root.innerHTML = `
        <div class="menu-container">

          <a href="#" class="menu-btn" aria-label="Menú de accesibilidad">
            <i class="icon fad fa-universal-access fa-2x" aria-hidden="true"></i>
          </a>

          <nav class="menu-slide" aria-label="Opciones de accesibilidad">
            <ul class="accesibility">

              <li class="icon-box-simple-reset reset" role="button" tabindex="0">
                <i class="fas fa-reply-all fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Restablecer</span>
              </li>

              <li class="icon-box BlackAndWhite" role="button" tabindex="0">
                <input type="checkbox" id="g-escala">
                <i class="fas fa-adjust fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Cambiar escala de grises</span>
              </li>

              <li class="icon-box lector-li" role="button" tabindex="0">
                <input type="checkbox" id="g-lector">
                <i class="fas fa-assistive-listening-systems fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Usar un lector de pantalla</span>
              </li>

              <li class="icon-box cCursor" role="button" tabindex="0">
                <input type="checkbox" id="g-cursor">
                <i class="fas fa-mouse-pointer fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Cambiar tamaño de cursor</span>
              </li>

              <li class="icon-box contraste-li" role="button" tabindex="0">
                <input type="checkbox" id="g-contraste">
                <i class="fas fa-palette fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Cambiar el contraste de color</span>
              </li>

              <li class="icon-box mask-li" role="button" tabindex="0">
                <input type="checkbox" id="g-mask">
                <i class="fas fa-grip-lines fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Mascara de lectura</span>
              </li>

              <li class="icon-box linread-li" role="button" tabindex="0">
                <input type="checkbox" id="g-guia">
                <i class="fas fa-underline fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Guia de Lectura</span>
              </li>

              <li class="icon-box dislexia-li" role="button" tabindex="0">
                <input type="checkbox" id="g-dislexia">
                <i class="fas fa-italic fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Cambio de tipografia dislexia</span>
              </li>

              <li class="icon-box spacingv-li" role="button" tabindex="0">
                <input type="checkbox" id="g-sv">
                <i class="fas fa-text-height fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Espaciado vertical</span>
                <div class="progress-dots">
                  <span class="step-dot sv1"></span>
                  <span class="step-dot sv2"></span>
                  <span class="step-dot sv3"></span>
                </div>
              </li>

              <li class="icon-box spacingh-li" role="button" tabindex="0">
                <input type="checkbox" id="g-sh">
                <i class="fas fa-text-width fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Espaciado Horizontal</span>
                <div class="progress-dots">
                  <span class="step-dot sh1"></span>
                  <span class="step-dot sh2"></span>
                  <span class="step-dot sh3"></span>
                </div>
              </li>

              <li class="icon-box icon-box-active row-font" role="group" aria-label="Cambiar tamaño de fuente">
                <div class="btn-font dec-font" role="button" tabindex="0" aria-label="Reducir fuente">
                  <i class="fas fa-text-size" aria-hidden="true"></i>
                  <i class="fas fa-minus" aria-hidden="true"></i>
                </div>
                <div class="btn-font inc-font" role="button" tabindex="0" aria-label="Aumentar fuente">
                  <i class="fas fa-text-size" aria-hidden="true"></i>
                  <i class="fas fa-plus" aria-hidden="true"></i>
                </div>
                <span class="item-label">Cambiar tamaño</span>
              </li>

              <li class="icon-box resaltar-li" role="button" tabindex="0">
                <input type="checkbox" id="g-resaltar">
                <i class="fas fa-highlighter fa-2x icons" aria-hidden="true"></i>
                <span class="item-label">Resaltar Enlaces</span>
              </li>

            </ul>
          </nav>
        </div>
      `
      document.body.appendChild(root)

      // Separador y máscaras
      if (!document.getElementById('gobmx-separator')) {
        const sep = document.createElement('div')
        sep.id = 'gobmx-separator'
        document.body.appendChild(sep)
      }
      if (!document.getElementById('gobmx-mask-top')) {
        const mt = document.createElement('div')
        mt.id = 'gobmx-mask-top'
        mt.innerHTML = '<div class="gobmx-mask-edge-t"></div>'
        const mb = document.createElement('div')
        mb.id = 'gobmx-mask-bottom'
        mb.innerHTML = '<div class="gobmx-mask-edge-b"></div>'
        document.body.appendChild(mt)
        document.body.appendChild(mb)
      }

      this._bindEvents()
      this.$emit('loaded')
    },

    // ── Eventos ──────────────────────────────────────────────────
    _bindEvents() {
      const q = (s) => document.querySelector(`#accessibility ${s}`)

      q('.menu-btn')?.addEventListener('click', (e) => e.preventDefault())
      q('.reset')?.addEventListener('click', () => this._doReset())
      q('.BlackAndWhite')?.addEventListener('click', () =>
        this._toggle('grayscale', 'activeGrayScale'),
      )
      q('.lector-li')?.addEventListener('click', () => this._toggleAudio())
      q('.cCursor')?.addEventListener('click', () => this._toggle('cursor', 'activeCursor'))
      q('.contraste-li')?.addEventListener('click', () =>
        this._toggle('contrast', 'activeContrast'),
      )
      q('.mask-li')?.addEventListener('click', () => this._toggleMask())
      q('.linread-li')?.addEventListener('click', () => this._toggleLineRead())
      q('.dislexia-li')?.addEventListener('click', () => this._toggle('dyslexia', 'lsDislexia'))
      q('.resaltar-li')?.addEventListener('click', () => this._toggle('highlight', 'lsResaltar'))
      q('.spacingv-li')?.addEventListener('click', () => this._cycleSpacing('V'))
      q('.spacingh-li')?.addEventListener('click', () => this._cycleSpacing('H'))
      q('.inc-font')?.addEventListener('click', (e) => {
        e.stopPropagation()
        this._fontSize(1)
      })
      q('.dec-font')?.addEventListener('click', (e) => {
        e.stopPropagation()
        this._fontSize(-1)
      })

      // Ratón para máscara y guía
      document.addEventListener(
        'mousemove',
        (this._onMouseMove = (e) => {
          if (this.state.mask) {
            const t = document.getElementById('gobmx-mask-top')
            const b = document.getElementById('gobmx-mask-bottom')
            if (t) t.style.height = Math.max(0, e.clientY - 30) + 'px'
            if (b) b.style.top = e.clientY + 30 + 'px'
          }
          if (this.state.lineRead) {
            const sep = document.getElementById('gobmx-separator')
            if (sep) sep.style.top = e.pageY + 10 + 'px'
          }
        }),
      )

      // Lector de pantalla
      document.addEventListener(
        'mouseenter',
        (this._onHover = (e) => {
          if (!this.state.audio) return
          const TAGS = [
            'P',
            'H1',
            'H2',
            'H3',
            'H4',
            'SPAN',
            'LI',
            'A',
            'IMG',
            'DD',
            'DT',
            'BLOCKQUOTE',
          ]
          if (!TAGS.includes(e.target?.tagName)) return
          const text = (e.target.tagName === 'IMG' ? e.target.alt : e.target.textContent)?.trim()
          if (text) {
            window.speechSynthesis?.cancel()
            window.speechSynthesis?.speak(new SpeechSynthesisUtterance(text))
          }
        }),
        true,
      )

      document.addEventListener(
        'mouseleave',
        (this._onLeave = () => {
          if (this.state.audio) window.speechSynthesis?.cancel()
        }),
        true,
      )
    },

    // ── MutationObserver (DEBOUNCED + solo nodos nuevos) ─────────
    _watchDOM() {
      const appRoot = document.getElementById('app') || document.body

      this._observer = new MutationObserver((mutations) => {
        clearTimeout(this._debounceTimer)
        this._debounceTimer = setTimeout(() => {
          const newNodes = []
          for (const m of mutations) {
            for (const node of m.addedNodes) {
              if (isWidget(node)) continue
              newNodes.push(node)
            }
          }
          if (newNodes.length > 0) this._applyToNodes(newNodes)
        }, 80)
      })

      this._observer.observe(appRoot, { childList: true, subtree: true })
    },

    // ── Aplicar a nodos nuevos solamente ─────────────────────────
    _applyToNodes(nodes) {
      for (const node of nodes) {
        if (node.nodeType !== 1) continue

        if (this.state.dyslexia) {
          const targets = node.matches(SEL_TEXT)
            ? [node, ...node.querySelectorAll(SEL_TEXT)]
            : node.querySelectorAll(SEL_TEXT)
          targets.forEach((el) => {
            if (!isWidget(el)) el.classList.add('gobmx-dyslexia')
          })
        }

        if (this.state.highlight) {
          const links =
            node.tagName === 'A'
              ? [node, ...node.querySelectorAll('a')]
              : node.querySelectorAll('a')
          links.forEach((a) => {
            if (!isWidget(a)) a.classList.add('highlight-accessibility')
          })
        }

        if (this.state.cursor) {
          const links =
            node.tagName === 'A'
              ? [node, ...node.querySelectorAll('a')]
              : node.querySelectorAll('a')
          links.forEach((a) => {
            if (!isWidget(a)) a.classList.add('cursor_pointer')
          })
        }

        const spacingTargets = node.matches(SEL_SPACING)
          ? [node, ...node.querySelectorAll(SEL_SPACING)]
          : node.querySelectorAll(SEL_SPACING)

        spacingTargets.forEach((el) => {
          if (isWidget(el)) return
          if (this.state.spacingV > 0) {
            el.style.lineHeight = ['', '200%', '300%', '400%'][this.state.spacingV]
          }
          if (this.state.spacingH > 0) {
            el.style.letterSpacing = ['', '5px', '8px', '10px'][this.state.spacingH]
          }
          if (this.state.fontSize !== 0) {
            if (!el.dataset.gobmxBase) {
              el.dataset.gobmxBase = parseFloat(window.getComputedStyle(el).fontSize)
            }
            const n = parseFloat(el.dataset.gobmxBase) + this.state.fontSize
            if (n >= 10 && n <= 32) el.style.fontSize = n + 'px'
          }
        })
      }
    },

    // ── Aplicar todo al documento completo (al montar) ───────────
    _applyAllToDocument() {
      document.body.classList.toggle('gobmx-grayscale', this.state.grayscale)
      document.body.classList.toggle('gobmx-contrast', this.state.contrast)
      document.body.classList.toggle('cursor-big', this.state.cursor)

      document.querySelectorAll(SEL_TEXT).forEach((el) => {
        if (isWidget(el)) return
        el.classList.toggle('gobmx-dyslexia', this.state.dyslexia)
      })

      document.querySelectorAll('a').forEach((a) => {
        if (isWidget(a)) return
        a.classList.toggle('highlight-accessibility', this.state.highlight)
        a.classList.toggle('cursor_pointer', this.state.cursor)
      })

      document.querySelectorAll(SEL_SPACING).forEach((el) => {
        if (isWidget(el)) return
        el.style.lineHeight =
          this.state.spacingV > 0 ? ['', '200%', '300%', '400%'][this.state.spacingV] : ''
        el.style.letterSpacing =
          this.state.spacingH > 0 ? ['', '5px', '8px', '10px'][this.state.spacingH] : ''
      })

      if (this.state.fontSize !== 0) {
        document.querySelectorAll(SEL_TEXT).forEach((el) => {
          if (isWidget(el)) return
          if (!el.dataset.gobmxBase)
            el.dataset.gobmxBase = parseFloat(window.getComputedStyle(el).fontSize)
          const n = parseFloat(el.dataset.gobmxBase) + this.state.fontSize
          if (n >= 10 && n <= 32) el.style.fontSize = n + 'px'
        })
      }

      document.getElementById('gobmx-mask-top')?.classList.toggle('active', this.state.mask)
      document.getElementById('gobmx-mask-bottom')?.classList.toggle('active', this.state.mask)
      document.getElementById('gobmx-separator')?.classList.toggle('active', this.state.lineRead)

      this._syncUI()
    },

    // ── Toggles ──────────────────────────────────────────────────
    _toggle(key, lsKey) {
      this.state[key] = !this.state[key]
      LS.set(lsKey, this.state[key])

      if (key === 'grayscale')
        document.body.classList.toggle('gobmx-grayscale', this.state.grayscale)
      if (key === 'contrast') document.body.classList.toggle('gobmx-contrast', this.state.contrast)

      if (key === 'cursor') {
        document.body.classList.toggle('cursor-big', this.state.cursor)
        document.querySelectorAll('a').forEach((a) => {
          if (!isWidget(a)) a.classList.toggle('cursor_pointer', this.state.cursor)
        })
      }

      if (key === 'dyslexia') {
        document.querySelectorAll(SEL_TEXT).forEach((el) => {
          if (!isWidget(el)) el.classList.toggle('gobmx-dyslexia', this.state.dyslexia)
        })
      }

      if (key === 'highlight') {
        document.querySelectorAll('a').forEach((a) => {
          if (!isWidget(a)) a.classList.toggle('highlight-accessibility', this.state.highlight)
        })
      }

      this._syncUI()
    },

    _toggleAudio() {
      this.state.audio = !this.state.audio
      LS.set('activeAudio', this.state.audio)
      if (this.state.audio)
        window.speechSynthesis?.speak(new SpeechSynthesisUtterance('Audio activado'))
      else window.speechSynthesis?.cancel()
      this._syncUI()
    },

    _toggleMask() {
      this.state.mask = !this.state.mask
      LS.set('activeMask', this.state.mask)
      document.getElementById('gobmx-mask-top')?.classList.toggle('active', this.state.mask)
      document.getElementById('gobmx-mask-bottom')?.classList.toggle('active', this.state.mask)
      this._syncUI()
    },

    _toggleLineRead() {
      this.state.lineRead = !this.state.lineRead
      LS.set('activeLineRead', this.state.lineRead)
      document.getElementById('gobmx-separator')?.classList.toggle('active', this.state.lineRead)
      this._syncUI()
    },

    _cycleSpacing(axis) {
      const key = axis === 'V' ? 'spacingV' : 'spacingH'
      this.state[key] = (this.state[key] + 1) % 4
      const vals = axis === 'V' ? ['', '200%', '300%', '400%'] : ['', '5px', '8px', '10px']
      const prop = axis === 'V' ? 'lineHeight' : 'letterSpacing'
      const prefix = axis === 'V' ? 'sv' : 'sh'
      const val = vals[this.state[key]]

      document.querySelectorAll(SEL_SPACING).forEach((el) => {
        if (!isWidget(el)) el.style[prop] = val
      })
      ;[1, 2, 3].forEach((i) => {
        document
          .querySelector(`#accessibility .${prefix}${i}`)
          ?.classList.toggle('active', this.state[key] >= i)
      })
      this._syncUI()
    },

    _fontSize(delta) {
      this.state.fontSize = Math.max(-6, Math.min(10, this.state.fontSize + delta))
      document.querySelectorAll(SEL_TEXT).forEach((el) => {
        if (isWidget(el)) return
        if (!el.dataset.gobmxBase)
          el.dataset.gobmxBase = parseFloat(window.getComputedStyle(el).fontSize)
        const n = parseFloat(el.dataset.gobmxBase) + this.state.fontSize
        if (n >= 10 && n <= 32) el.style.fontSize = n + 'px'
      })
    },

    // ── Restablecer ──────────────────────────────────────────────
    _doReset() {
      Object.assign(this.state, {
        grayscale: false,
        contrast: false,
        audio: false,
        cursor: false,
        mask: false,
        lineRead: false,
        dyslexia: false,
        highlight: false,
        spacingV: 0,
        spacingH: 0,
        fontSize: 0,
      })
      ;[
        'activeGrayScale',
        'activeContrast',
        'activeAudio',
        'activeCursor',
        'activeMask',
        'activeLineRead',
        'lsDislexia',
        'lsResaltar',
      ].forEach((k) => LS.remove(k))

      document.body.classList.remove('gobmx-grayscale', 'gobmx-contrast', 'cursor-big')

      document.querySelectorAll(SEL_TEXT).forEach((el) => {
        if (isWidget(el)) return
        el.classList.remove('gobmx-dyslexia', 'highlight-accessibility', 'cursor_pointer')
        el.style.lineHeight =
          el.style.letterSpacing =
          el.style.fontSize =
          el.style.marginBottom =
            ''
        delete el.dataset.gobmxBase
      })

      document.querySelectorAll('a').forEach((a) => {
        if (!isWidget(a)) a.classList.remove('cursor_pointer', 'highlight-accessibility')
      })

      document.getElementById('gobmx-mask-top')?.classList.remove('active')
      document.getElementById('gobmx-mask-bottom')?.classList.remove('active')
      document.getElementById('gobmx-separator')?.classList.remove('active')
      window.speechSynthesis?.cancel()

      document
        .querySelectorAll('#accessibility .step-dot')
        .forEach((d) => d.classList.remove('active'))
      this._syncUI()
    },

    // ── Sincronizar UI ───────────────────────────────────────────
    _syncUI() {
      const q = (s) => document.querySelector(`#accessibility ${s}`)
      const setBox = (sel, on) => q(sel)?.classList.toggle('icon-box-active', on)

      setBox('.BlackAndWhite', this.state.grayscale)
      setBox('.contraste-li', this.state.contrast)
      setBox('.lector-li', this.state.audio)
      setBox('.cCursor', this.state.cursor)
      setBox('.mask-li', this.state.mask)
      setBox('.linread-li', this.state.lineRead)
      setBox('.dislexia-li', this.state.dyslexia)
      setBox('.resaltar-li', this.state.highlight)
      setBox('.spacingv-li', this.state.spacingV > 0)
      setBox('.spacingh-li', this.state.spacingH > 0)

      const cbMap = {
        '#g-escala': this.state.grayscale,
        '#g-contraste': this.state.contrast,
        '#g-lector': this.state.audio,
        '#g-cursor': this.state.cursor,
        '#g-mask': this.state.mask,
        '#g-guia': this.state.lineRead,
        '#g-dislexia': this.state.dyslexia,
        '#g-resaltar': this.state.highlight,
      }
      Object.entries(cbMap).forEach(([sel, val]) => {
        const el = q(sel)
        if (el) el.checked = val
      })
    },

    // ── Limpieza ────────────────────────────────────────────────
    _cleanup() {
      this._observer?.disconnect()
      clearTimeout(this._debounceTimer)
      window.speechSynthesis?.cancel()

      if (this._onMouseMove) document.removeEventListener('mousemove', this._onMouseMove)
      if (this._onHover) document.removeEventListener('mouseenter', this._onHover, true)
      if (this._onLeave) document.removeEventListener('mouseleave', this._onLeave, true)
      ;['accessibility', 'gobmx-separator', 'gobmx-mask-top', 'gobmx-mask-bottom'].forEach((id) =>
        document.getElementById(id)?.remove(),
      )
      ;['gobmx-css', 'gobmx-fa4', 'gobmx-fa5'].forEach((id) =>
        document.getElementById(id)?.remove(),
      )

      document.body.classList.remove('gobmx-grayscale', 'gobmx-contrast', 'cursor-big')
      document
        .querySelectorAll('.gobmx-dyslexia,.highlight-accessibility,.cursor_pointer')
        .forEach((el) => {
          el.classList.remove('gobmx-dyslexia', 'highlight-accessibility', 'cursor_pointer')
          el.style.lineHeight = el.style.letterSpacing = el.style.fontSize = ''
          delete el.dataset.gobmxBase
        })
    },
  },
}
</script>
