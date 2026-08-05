<template>
    <section class="informacion">
        <!-- Fila superior: texto introductorio + botones -->
        <div class="fila-superior">
            <div class="intro">
                <p>{{ datos.introduccion.parrafo1 }}</p>
                <p>
                    {{ datos.introduccion.parrafo2Inicio }}
                    <strong>{{ datos.introduccion.resaltado }}</strong>
                    {{ datos.introduccion.parrafo2Fin }}
                </p>
            </div>

            <Botones v-model="activo" :botones="datos.botones" />
        </div>

        <!-- Sección inferior: solo visible en Desktop -->
        <div v-if="activo >= 0 && !esMovil" class="seccion-inferior">
            <div class="tarjeta-contenido">
                <h2>{{ datos.botones[activo].tituloSeccion }}</h2>
                <p v-for="(parrafo, i) in datos.botones[activo].descripcion" :key="i">
                    {{ parrafo }}
                </p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Botones from './Informacion/Botones.vue'
import datos from '@/data/informacion.json'

const activo = ref(0) // CGPE seleccionado por defecto

const esMovil = ref(false)
const verificarMovil = () => {
    esMovil.value = window.innerWidth <= 768
}

onMounted(() => {
    verificarMovil()
    window.addEventListener('resize', verificarMovil)
})

onUnmounted(() => {
    window.removeEventListener('resize', verificarMovil)
})
</script>

<style scoped>
.informacion {
    max-width: 100%;
    margin: 0 auto;
    background-color: #ffffff;
}

/* ── Fila superior: intro + botones ── */
.fila-superior {
    display: flex;
    gap: 3rem;
    align-items: flex-start;
    margin-bottom: 2.5rem;
}

.intro {
    flex: 1;
    color: #222;
    font-size: 1rem;
    line-height: 1.7;
}

.intro p {
    margin-bottom: 1rem;
    text-align: justify;
}

.intro strong {
    font-weight: 700;
}

/* ── Sección inferior (Desktop) ── */
.seccion-inferior {
    animation: fadeIn 0.3s ease;
}

.tarjeta-contenido {
    background-color: #f5f5f0;
    border-radius: 24px;
    padding: 2.2rem 2.5rem;
}

.tarjeta-contenido h2 {
    color: #0b6e7a;
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.tarjeta-contenido p {
    color: #333;
    line-height: 1.7;
    margin-bottom: 1rem;
    text-align: justify;
}

.tarjeta-contenido p:last-child {
    margin-bottom: 0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ═══════════════════════════════════════
   RESPONSIVE: Móvil (≤768px)
   ═══════════════════════════════════════ */
@media (max-width: 768px) {


    .fila-superior {
        flex-direction: column;
        gap: 2rem;
        margin-bottom: 0;
    }

    .intro p {
        text-align: left;
    }

    .seccion-inferior {
        display: none;
    }
}
</style>