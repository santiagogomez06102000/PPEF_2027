<template>
  <section class="ingreso">
    <h2 class="titulo">{{ datos.titulo }}</h2>

    <p class="intro">{{ datos.intro }}</p>

    <div class="monto-wrapper">
      <p class="monto">{{ datos.monto }}</p>
      <p class="unidad">{{ datos.unidad }}</p>
    </div>

    <p class="descripcion">{{ datos.descripcion }}</p>

    <div class="acordeon">

      <!-- COLUMNA IZQUIERDA -->
      <div class="columna">
        <div
          v-for="item in columnaIzquierda"
          :key="item.id"
          class="item"
          :class="{ abierto: activo === item.index }"
        >
          <button
            class="cabecera"
            @click="toggle(item.index)"
          >
            <div class="icono">
              <img src="@/assets/img_circle.png" alt="icono" />
            </div>

            <div class="info">
              <span class="item-titulo">
                {{ item.titulo }}
              </span>

              <span class="item-monto">
                {{ item.monto }}
              </span>
            </div>

            <span class="flecha" aria-hidden="true">
              <svg
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L7 7L13 1"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </button>

          <Transition name="desplegar">
            <div
              v-show="activo === item.index"
              class="panel"
            >
              <ul>
                <li
                  v-for="(linea, i) in item.contenido"
                  :key="i"
                  v-html="linea"
                />
              </ul>
            </div>
          </Transition>
        </div>
      </div>

      <!-- COLUMNA DERECHA -->
      <div class="columna">
        <div
          v-for="item in columnaDerecha"
          :key="item.id"
          class="item"
          :class="{ abierto: activo === item.index }"
        >
          <button
            class="cabecera"
            @click="toggle(item.index)"
          >
            <div class="icono">
              <img src="@/assets/img_circle.png" alt="icono" />
            </div>

            <div class="info">
              <span class="item-titulo">
                {{ item.titulo }}
              </span>

              <span class="item-monto">
                {{ item.monto }}
              </span>
            </div>

            <span class="flecha" aria-hidden="true">
              <svg
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L7 7L13 1"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </button>

          <Transition name="desplegar">
            <div
              v-show="activo === item.index"
              class="panel"
            >
              <ul>
                <li
                  v-for="(linea, i) in item.contenido"
                  :key="i"
                  v-html="linea"
                />
              </ul>
            </div>
          </Transition>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchPublicJson } from '../utils/utils'

const datos = ref({
  items: []
})

const activo = ref(0)

onMounted(async () => {
  datos.value = await fetchPublicJson(
    '/secciones/ingreso/ingreso.json'
  )
})

/*
 * Agregamos el índice original a cada elemento.
 * Esto permite que "activo" siga funcionando
 * aunque los elementos estén separados en dos columnas.
 */
const itemsConIndice = computed(() => {
  return (datos.value.items ?? []).map((item, index) => ({
    ...item,
    index
  }))
})

/*
 * Elementos pares:
 * 0, 2, 4, 6...
 */
const columnaIzquierda = computed(() => {
  return itemsConIndice.value.filter(
    item => item.index % 2 === 0
  )
})

/*
 * Elementos impares:
 * 1, 3, 5, 7...
 */
const columnaDerecha = computed(() => {
  return itemsConIndice.value.filter(
    item => item.index % 2 !== 0
  )
})

const toggle = (idx) => {
  activo.value = activo.value === idx ? null : idx
}
</script>

<style scoped>
.ingreso {
  background-color: #ffffff;
  color: #222;
}

/* ── Título ── */

.titulo {
  text-align: center;
  color: #00b4d8;
  margin-top: 12rem;
  margin-bottom: 1.2rem;
  font-family: 'Noto Sans Black', sans-serif;
}

/* ── Intro ── */

.intro {
  text-align: center;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 1.5rem;
}

/* ── Monto ── */

.monto-wrapper {
  text-align: center;
  margin-bottom: 1.5rem;
}

.monto {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: #90e0ef;
  margin: 0;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: 1;
  font-family: 'Noto Sans', sans-serif;
}

.unidad {
  font-size: 1rem;
  font-weight: 600;
  color: #000000;
  margin: 0.3rem 0 0;
  align-items: center;
  display: flex;
  justify-content: center;
}

/* ── Descripción ── */

.descripcion {
  text-align: center;
  line-height: 1.6;
  margin: 0 auto 2.5rem;
}

/* ── Acordeón ── */

.acordeon {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;
}

/*
 * Cada columna es independiente.
 * Si un accordion crece, solamente crece
 * esta columna.
 */
.columna {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

/* ── Item ── */

.item {
  background-color: #f5f5f0;
  border-radius: 12px;
  overflow: hidden;
  transition: background-color 0.2s ease;
}

.item.abierto {
  background-color: #f0efea;
}

/* ── Cabecera ── */

.cabecera {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.icono {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icono img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.item-titulo {
  font-weight: 700;
  font-size: 0.98rem;
  color: #333;
}

.item-monto {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.flecha {
  color: #888;
  transition: transform 0.25s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.item.abierto .flecha {
  transform: rotate(180deg);
  color: #00b4d8;
}

/* ── Panel desplegable ── */

.panel {
  padding: 0 1.2rem 1.2rem calc(40px + 2.2rem);
}

.panel ul {
  margin: 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.panel li {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #444;
}

/* ── Transición ── */

.desplegar-enter-active,
.desplegar-leave-active {
  transition: all 0.25s ease;
  max-height: 300px;
}

.desplegar-enter-from,
.desplegar-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ── Responsive ── */

@media (max-width: 1024px) {
  .titulo {
    margin-top: 0;
  }
}

@media (max-width: 640px) {
  /*
   * En móvil vuelve a una sola columna.
   */
  .acordeon {
    grid-template-columns: 1fr;
  }

  .cabecera {
    padding: 0.9rem 1rem;
    gap: 0.75rem;
  }

  .icono {
    width: 36px;
    height: 36px;
  }

  .panel {
    padding: 0 1rem 1rem calc(36px + 1.7rem);
  }

  .item-titulo {
    font-size: 0.92rem;
  }

  .item-monto {
    font-size: 0.85rem;
  }
}
</style>