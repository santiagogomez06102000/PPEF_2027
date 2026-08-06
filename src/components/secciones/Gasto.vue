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

        <!-- Ejes Generales -->
        <h3 class="subtitulo-ejes">{{ datos.ejesGenerales.titulo }}</h3>
        <div class="grid-botones grid-4">
            <button v-for="(btn, index) in datos.ejesGenerales.botones" :key="btn.id" class="btn-eje"
                @click="abrirModal(generales[index])">
                <img :src="`${baseUrl}${btn.imagen}`" :alt="btn.texto" class="img-eje" />
                <span>{{ btn.texto }}</span>
            </button>
        </div>

        <!-- Ejes Transversales -->
        <h3 class="subtitulo-ejes">{{ datos.ejesTransversales.titulo }}</h3>
        <div class="grid-botones grid-3">
            <button v-for="(btn, index) in datos.ejesTransversales.botones" :key="btn.id" class="btn-eje"
                @click="abrirModal(transversales[index])">
                <img :src="`${baseUrl}${btn.imagen}`" :alt="btn.texto" class="img-eje" />
                <span>{{ btn.texto }}</span>
            </button>
        </div>
        <Modal v-model="modal.isOpen.value" :content="modal.content.value" />
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

const baseUrl = import.meta.env.BASE_URL;

// Instancia del composable para el modal
const modal = useModal()

function abrirModal(data) {
    modal.open(data)
}
</script>

<style scoped>
.gasto {
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
    color: #ffffff;
}

/* ── Título principal ── */
.titulo {
    text-align: center;
    font-size: clamp(2.2rem, 5vw, 3rem);
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 1.2rem;
    font-family: 'Noto Sans', sans-serif;
}

/* ── Intro ── */
.intro {
    text-align: center;
    font-size: 1rem;
    line-height: 1.6;
    max-width: 700px;
    margin: 0 auto 1.5rem;
    color: #ffffff;
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
    color: #ccffff;
    margin: 0;
    line-height: 1;
    font-family: 'Noto Sans', sans-serif;
}

.unidad {
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0.3rem 0 0;
}

/* ── Descripción ── */
.descripcion {
    text-align: center;
    font-size: 0.98rem;
    line-height: 1.6;
    max-width: 850px;
    margin: 0 auto 2.5rem;
    color: #ffffff;
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
    background-color: #1b6c7a;
    border-radius: 28px;
    padding: 2rem 1.5rem;
    text-align: center;
    color: #ffffff;
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
}

.caja-unidad {
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0.1rem 0 0 0;
    opacity: 0.9;
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
    max-width: 900px;
    margin: 0 auto 2.5rem;
    color: #ffffff;
}

.subtitulo-ejes {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    color: #ccffff;
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

    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    font-family: 'Noto Sans', sans-serif;
    cursor: pointer;
    transition: all 0.25s ease;
    text-align: center;
    line-height: 1.35;
}

.img-eje {
    width: 64px;
    height: 64px;
    object-fit: contain;
    flex-shrink: 0;

    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.15);
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
        width: 52px;
        height: 52px;
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
    .gasto {
        padding: 2rem 1rem 3rem;
    }

    .btn-eje {
        padding: 1rem;
        font-size: 0.95rem;
    }
}
</style>
