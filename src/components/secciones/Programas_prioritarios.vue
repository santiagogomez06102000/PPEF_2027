<!-- ─────────────────────────────────────────────────────────────────────────
  P_Prioritarios.vue
  Sección "Programas prioritarios" con carrusel infinito de pestañas.

  Usa TabsCarousel como componente hijo para el navegador de ejes.
  El contenido de cada pestaña se renderiza dinámicamente con <component>.
──────────────────────────────────────────────────────────────────────────── -->

<template>
  <section
    class="cubo-track grid grid-cols-6 gap-x-4"
    data-face-id="p_prioritarios"
    id="p_prioritarios"
  >
    <div class="tabs lg:col-start-2 lg:col-span-4 col-start-1 col-span-6">
      <h2>¿Qué proyectos se seguirán impulsando en 2027?</h2>
      <div class="flex items-center flex-col lg:flex-row">
        <div class="flex-1">
          <p>
            La política económica se continuará orientando en los tres pilares del modelo de desarrollo
            con bienestar, los cuales son:
          </p>

          <ul class="pilar-lista">
            <li>
              <strong>Fortalecimiento del ingreso de los hogares:</strong> Se conseguirá mediante
              aumentos al salario mínimo, transferencias directas y políticas de acceso efectivo a la
              salud, educación, vivienda y seguridad social.
            </li>
            <li>
              <strong>Inversión en infraestructura estratégica:</strong> Contribuirá a elevar la
              capacidad productiva, cerrar brechas regionales, detonar la inversión privada y fortalecer
              la soberanía económica.
            </li>
            <li>
              <strong>Responsabilidad fiscal:</strong> Contribuirá a sostener el desarrollo, preservar
              la estabilidad económica y garantizar que el Estado cuente con capacidad para proveer
              derechos universales, resolver fallas de mercado y promover el desarrollo nacional.
            </li>
          </ul>

          <p>
            Es por ello que se prevé la continuidad de los Programas para el Bienestar, el
            fortalecimiento de becas educativas, apoyo a mujeres, programas de salud y acciones
            orientadas a garantizar vivienda digna, con el objetivo de reforzar la capacidad de consumo
            de las familias, impulsar la demanda interna y generar condiciones más favorables para un
            crecimiento sostenido y con mayor participación social. Orientado a ello, se establecieron
            los siguientes Programas prioritarios, los cuales se encuentran alineados a los Ejes
            Generales y Ejes Transversales del Plan Nacional de Desarrollo.
            <Tooltip text="Fuente: PCGPE 2027, Pág 3,4, 38-40" :fuente>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="rgb(78, 191, 86)"
                class="bi bi-leaf-fill" viewBox="0 0 16 16">
                <path
                  d="M1.4 1.7c.217.289.65.84 1.725 1.274 1.093.44 2.885.774 5.834.528 2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045-.142-.162-.402-.102-.379.112.108.985 1.104 1.82 1.844 2.308 2.37 1.566 5.772-.118 7.6 3.071.505.8 1.374 2.7 1.75 4.292.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042 1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.124-.887-1.889-2.095-2.39-3.383-1-2.562-1-5.536-.65-7.28L.73.806z">
                </path>
              </svg>
            </Tooltip>
          </p>
        </div>
        <Mascota :mascota="7" alto="15rem" ancho="15rem"/>
      </div>

      <div class="demo">
        <!--
          TabsCarousel
          ────────────────────────────────────────────────────────────────────
          v-model         enlaza la pestaña activa con `currentTab`
          :tabs           objeto de configuración de pestañas
          aria-label      descripción para lectores de pantalla
          --tabs-fade-color  AJUSTAR si el fondo de .demo no es blanco.
                             El gradiente de difuminado debe coincidir con
                             el color de fondo real de esta sección.
        -->
        <TabsCarousel
          class="space"
          v-model="currentTab"
          :tabs="tabs"
          aria-label="Ejes de programas prioritarios"
          style="--tabs-fade-color: rgb(255, 255, 255)"
        />

        <!-- Contenido de la pestaña activa -->
        <component :is="tabs[currentTab].component" :key="currentTab" class="tab-content" />
      </div>
    </div>
  </section>
</template>

<script setup>
// ─── ANTES: 7 imports de componentes distintos ───────────────────────────
// import Eje_G_1 from '@/components/secciones/tabs/Eje_G_1.vue'
// import Eje_G_2 from '@/components/secciones/tabs/Eje_G_2.vue'
// ... (eliminar todos)

// ─── DESPUÉS: 1 import + defineAsyncComponent para instancias separadas ──
import { ref, defineAsyncComponent, h } from 'vue'
import TabsCarousel from '@/components/secciones/TabsCarousel.vue'
import Tooltip from './Desempenio/Tooltip.vue'
import EjePrograms from '@/components/secciones/tabs/EjePrograms.vue'
import Mascota from '../utils/Mascota.vue'

const currentTab = ref('Eje_G_1')

// ── Configuración de cada eje ────────────────────────────────────────────
// Para añadir un nuevo eje: agregar una entrada aquí, nada más.
const EJE_CONFIG = {
  Eje_G_1: {
    label: 'Eje General 1',
    titulo: 'Eje General 1: Gobernanza con justicia y participación ciudadana',
    descripcion:
      'Fortalece la legalidad, la seguridad, la transparencia y la rendición de cuentas, promoviendo la participación social en la toma de decisiones para consolidar un gobierno cercano al pueblo.',
    imagen: 'secciones/programas/images/eje1_gobernanza.png',
    jsonPath: 'secciones/programas/eje_1.json',
  },
  Eje_G_2: {
    label: 'Eje General 2',
    titulo: 'Eje General 2: Bienestar, desarrollo económico y social',
    descripcion:
      'Coloca a las personas en el centro de la acción pública mediante políticas sociales que reducen desigualdades y garantizan derechos para mejorar la calidad de vida.',
    imagen: 'secciones/programas/images/eje2_bienestar.png',
    jsonPath: 'secciones/programas/eje_2.json',
  },
  Eje_G_3: {
    label: 'Eje General 3',
    titulo: 'Eje General 3: Transformación del Estado',
    descripcion:
      'Impulsa el crecimiento económico con equidad, el empleo digno, el fortalecimiento del mercado interno y el desarrollo productivo con responsabilidad social.',
    imagen: 'secciones/programas/images/eje3_trabajo.png',
    jsonPath: 'secciones/programas/eje_3.json',
  },
  Eje_G_4: {
    label: 'Eje General 4',
    titulo: 'Eje General 4: Soberanía, seguridad y defensa',
    descripcion:
      'Promueve la protección del ambiente, el uso responsable de los recursos naturales y modelos sostenibles que aseguren el bienestar presente y futuro.',
    imagen: 'secciones/programas/images/eje4_sustentable.png',
    jsonPath: 'secciones/programas/eje_4.json',
  },
  Eje_T_1: {
    label: 'Eje Transversal 1',
    titulo: 'Eje Transversal 1: Igualdad de género',
    descripcion: 'Integra la perspectiva de género para garantizar igualdad de oportunidades y una vida libre de violencias.',
    imagen: 'secciones/programas/images/trans_1.png',
    jsonPath: 'secciones/programas/eje_5.json',
  },
  Eje_T_2: {
    label: 'Eje Transversal 2',
    titulo: 'Eje Transversal 2: Inclusión y no discriminación',
    descripcion: 'Fortalece la digitalización, la ciencia y la innovación como motores del desarrollo y la modernización gubernamental.',
    imagen: 'secciones/programas/images/trans_2.png',
    jsonPath: 'secciones/programas/eje_6.json',
  },
  Eje_T_3: {
    label: 'Eje Transversal 3',
    titulo: 'Eje Transversal 3: Territorio y desarrollo sostenible',
    descripcion: 'Reconoce sus derechos, territorios y culturas, incorporándolos en la planeación nacional con enfoque de inclusión y libre determinación.',
    imagen: 'secciones/programas/images/trans_3.png',
    jsonPath: 'secciones/programas/eje_7.json',
  },
}

// ── Construir el objeto `tabs` que consume TabsCarousel ──────────────────
// Cada entrada tiene `label` y `component`.
// Se usa h() en lugar de un componente separado por eje para pasar los
// props específicos de cada eje sin crear 7 archivos.
const tabs = Object.fromEntries(
  Object.entries(EJE_CONFIG).map(([key, cfg]) => [
    key,
    {
      label: cfg.label,
      // Función de render: devuelve EjePrograms con los props del eje.
      // Vue trata esta función exactamente igual que un SFC.
      component: {
        render: () =>
          h(EjePrograms, {
            titulo: cfg.titulo,
            descripcion: cfg.descripcion,
            imagen: cfg.imagen,
            jsonPath: cfg.jsonPath,
          }),
      },
    },
  ]),
)
</script>
<style scoped>
/* ── Contenedor del demo ──────────────────────────────────────────────────── */
.demo {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 2em;
  margin-bottom: 40px;
}

.tabs {
  margin: 0 !important;
}

.space {
  margin: 10px 0 40px 0;
}

/* ── Contenido de la pestaña activa ──────────────────────────────────────── */
/*
  padding-top crea separación visual entre el carrusel y el contenido.
  Si el tab activo cubre el border-bottom con margin-bottom: -1px (ver
  TabsCarousel.vue), aquí no se necesita un border-top adicional.
  Añadirlo si el diseño lo requiere:  border-top: 1px solid #e5e7eb;
*/
/* ── Contenido de la pestaña activa ──────────────────────────────────────── */
.tab-content {
  padding-top: 20px;
  width: 100%;
  min-width: 0;          /* ← clave: permite que el grid padre lo encoja */
  overflow-x: hidden;    /* evita scroll horizontal por elementos grandes */
}

/* Asegura que cualquier imagen o tabla dentro no rompa el layout */
.tab-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
}

.tab-content :deep(table) {
  display: block;
  width: 100%;
  overflow-x: auto;
}
/* Texto */

.pilar-lista {
  font-size: clamp(16px, 2.5vw, 1.2rem);
  font-family: 'Noto Sans', sans-serif;
  color: black;
  text-align: justify;
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
  list-style-type: disc;        /* ← Viñetas de círculo • */
}

.pilar-lista li {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.pilar-lista li strong {
  color: black;
}
#p_prioritarios{
  color: #06a5c1
}

</style>
