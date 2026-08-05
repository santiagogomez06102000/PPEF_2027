<template>
    <section class="entorno">
        <h2 class="titulo">{{ datos.titulo }}</h2>

        <!-- Renderiza bloques dinámicos desde el JSON -->
        <div v-for="(bloque, i) in datos.bloques" :key="i" class="bloque">

            <!-- Bloque: párrafos normales (stack vertical) -->
            <div v-if="bloque.tipo === 'parrafos'" class="textos">
                <p v-for="(parrafo, j) in bloque.items" :key="j" v-html="parrafo" />
            </div>

            <!-- Bloque: dos columnas -->
            <div v-else-if="bloque.tipo === 'dos-columnas'" class="dos-columnas">
                <div v-for="(col, k) in bloque.columnas" :key="k" class="columna">
                    <p v-html="col" />
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import datos from '@/data/Agenda/agenda.json'
</script>

<style scoped>
.entorno {
    max-width: 1400px;
    margin: 0 auto;
    padding: 3.5rem 2.5rem 5rem;
    color: #000000;
    position: relative;
}

/* ── Título ── */
.titulo {
    text-align: center;
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 800;
    margin-bottom: 2.5rem;
    font-family: 'Noto Sans', sans-serif;
    letter-spacing: -0.02em;
}

/* ── Bloques ── */
.bloque {
    max-width: 1100px;
    margin: 0 auto 3.5rem;
}

.bloque:last-child {
    margin-bottom: 0;
}

/* ── Párrafos normales ── */
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

/* ── Dos columnas ── */
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
   RESPONSIVE
   ═══════════════════════════════════════ */

@media (max-width: 1024px) {}

@media (max-width: 768px) {
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