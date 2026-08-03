<template>
    <section class="gasto">
        <h2 class="titulo">{{ datos.titulo }}</h2>

        <p class="intro">{{ datos.intro }}</p>

        <div class="monto-wrapper">
            <p class="monto">{{ datos.monto }}</p>
            <p class="unidad">{{ datos.unidad }}</p>
        </div>

        <p class="descripcion">{{ datos.descripcion }}</p>

        <div class="acordeon">
            <div v-for="(item, idx) in datos.items" :key="item.id" class="item" :class="{ abierto: activo === idx }">
                <!-- Cabecera -->
                <button class="cabecera" @click="toggle(idx)">
                    <div class="icono">
                        <img src="@/assets/img_circle.png" alt="icono" />
                    </div>

                    <div class="info">
                        <span class="item-titulo">{{ item.titulo }}</span>
                        <span class="item-monto">{{ item.monto }}</span>
                    </div>

                    <span class="flecha" aria-hidden="true">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L7 7L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </span>
                </button>

                <!-- Contenido desplegable -->
                <Transition name="desplegar">
                    <div v-show="activo === idx" class="panel">
                        <ul>
                            <li v-for="(linea, i) in item.contenido" :key="i">
                                {{ linea }}
                            </li>
                        </ul>
                    </div>
                </Transition>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import datos from '@/data/ingreso.json'

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
}

/* ── Monto ── */
.monto-wrapper {
    text-align: center;
    margin-bottom: 1.5rem;
}

.monto {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    color: #90e0ef;
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
    color: #555;
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
}

/* ── Acordeón ── */
.acordeon {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.item {
    background-color: #f5f5f0;
    border-radius: 12px;
    overflow: hidden;
    transition: background-color 0.2s ease;
}

.item.abierto {
    background-color: #f0efea;
}

/* ── Cabecera ── */
.cabecera {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
}

.icono {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icono img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.item-titulo {
    font-weight: 700;
    font-size: 0.98rem;
    color: #333;
}

.item-monto {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
}

.flecha {
    color: #888;
    transition: transform 0.25s ease;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
}

.item.abierto .flecha {
    transform: rotate(180deg);
    color: #00b4d8;
}

/* ── Panel desplegable ── */
.panel {
    padding: 0 1.2rem 1.2rem calc(40px + 2.2rem);
}

.panel ul {
    margin: 0;
    padding-left: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.panel li {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #444;
}

/* ── Transición ── */
.desplegar-enter-active,
.desplegar-leave-active {
    transition: all 0.25s ease;
    max-height: 300px;
}

.desplegar-enter-from,
.desplegar-leave-to {
    opacity: 0;
    max-height: 0;
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

    .cabecera {
        padding: 0.9rem 1rem;
        gap: 0.75rem;
    }

    .icono {
        width: 36px;
        height: 36px;
    }

    .panel {
        padding: 0 1rem 1rem calc(36px + 1.7rem);
    }

    .item-titulo {
        font-size: 0.92rem;
    }

    .item-monto {
        font-size: 0.85rem;
    }
}
</style>