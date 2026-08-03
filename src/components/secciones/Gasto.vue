<template>
    <section class="gasto">
        <h2 class="titulo">{{ datos.titulo }}</h2>

        <p class="intro">{{ datos.intro }}</p>

        <div class="monto-wrapper">
            <p class="monto">{{ datos.monto }}</p>
            <p class="unidad">{{ datos.unidad }}</p>
        </div>

        <p class="descripcion">{{ datos.descripcion }}</p>

    </section>
</template>

<script setup>
import { ref } from 'vue'
import datos from '@/data/gasto.json'

const activo = ref(0)

const toggle = (idx) => {
    activo.value = activo.value === idx ? null : idx
}
</script>

<style scoped>
.gasto {
    max-width: 1000px;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
    color: #222;
}

/* ── Título ── */
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

/* ── Monto ── */
.monto-wrapper {
    text-align: center;
    margin-bottom: 1.5rem;
}

.monto {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    color: #ccffff;
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
    color: #ffffff;
    margin: 0.3rem 0 0;
    align-items: center;
    display: flex;
    justify-content: center;
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
   RESPONSIVE
   ═══════════════════════════════════════ */
@media (max-width: 1024px) {
    .titulo {
        margin-top: 0;
    }
}

@media (max-width: 640px) {
    .gasto {
        padding: 2rem 1rem 3rem;
    }
}
</style>