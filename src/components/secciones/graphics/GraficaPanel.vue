<!-- ─────────────────────────────────────────────────────────────────────────
  GraficaPanel.vue
  Panel centrado y reutilizable para mostrar la gráfica de un programa.

  ┌─ Uso ──────────────────────────────────────────────────────────────────┐
  │  <GraficaPanel                                                         │
  │    :programa="programaSeleccionado"                                    │
  │    :grafica-component="MiGraficaVue"                                   │
  │    @cerrar="programaSeleccionado = null"                               │
  │  />                                                                    │
  └────────────────────────────────────────────────────────────────────────┘

  ┌─ Props ────────────────────────────────────────────────────────────────┐
  │  programa          Object    Objeto del programa seleccionado.         │
  │                              { denominacion, decreto, url, … }        │
  │  graficaComponent  Component Componente Vue que renderiza la gráfica.  │
  │                              Recibe :programa como prop.              │
  └────────────────────────────────────────────────────────────────────────┘

  ┌─ Emits ────────────────────────────────────────────────────────────────┐
  │  cerrar   void   El usuario presionó el botón "Cerrar".               │
  └────────────────────────────────────────────────────────────────────────┘

  ┌─ Notas de diseño ──────────────────────────────────────────────────────┐
  │  • El panel usa una animación de entrada (fade + slide-up) con         │
  │    CSS @keyframes para que la aparición sea suave.                     │
  │  • La gráfica está dentro de un contenedor centrado con max-width      │
  │    controlable via --grafica-max-width (default: 720px).              │
  │  • El componente de gráfica recibe `programa` como prop, por lo que   │
  │    es agnóstico al tipo de visualización (Chart.js, D3, SVG, etc.).   │
  └────────────────────────────────────────────────────────────────────────┘
──────────────────────────────────────────────────────────────────────────── -->

<template>
  <Transition name="grafica-panel">
    <div v-if="programa" class="grafica-panel">

      <!-- Encabezado ─────────────────────────────────────────────────────── -->
      <div class="grafica-panel__header">

        <!-- Etiqueta decorativa + título del programa -->
        <div class="grafica-panel__title-group">
          <span class="grafica-panel__badge" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                 stroke-linejoin="round" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Visualización
          </span>
          <h4 class="grafica-panel__title">{{ programa.denominacion }}</h4>
        </div>

        <!-- Acciones del encabezado: enlaces + cerrar -->
        <div class="grafica-panel__actions">
          <!-- Enlace al Decreto (DOF) si existe -->
          <a
            v-if="programa.decreto"
            :href="programa.decreto"
            target="_blank"
            rel="noopener noreferrer"
            class="grafica-panel__link"
            title="Ver Decreto en el DOF"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Decreto
          </a>

          <!-- Enlace al Programa completo si existe -->
          <a
            v-if="programa.url"
            :href="programa.url"
            target="_blank"
            rel="noopener noreferrer"
            class="grafica-panel__link grafica-panel__link--primary"
            title="Ver Programa completo en el DOF"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Programa
          </a>

          <!-- Botón Cerrar -->
          <button
            class="grafica-panel__close"
            @click="emit('cerrar')"
            aria-label="Cerrar visualización"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                 stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Cerrar
          </button>
        </div>
      </div>

      <!-- Cuerpo: contenedor centrado de la gráfica ──────────────────────── -->
      <div class="grafica-panel__body">
        <!--
          Contenedor centrado con max-width configurable.
          La gráfica se renderiza aquí como componente dinámico.
          Recibe el objeto `programa` completo como prop para que
          cada gráfica pueda acceder a todos los metadatos que necesite.
        -->
        <div class="grafica-panel__chart-wrap">
          <component
            :is="graficaComponent"
            :programa="programa"
            class="grafica-panel__chart"
          />
        </div>
      </div>

    </div>
  </Transition>
</template>


<script setup>
// ─── Props ──────────────────────────────────────────────────────────────────
defineProps({
  /**
   * Objeto del programa seleccionado.
   * Mínimo esperado: { denominacion: string }
   * Opcional:        { decreto: string, url: string, … }
   */
  programa: {
    type: Object,
    default: null,
  },
  /**
   * Componente Vue que renderiza la gráfica.
   * Debe aceptar la prop `:programa`.
   * Ejemplo: import MiGrafica from '@/components/secciones/graphics/MiGrafica.vue'
   */
  graficaComponent: {
    type: [Object, Function],
    required: true,
  },
})

// ─── Emits ──────────────────────────────────────────────────────────────────
const emit = defineEmits(['cerrar'])
</script>


<style scoped>
/* ── Panel principal ──────────────────────────────────────────────────────── */
.grafica-panel {
  margin-top: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  overflow: hidden;

  /*
    Sombra sutil para elevar visualmente el panel y diferenciarlo del
    fondo de la sección.
  */
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 4px 16px rgba(0, 0, 0, 0.05);
}

/* ── Animación de entrada / salida ────────────────────────────────────────── */
/* Fade + deslizamiento hacia arriba al aparecer; inverso al desaparecer. */
.grafica-panel-enter-active {
  animation: grafica-in 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.grafica-panel-leave-active {
  animation: grafica-in 0.2s cubic-bezier(0.55, 0.06, 0.68, 0.19) reverse both;
}

@keyframes grafica-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Encabezado ───────────────────────────────────────────────────────────── */
.grafica-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;

  /* En mobile, apilar verticalmente */
  flex-wrap: wrap;
}

/* ── Grupo título (badge + h4) ────────────────────────────────────────────── */
.grafica-panel__title-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 0;
  min-width: 0; /* permite que h4 trunque con ellipsis */
}

/* Badge decorativo "Visualización" */
.grafica-panel__badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6366f1;
  background: #eef2ff;
  border-radius: 20px;
  padding: 3px 10px;
  width: fit-content;
}

/* Título del programa */
.grafica-panel__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

/* ── Acciones ─────────────────────────────────────────────────────────────── */
.grafica-panel__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

/* Enlace externo genérico */
.grafica-panel__link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.grafica-panel__link:hover {
  border-color: #94a3b8;
  color: #1e293b;
  background: #f1f5f9;
}

/* Variante destacada (Programa completo) */
.grafica-panel__link--primary {
  color: #1d4ed8;
  border-color: #bfdbfe;
  background: #eff6ff;
}

.grafica-panel__link--primary:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

/* Botón Cerrar */
.grafica-panel__close {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
  color: #ef4444;
  background: #fff0f0;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.grafica-panel__close:hover {
  background: #fee2e2;
  border-color: #f87171;
  color: #b91c1c;
}

/* ── Cuerpo del panel ─────────────────────────────────────────────────────── */
.grafica-panel__body {
  padding: 24px 20px;
  background: #ffffff;
}

/* ── Contenedor centrado de la gráfica ───────────────────────────────────── */
/*
  max-width configurable via --grafica-max-width.
  margin: 0 auto  →  centra horizontalmente el bloque.
  El componente hijo es responsable de su propia altura.
*/
.grafica-panel__chart-wrap {
  max-width: var(--grafica-max-width, 720px);
  width: 100%;
  margin: 0 auto;
  overflow-x: auto; /* scroll horizontal si la gráfica es más ancha */
}

/* Asegura que el componente hijo no desborde su contenedor */
.grafica-panel__chart :deep(*) {
  max-width: 100%;
}

/* ── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .grafica-panel__header {
    flex-direction: column;
    padding: 14px 16px;
  }

  .grafica-panel__actions {
    width: 100%;
    justify-content: flex-end;
  }

  .grafica-panel__body {
    padding: 16px;
  }
}
</style>
