<template>
  <section class="distribucion" v-if="datos">
    <h2 class="titulo">{{ datos.titulo }}</h2>
    <p class="descripcion">{{ datos.descripcion }}</p>

    <div class="contenido">
      <!-- Botones de clasificación -->
      <div class="botones">
        <button v-for="(cat, idx) in datos.clasificaciones" :key="cat.id" class="boton-clasificacion"
          :class="{ activo: activo === idx }" @click="() => {
            activo = idx
            detalleActivo = null
            barraActiva = null
          }">
          <span class="pregunta">{{ cat.pregunta }}</span>
          <span class="subtitulo">{{ cat.subtitulo }}</span>
        </button>
      </div>
      <div class="w-full flex justify-end lg:hidden " v-if="detalleActivo">
        <button type="button" @click="handleClickBarra(null)"
          class="bg-white flex items-center justify-center text-blach w-[3rem] h-[3rem] shadow rounded-full">
          <ArrowLeft />
        </button>
      </div>

      <div class="flex gap-0 w-full  flex-wrap">
        <!-- Gráfica -->
        <div class="panel-grafica w-auto overflow-hidden " :class="{
          'max-w-full': !detalleActivo,
          'max-w-full md:max-w-[50%]': detalleActivo
        }">
          <Grafica :datos="datos.clasificaciones[activo].barras" :onClick="handleClickBarra" :activa="barraActiva" />
        </div>
        <div class="w-full lg:w-[50%] " v-if="detalleActivo">
          <Detalle :detalle="detalleActivo" />
        </div>
      </div>

    </div>

  </section>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import Grafica from '@/components/secciones/DistribucionGasto/Grafica.vue'
import { fetchPublicJson } from '../utils/utils';
import Detalle from './DistribucionGasto/Detalle.vue';
import ArrowLeft from '../utils/Icons/ArrowLeft.vue';
const datos = ref();
const isLgOrLarger = window.matchMedia('(min-width: 1024px)')

onMounted(async () => {
  datos.value = await fetchPublicJson("/secciones/distribucionGasto/distribucion.json");
  await nextTick();
  mostrarInicial();
    window.addEventListener('resize', mostrarInicial)

 
})
onUnmounted(() => {
  window.removeEventListener('resize', ejecutarSiEsMobile)
})
function mostrarInicial(){
  if (isLgOrLarger.matches) {
     detalleActivo.value= datos.value?.clasificaciones[activo?.value]?.barras[0]
  }
  
}
const activo = ref(2) // "¿En qué se gasta?" activo por defecto (coincide con imagen)
const detalleActivo = ref();
const barraActiva = ref(0);
function handleClickBarra(idx) {
  if (idx != null) {
    const seleccionado = datos.value.clasificaciones[activo.value].barras[idx];
    if (seleccionado.id === detalleActivo.value?.id) {
      detalleActivo.value = null
      barraActiva.value=null
    }
    else {
      detalleActivo.value = seleccionado;
      barraActiva.value = idx;
    }
  }
  else{
    detalleActivo.value=null
    barraActiva.value=null
  }

}
</script>

<style scoped>
.distribucion {

  background-color: #ffffff;
}

/* ── Título ── */
.titulo {
  text-align: center;
  font-weight: 800;
  color: rgb(0, 161, 205);
  margin-bottom: 1.5rem;
}

/* ── Descripción ── */
.descripcion {
  text-align: center;
  margin: 0 auto 3rem;
  font-size: 1rem;
  line-height: 1.7;
  color: #333;
}

/* ── Layout principal ── */
.contenido {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: flex-start;
}

/* ── Botones (columna izquierda) ── */
.botones {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
  min-width: 260px;
  flex-shrink: 0;
}

.boton-clasificacion {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  padding: 1.2rem 1.5rem;
  border-radius: 20px;
  border: none;
  background-color: #f5f2ed;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  width: 100%;
}

.boton-clasificacion:hover {
  background-color: #e8e4de;
  transform: translateX(4px);
}

.boton-clasificacion.activo {
  background-color: #5bc4bf;
  color: #fff;
}

.pregunta {
  font-size: 1.15rem;
  font-weight: 700;
}

.subtitulo {
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 0.85;
}

/* ── Panel gráfica ── */
.panel-grafica {
  flex: 1;
  min-width: 0;
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */
@media (max-width: 900px) {


  .contenido {
    flex-direction: column;
    gap: 2rem;
  }

  .botones {
    flex-direction: row;
    flex-wrap: wrap;
    min-width: auto;
    width: 100%;
  }

  .boton-clasificacion {
    flex: 1;
    min-width: 200px;
    align-items: center;
    text-align: center;
  }

  .boton-clasificacion:hover {
    transform: translateY(-2px);
  }
}

@media (max-width: 480px) {
  .botones {
    flex-direction: column;
  }

  .boton-clasificacion {
    min-width: auto;
    align-items: flex-start;
    text-align: left;
  }
}
</style>
