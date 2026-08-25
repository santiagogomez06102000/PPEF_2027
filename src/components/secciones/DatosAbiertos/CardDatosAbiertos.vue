<script setup lang="ts">
import { computed } from 'vue'

export interface Datos {
    url: string
    tipo: string
    titulo: string
    img: string
}

const props = defineProps<{
    card: Datos
    idx: number
}>()

const baseUrl = import.meta.env.BASE_URL

const imagen = computed(() => {
    return `${baseUrl}${props.card.img.replace(/^\/+/, '')}`
})
</script>

<template>
    <a class="card-datos-abiertos" :class="{
        'card-datos-abiertos--azul': idx % 2 === 0,
        'card-datos-abiertos--verde': idx % 2 !== 0
    }" :href="props.card.url" target="_blank" rel="noopener noreferrer">

        <!-- IMAGEN -->
        <figure class="card-datos-abiertos__figure">
            <img :src="imagen" :alt="props.card.titulo" class="card-datos-abiertos__imagen" />
        </figure>

        <!-- TÍTULO -->
        <h5 class="card-datos-abiertos__titulo">
            {{ props.card.titulo }}
        </h5>

    </a>
</template>

<style scoped>
/* =========================================================
   CARD
   ========================================================= */

.card-datos-abiertos {
    width: 100%;

    min-height: 112px;

    display: flex;
    flex-direction: row;
    align-items: center;

    gap: 1.25rem;

    padding: 1rem 2rem;

    border-radius: 34px;

    overflow: hidden;

    text-decoration: none;

    font-family: 'Noto Sans', sans-serif;

    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}


/* =========================================================
   COLORES
   ========================================================= */

.card-datos-abiertos--azul {
    background-color: #d3f1f9;
}

.card-datos-abiertos--verde {
    background-color: #d1f2f0;
}


/* =========================================================
   HOVER
   ========================================================= */

.card-datos-abiertos:hover {
    transform: scale(1.025);

    box-shadow:
        0 10px 20px rgba(0, 0, 0, 0.08),
        0 4px 8px rgba(0, 0, 0, 0.05);
}


/* =========================================================
   IMAGEN
   ========================================================= */

.card-datos-abiertos__figure {
    width: 78px;
    height: 78px;

    flex: 0 0 78px;

    margin: 0;

    display: flex;
    align-items: center;
    justify-content: center;
}


.card-datos-abiertos__imagen {
    display: block;

    width: 100%;
    height: 100%;

    object-fit: contain;
}


/* =========================================================
   TÍTULO
   ========================================================= */

.card-datos-abiertos__titulo {
    margin: 0;

    color: #000;

    font-family: 'Noto Sans', sans-serif;

    font-size: clamp(1.25rem, 1.5vw, 1.7rem);
    font-weight: 700;
    line-height: 1.25;

    text-align: left;
}


/* =========================================================
   MÓVIL
   ========================================================= */

@media (max-width: 640px) {

    .card-datos-abiertos {
        min-height: 95px;

        gap: 1rem;

        padding: 0.8rem 1.25rem;

        border-radius: 26px;
    }

    .card-datos-abiertos__figure {
        width: 64px;
        height: 64px;

        flex-basis: 64px;
    }

    .card-datos-abiertos__titulo {
        font-size: 1.15rem;
    }

}
</style>