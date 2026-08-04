<template>
    <section class="distribucion">
        <h2 class="titulo">{{ datos.titulo }}</h2>
        <p class="descripcion">{{ datos.descripcion }}</p>

        <div class="contenido">
            <!-- Botones de clasificación -->
            <div class="botones">
                <button v-for="(cat, idx) in datos.clasificaciones" :key="cat.id" class="boton-clasificacion"
                    :class="{ activo: activo === idx }" @click="activo = idx">
                    <span class="pregunta">{{ cat.pregunta }}</span>
                    <span class="subtitulo">{{ cat.subtitulo }}</span>
                </button>
            </div>

            <!-- Gráfica -->
            <div class="panel-grafica">
                <Grafica :datos="datos.clasificaciones[activo].barras" />
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import Grafica from '@/components/secciones/DistribucionGasto/Grafica.vue'
import datos from '@/data/distribucion.json'

const activo = ref(2) // "¿En qué se gasta?" activo por defecto (coincide con imagen)
</script>

<style scoped>
.distribucion {
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 2.5rem 4rem;
    background-color: #ffffff;
}

/* ── Título ── */
.titulo {
    text-align: center;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800;
    color: #00b4d8;
    margin-bottom: 1rem;
    font-family: 'Noto Sans', sans-serif;
}

/* ── Descripción ── */
.descripcion {
    text-align: center;
    max-width: 950px;
    margin: 0 auto 3rem;
    font-size: 1rem;
    line-height: 1.7;
    color: #333;
}

/* ── Layout principal ── */
.contenido {
    display: flex;
    gap: 3rem;
    align-items: flex-start;
}

/* ── Botones (columna izquierda) ── */
.botones {
    display: flex;
    flex-direction: column;
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
    .distribucion {
        padding: 2rem 1.5rem 3rem;
    }

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