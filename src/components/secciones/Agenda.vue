<template>
    <section class="entorno">
        <h2 class="titulo">{{ datos.titulo }}</h2>

        <!-- Renderiza bloques dinámicos desde el JSON -->
        <div v-for="(bloque, i) in datos.bloques" :key="i" class="bloque">
            <div v-if="bloque.tipo === 'parrafos'" class="textos">
                <p v-for="(parrafo, j) in bloque.items" :key="j" v-html="parrafo" />
            </div>
            <div v-else-if="bloque.tipo === 'dos-columnas'" class="dos-columnas">
                <div v-for="(col, k) in bloque.columnas" :key="k" class="columna">
                    <p v-html="col" />
                </div>
            </div>
        </div>

        <h3 class="subtitulo">{{ datos.subtitulo }}</h3>

        <!-- 
        <div class="grid-botones">
            <template v-for="(btn, index) in datos.botones" :key="btn.id">

                Botón normal: abre modal
                <button v-if="btn.tipo !== 'descarga'" class="btn-eje" @click="abrirModal(ODS[index])">
                    <img :src="`${baseUrl}${btn.imagen}`" :alt="btn.texto" class="img-eje" />

                    <span>{{ btn.texto }}</span>

                    <div class="progress-wrapper">
                        <div v-for="n in Number(btn.metas)" :key="n" class="progress-segment"
                            :class="{ completed: n <= Number(btn.cumplidas) }" />
                    </div>

                    <div class="meta-label">
                        {{ btn.cumplidas }} de {{ btn.metas }} metas
                    </div>
                </button>

                 Botón de descarga: NO abre modal
                <a v-else class="btn-eje" :href="`${baseUrl}${btn.link}`" :download="btn.archivo">
                    <img :src="`${baseUrl}${btn.imagen}`" :alt="btn.texto" class="img-eje" />

                    <span>{{ btn.texto }}</span>

                    <div class="progress-wrapper">
                        <div v-for="n in Number(btn.metas)" :key="n" class="progress-segment"
                            :class="{ completed: n <= Number(btn.cumplidas) }" />
                    </div>

                    <div class="meta-label">
                        {{ btn.cumplidas }} de {{ btn.metas }} metas
                    </div>
                </a>

            </template>
</div>
-->

        <BurbujasODS :botones="datos.botones" @seleccionar="abrirModalODS" />

        <Modal v-model="modal.isOpen.value" :content="modal.content.value" />

    </section>
</template>

<script setup>
import datos from '@/data/Agenda/agenda.json'
import ODS from '@/data/Agenda/ODS.json'

import Modal from '@/components/utils/Modal.vue'
import { useModal } from '@/components/composables/useModal.js'

import BurbujasODS from './Agenda/BurbujasODS.vue'

const modal = useModal()


// =============================================
// ABRIR MODAL DEL ODS SELECCIONADO
// =============================================

function abrirModalODS(burbuja) {

    const contenidoODS = ODS.find(
        ods => String(ods.id) === String(burbuja.id)
    )

    if (!contenidoODS) {
        console.warn(
            `No se encontró información para el ODS ${burbuja.id}`
        )

        return
    }

    modal.open(contenidoODS)
}

</script>

<style scoped>
.entorno {
    padding: 3.5rem 2.5rem 5rem;
    position: relative;
}

.titulo {
    text-align: center;
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 800;
    margin-bottom: 2.5rem;
    font-family: 'Noto Sans', sans-serif;
    letter-spacing: -0.02em;
    color: #ffffff;
}

.subtitulo {
    text-align: center;
    font-size: clamp(1.5rem, 4.5vw, 2rem);
    max-width: 1100px;
    margin: 0 auto 3.5rem;
    font-family: 'Noto Sans Black', sans-serif;
    letter-spacing: -0.02em;
    color: #ffffff;
}

.bloque {
    max-width: 1100px;
    margin: 0 auto 3.5rem;
}

.bloque:last-child {
    margin-bottom: 0;
}

.textos {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.textos p {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.7;
    text-align: justify;
    color: #ffffff;
}

.dos-columnas {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
}

.columna p {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.7;
    text-align: justify;
    color: #ffffff;
}

/* ═══════════════════════════════════════
   GRID DE BOTONES — RESPONSIVE 4→2→1
   ═══════════════════════════════════════ */
.grid-botones {
    display: grid;
    gap: 2rem;
    max-width: 900px;
    margin: 0 auto 2.5rem;
    grid-template-columns: repeat(4, 1fr);
}

/* Últimos dos botones centrados */
.grid-botones>.btn-eje:nth-last-child(2) {
    grid-column: 2;
}

.grid-botones>.btn-eje:last-child {
    grid-column: 3;
}

/* Botones */
.btn-eje {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.6rem;

    background-color: rgba(102, 204, 204, 0.12);
    border-radius: 16px;
    padding: 1.2rem 1rem;
    min-height: 180px;

    color: #000000;
    font-size: 1rem;
    font-weight: 600;
    font-family: 'Noto Sans', sans-serif;
    cursor: pointer;
    transition: all 0.25s ease;
    text-align: center;
    line-height: 1.35;
    position: relative;
    overflow: hidden;
}

@media (max-width:1023px) {
    .btn-eje {
        grid-column: 1;
        grid-column-end: 4;
    }

    /* Últimos dos botones centrados */
    .grid-botones>.btn-eje:nth-last-child(2) {
        grid-column: 1;
        grid-column-end: 4;
    }

    .grid-botones>.btn-eje:last-child {
        grid-column: 1;
        grid-column-end: 4;
    }

}

.btn-eje:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(120, 226, 240, 0.15);
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

/* ═══ Indicador de avance — compacto y delgado ═══ */
.progress-wrapper {
    width: 70%;
    max-width: 140px;
    height: 4px;
    display: flex;
    gap: 1.5px;
    margin-top: auto;
}

.progress-segment {
    flex: 1;
    height: 100%;
    border-radius: 1px;
    background-color: #d1d5db;
    /* gris suave */
    transition: background-color 0.3s ease;
}

.progress-segment.completed {
    background-color: rgb(35, 146, 182);
    /* rojo */
}

.meta-label {
    font-size: 0.7rem;
    color: #888;
    margin-top: 0.1rem;
    font-weight: 500;
    letter-spacing: 0.02em;
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */
@media (max-width: 1024px) {
    .grid-botones {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .grid-botones {
        grid-template-columns: 1fr;
    }

    .entorno {
        padding: 2.5rem 1.5rem 4rem;
    }

    .textos p,
    .columna p {
        text-align: left;
        font-size: 1rem;
    }

    .dos-columnas {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}
</style>