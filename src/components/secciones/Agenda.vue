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

        <!-- <div v-if="botonDescarga" class="contenedor-descarga">
            <a class="btn-descarga" :href="`${baseUrl}${botonDescarga.archivo}`"
                :download="obtenerNombreArchivo(botonDescarga.archivo)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                    class="btn-descarga__icono" aria-hidden="true">
                    <path
                        d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />

                    <path
                        d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                </svg>

                <span class="btn-descarga__texto">
                    {{ botonDescarga.texto }}
                </span>
            </a>
        </div> -->

        <Modal v-model="modal.isOpen.value" :content="modal.content.value" />

    </section>
</template>

<script setup>
import { computed } from 'vue'

import datos from '@/data/Agenda/agenda.json'
import ODS from '@/data/Agenda/ODS.json'

import Modal from '@/components/utils/Modal.vue'
import { useModal } from '@/components/composables/useModal.js'
import BurbujasODS from './Agenda/BurbujasODS.vue'

const modal = useModal()

const baseUrl = import.meta.env.BASE_URL

// =============================================
// BOTÓN DE DESCARGA — ID 18
// =============================================

const botonDescarga = computed(() => {
    return datos.botones.find(
        boton => String(boton.id) === '18'
    )
})

function obtenerNombreArchivo(ruta) {
    return ruta?.split('/').pop() || 'datos.csv'
}

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

/* =============================================
   BOTÓN DESCARGA ODS — CÍRCULO
============================================= */

.contenedor-descarga {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: 3rem;
}

.btn-descarga {
    width: 190px;
    height: 190px;

    border-radius: 50%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 0.8rem;
    padding: 1.5rem;

    background: #d3f1f9;

    color: #000000;
    text-decoration: none;

    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;

    text-align: center;

    cursor: pointer;

    box-sizing: border-box;

    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        background-color 0.25s ease;
}

.btn-descarga:hover {
    transform: scale(1.08);

    background: #bce8f4;

    box-shadow:
        0 12px 30px rgba(0, 0, 0, 0.18);
}

.btn-descarga:active {
    transform: scale(0.96);
}

.btn-descarga__icono {
    width: 42px;
    height: 42px;

    flex-shrink: 0;
}

.btn-descarga__texto {
    max-width: 135px;

    font-size: 0.95rem;
    line-height: 1.25;
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

    .contenedor-descarga {
        margin-top: 2rem;
    }

    .btn-descarga {
        width: 160px;
        height: 160px;

        padding: 1.2rem;
    }

    .btn-descarga__icono {
        width: 36px;
        height: 36px;
    }

    .btn-descarga__texto {
        max-width: 120px;
        font-size: 0.85rem;
    }
}
</style>