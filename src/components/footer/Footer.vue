
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppIcons from './AppIcons.vue';

// Interfaces
interface Logo {
  img: string;
  url: string;
  descripcion: string;
}

interface Item {
  descripcion: string;
  url?: string;
  icon?: string;
}

interface Seccion {
  titulo: string;
  items: Item[];
  display?: string;
  columns?: string;
}

interface Config {
  bg: string;
  color: string;
}

interface DatosFooter {
  logo: Logo;
  secciones: Seccion[];
  config: Config;
}

// Estado
const datos = ref<DatosFooter | null>(null);

// Cargar configuración
//@ts-ignore
const urlBase = "/work/models/PTP/NPTP/PTP_Layout/"
async function cargarFooter(): Promise<void> {
  try {
    const response = await fetch(
      `${urlBase}footer/footer.json`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    datos.value = await response.json() as DatosFooter | null;
  } catch (error) {
    console.error('Error al cargar el footer:', error);
    datos.value = null;
  }
}

onMounted(() => {
  cargarFooter();
});
</script>

<template>
  <main>
    <footer
      v-if="datos"
      class="footer-contenedor"
      :style="{
        '--columnas-footer': datos.secciones.length + 1,
        '--bg-footer': datos.config.bg,
        '--color-footer': datos.config.color
      }"
    >
      <article class="footer">

        <!-- Logo -->
        <section class="footer-columna">
          <a
            :href="datos.logo.url"
            target="_blank"
            rel="noopener noreferrer"
            :title="datos.logo.descripcion"
            class="flex items-center justify-center"
          >
            <img
              :src="datos.logo.img"
              :alt="datos.logo.descripcion"
              class="logo-hacienda"
            />
          </a>
        </section>

        <!-- Secciones -->
        <section
          v-for="item in datos.secciones"
          :key="item.titulo"
          class="footer-columna"
        >
          <h2 class="titulo-seccion-footer">
            {{ item.titulo }}
          </h2>

          <ul
            class="lista"
            :style="{
              '--lista-display': item.display ?? 'block',
              '--lista-cols': item.columns ?? '1'
            }"
          >
            <li
              v-for="subitem in item.items"
              :key="subitem.url ?? subitem.descripcion"
              class="lista-item"
            >
              <a
                v-if="subitem.url"
                :href="subitem.url"
                :class="{
                  'enlace': !subitem.icon,
                  'enlace-icono': !!subitem.icon
                }"
              >
                <AppIcons
                  v-if="subitem.icon"
                  class="icono"
                  :icon="subitem.icon"
                />

                <template v-else>
                  {{ subitem.descripcion }}
                </template>
              </a>

              <template v-else>
                {{ subitem.descripcion }}
              </template>
            </li>
          </ul>
        </section>

      </article>
    </footer>
  </main>
</template>

<style scoped>
.footer-contenedor {
  background-color: var(--bg-footer);
  color: var(--color-footer);
  padding: 3rem 2.5rem;
}
.footer {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(var(--columnas-footer), minmax(0, 1fr));
  margin: auto;
  align-items: start;
  max-width: 70rem;
}
.logo-hacienda {
  max-height: 4rem;
}
.footer-columna {
  grid-column: span var(--columnas-footer);
  text-align: center;
}
.titulo-seccion-footer {
  font-size: 1rem;
  font-family: Patria, sans-serif;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}
.icono {
  font-size: 1.5rem;
}
.enlace-icono {
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 2.25rem;
  width: 2.25rem;
}
.enlace-icono:hover {
  transform: scale(1.1);
  background: #ffffff1a;
}
.lista {
  display: var(--lista-display);
  grid-template-columns: repeat(var(--lista-cols), minmax(0, 36px));
  gap: 0.8rem;
  justify-content: center;
}
.lista-item {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}
.enlace:hover {
  border-bottom: 1px solid;
}
@media (min-width: 1024px) {
  .footer-columna {
    grid-column: span 1;
    text-align: start;
  }
  .titulo-seccion-footer {
    text-align: start;
  }
  .lista {
    justify-content: start;
  }
}
</style>
