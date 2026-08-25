<template>
    <section class="gasto">
        <h2 class="titulo">{{ datos.titulo }}</h2>

        <p class="intro">{{ datos.intro }}</p>

        <div class="monto-wrapper">
            <p class="monto">{{ datos.monto }}</p>
            <p class="unidad">{{ datos.unidad }}</p>
        </div>

        <p class="descripcion">{{ datos.descripcion }}</p>

        <!-- Cajas superior + mascota -->
        <div class="contenedor-inferior">
            <div class="caja-gasto">
                <h3>{{ datos.cajas.programable.titulo }}</h3>
                <p class="caja-monto">{{ datos.cajas.programable.monto }}</p>
                <p class="caja-unidad">{{ datos.cajas.programable.unidad }}</p>
            </div>

            <div class="mascota-wrapper">
                <Mascota :mascota="1" ancho="24rem" alto="24rem" />
            </div>

            <div class="caja-gasto">
                <h3>{{ datos.cajas.noProgramable.titulo }}</h3>
                <p class="caja-monto">{{ datos.cajas.noProgramable.monto }}</p>
                <p class="caja-unidad">{{ datos.cajas.noProgramable.unidad }}</p>
            </div>
        </div>

        <!-- ═══════════════════════════════════════
         NUEVA SECCIÓN: EJES DEL PND
         ═══════════════════════════════════════ -->

        <p class="texto-ejes">{{ datos.textoEjes }}</p>

        <div class="grid grid-cols-2 gap-x-16 gap-y-40 lg:gap-y-16">
            <!-- Ejes Generales -->
            <div class="col-span-2 lg:col-span-1">
                <h3 class="subtitulo-ejes">{{ datos.ejesGenerales.titulo }}</h3>
                <div class="flex items-center justify-between gap-4 rounded-full px-8 bg-[#409da2] relative">
                    <button v-for="(btn, index) in datos.ejesGenerales.botones" :key="btn.id"
                        class="relative text-black  w-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 ease"
                        @click="handleClickBtn(generales[index])">
                        <img :src="`${baseUrl}${btn.imagen}`" :alt="btn.texto" class="img-eje " />
                        <span class="absolute top-[100%] pt-2 left-0 text-xs lg:text-sm  w-full">{{ btn.texto }}</span>
                    </button>
                </div>
            </div>

            <!-- Ejes Transversales -->
            <div class="col-span-2 lg:col-span-1">
                <h3 class="subtitulo-ejes">{{ datos.ejesGenerales.titulo }}</h3>
                <div class="flex items-center justify-between gap-4 rounded-full px-8 bg-[#0d6881] relative">
                    <button v-for="(btn, index) in datos.ejesTransversales.botones" :key="btn.id"
                        class="relative text-black  w-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 ease"
                        @click="handleClickBtn(transversales[index])">
                        <img :src="`${baseUrl}${btn.imagen}`" :alt="btn.texto" class="img-eje " />
                        <span class="absolute top-[100%] pt-2 left-0 text-xs lg:text-sm  w-full">{{ btn.texto }}</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="mt-40"></div>
        <div class=" w-full rounded-lg text-black bg-white px-8 py-4" v-if="abierto">
            <h4 class="subtitulo-ejes">
                {{ abierto.title }}
            </h4>
            <div v-for="(parrafo, idx) in abierto.blocks" :key="idx" v-html="parrafo.content" class="parrafo-boton">
                
            </div>
        </div>
    </section>
</template>

<script setup>
import datos from '@/data/Gasto/gasto.json'
import Mascota from '@/components/utils/Mascota.vue'
import Modal from '@/components/utils/Modal.vue'
import { useModal } from '@/components/composables/useModal.js'

// Importar JSONs de modales
import generales from '@/data/Gasto/ejes_generales.json'
import transversales from '@/data/Gasto/ejes_transversales.json'
import { ref } from 'vue'

const baseUrl = import.meta.env.BASE_URL;

// Instancia del composable para el modal
const modal = useModal()

function abrirModal(data) {
    modal.open(data)
}
const abierto = ref()
function handleClickBtn(e){

        abierto.value = e;

    
}
</script>

<style scoped>
.parrafo-boton{
    font-size: 1rem;
    margin: 0;
}
.gasto {

    color: #ffffff;
}

/* ── Título principal ── */
.titulo {
    text-align: center;
    color: #00a1cd;
    margin-bottom: 1.2rem;
    font-family: 'Noto Sans Black', sans-serif;
}

/* ── Intro ── */
.intro {
    text-align: center;
    line-height: 1.6;
    max-width: 700px;
    margin: 0 auto 1.5rem;
    color: #000;
}

/* ── Monto grande ── */
.monto-wrapper {
    text-align: center;
    margin-bottom: 1.5rem;
    align-items: center;
    display: flex;
    flex-direction: column;
}

.monto {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    color: #409da2;
    margin: 0;
    line-height: 1;
    font-family: 'Noto Sans', sans-serif;
}

.unidad {
    font-weight: 600;
    color: #000;
    margin: 0.3rem 0 0;
}

/* ── Descripción ── */
.descripcion {
    text-align: center;
    line-height: 1.6;
    max-width: 850px;
    margin: 0 auto 2.5rem;
    color: #000;
}

/* ═══════════════════════════════════════
   CAJAS + MASCOTA (superior)
   ═══════════════════════════════════════ */
.contenedor-inferior {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.caja-gasto {
    background-color: #fff;
    border-radius: 28px;
    padding: 2rem 1.5rem;
    text-align: center;
    color: rgb(13, 104, 129);
    flex: 1 1 200px;
    max-width: 280px;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.caja-gasto h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    font-family: 'Noto Sans', sans-serif;
}

.caja-monto {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
    color: #409da2;
}

.caja-unidad {
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0.1rem 0 0 0;
    opacity: 0.9;
    color: #000;
}

.mascota-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}

/* ═══════════════════════════════════════
   NUEVA SECCIÓN: EJES DEL PND
   ═══════════════════════════════════════ */
.texto-ejes {
    text-align: center;
    font-size: 1rem;
    line-height: 1.7;
    margin: 0 auto 2.5rem;
    color: #000;
}

.subtitulo-ejes {
    text-align: center;
    font-weight: 700;
    color: rgb(13, 104, 129);
    margin: 0 0 1.2rem 0;
    font-family: 'Noto Sans', sans-serif;
}

/* Grids de botones */
.grid-botones {
    display: grid;
    gap: 1rem;
    max-width: 900px;
    margin: 0 auto 2.5rem;
}

.grid-4 {
    grid-template-columns: repeat(4, 1fr);
}

.grid-3 {
    grid-template-columns: repeat(3, 1fr);
}

.btn-eje {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    /* o center */
    gap: 0.75rem;

    background-color: rgba(255, 255, 255, 0.12);
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-radius: 16px;
    padding: 1.2rem 1rem;
    min-height: 180px;
    /* ajusta según necesites */

    color: #000;
    font-size: 1rem;
    font-weight: 600;
    font-family: 'Noto Sans', sans-serif;
    cursor: pointer;
    transition: all 0.25s ease;
    text-align: center;
    line-height: 1.35;
}

.img-eje {
    width: 6rem;
    height: 6rem;
    object-fit: contain;
    flex-shrink: 0;

    border-radius: 12px;
    padding: 8px;
}

.btn-eje span {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
}

@media (max-width: 768px) {
    .img-eje {
        width: 3rem;
        height: 3rem;
    }
}

.btn-eje:hover {
    background-color: rgba(255, 255, 255, 0.28);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */
@media (max-width: 1024px) {
    .grid-4 {
        grid-template-columns: repeat(2, 1fr);
    }

    .grid-3 {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .contenedor-inferior {
        flex-direction: column;
        gap: 2rem;
    }

    .caja-gasto {
        max-width: 100%;
        width: 100%;
        min-height: auto;
        padding: 1.5rem;
    }

    .grid-4,
    .grid-3 {
        grid-template-columns: 1fr;
    }

    .texto-ejes {
        text-align: left;
    }
}

@media (max-width: 640px) {


    .btn-eje {
        padding: 1rem;
        font-size: 0.95rem;
    }
}
</style>
