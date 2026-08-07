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

        <div class="grid-botones">
            <button v-for="(btn, index) in datos.botones" :key="btn.id" class="btn-eje"
                @click="abrirModal(datos.botones[index])">
                <img :src="`${baseUrl}${btn.imagen}`" :alt="btn.texto" class="img-eje" />
                <span>{{ btn.texto }}</span>

                <!-- ═══ Indicador de avance compacto ═══ -->
                <div class="progress-wrapper">
                    <div v-for="n in Number(btn.metas)" :key="n" class="progress-segment"
                        :class="{ completed: n <= Number(btn.cumplidas) }" />
                </div>
                <div class="meta-label">{{ btn.cumplidas }} de {{ btn.metas }} metas</div>
            </button>
        </div>

        <Modal v-model="modal.isOpen.value" :content="modal.content.value" />
    </section>
</template>

<script setup>
import datos from '@/data/Agenda/agenda.json'
import Modal from '@/components/utils/Modal.vue'
import { useModal } from '@/components/composables/useModal.js'

const baseUrl = import.meta.env.BASE_URL
const modal = useModal()

function abrirModal(data) {
    modal.open(data)
}
</script>

<style scoped>
.entorno {
    max-width: 1400px;
    margin: 0 auto;
    padding: 3.5rem 2.5rem 5rem;
    color: #000000;
    position: relative;
}

.titulo {
    text-align: center;
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 800;
    margin-bottom: 2.5rem;
    font-family: 'Noto Sans', sans-serif;
    letter-spacing: -0.02em;
}

.subtitulo {
    text-align: center;
    font-size: clamp(1.5rem, 4.5vw, 2rem);
    max-width: 1100px;
    margin: 0 auto 3.5rem;
    font-family: 'Noto Sans Black', sans-serif;
    letter-spacing: -0.02em;
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
    color: #000000;
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
    color: #000000;
}

/* ═══════════════════════════════════════
   GRID DE BOTONES — RESPONSIVE 4→2→1
   ═══════════════════════════════════════ */
.grid-botones {
    display: grid;
    gap: 1rem;
    max-width: 900px;
    margin: 0 auto 2.5rem;
    grid-template-columns: repeat(4, 1fr);
}

/* Botones */
.btn-eje {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.6rem;

    background-color: rgba(255, 0, 0, 0.12);
    border: 2px solid rgba(255, 0, 0, 0.25);
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

.btn-eje:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(255, 0, 0, 0.15);
    border-color: rgba(255, 0, 0, 0.5);
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
    background-color: #e53935;
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