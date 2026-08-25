<script setup>
import { onMounted, ref } from 'vue';
import { fetchPublicJson } from '../utils/utils';
import { baseUrl } from './Inversion/mapController';

const cards = ref(null);

onMounted(async () => {
    cards.value = await fetchPublicJson(
        "/secciones/ciudadaniaInformada/cardsCI.json"
    );
});
</script>

<template>
    <section class="cubo-track paquete-economico" data-face-id="paquete_economico" id="paquete_economico">
        <div class="paquete-contenido">

            <h2>Ciudadanía informada</h2>

            <p class="introduccion">
                Participa, supervisa y ejerce tu derecho a saber: infórmate sobre el presupuesto y resultados,
                da seguimiento a obras y acciones de gobierno. Usa y comparte datos abiertos. Tu participación
                fortalece la transparencia y mejora los servicios
            </p>

            <div class="cards" v-if="cards">

                <a class="subcards" v-for="card in cards" :key="card.url" :href="card.url" target="_blank">

                    <!-- IMAGEN -->
                    <figure>
                        <img :src="baseUrl + card.img" :alt="card.titulo" />
                    </figure>

                    <!-- CONTENIDO -->
                    <div class="subcards-text">

                        <p class="p-h4" v-html="card.titulo"></p>

                        <p class="descripcion" v-html="card.descripcion"></p>

                    </div>

                </a>

            </div>

        </div>
    </section>
</template>

<style scoped>
/* =========================================================
   CONTENEDOR PRINCIPAL
   ========================================================= */

.paquete-economico {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    column-gap: 1rem;

    margin: 0 auto;
    padding: 3.5rem 2.5rem 5rem;

    border-radius: 70px;
}


/* =========================================================
   CONTENIDO
   ========================================================= */

.paquete-contenido {
    grid-column: 1 / span 6;

    font-family: 'Noto Sans', sans-serif;
}


/* =========================================================
   FONDO
   ========================================================= */

#paquete_economico {
    background: linear-gradient(90deg,
            rgb(170 236 248) 0%,
            rgba(122, 211, 227, 1) 100%);

    color: #2c4072;
}

#paquete_economico p {
    color: #2c4072;
}


/* =========================================================
   INTRODUCCIÓN
   ========================================================= */

.introduccion {
    text-align: center;
    margin-bottom: 0;
}


/* =========================================================
   CONTENEDOR DE CARDS

   Desktop:
   [ CARD ][ CARD ][ CARD ]
   ========================================================= */

.cards {
    display: grid;

    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 2rem;

    padding: 36px 0;
}


/* =========================================================
   CARD

   ESTRUCTURA:

   ┌───────────────────┐
   │      IMAGEN       │
   ├───────────────────┤
   │ TÍTULO │  TEXTO   │
   └───────────────────┘
   ========================================================= */

.subcards {
    display: flex;
    flex-direction: row;

    width: 100%;

    background-color: #ffffff;

    border-radius: 12px;

    overflow: hidden;

    text-decoration: none;

    box-shadow:
        0 10px 20px rgba(0, 0, 0, 0.08),
        0 4px 8px rgba(0, 0, 0, 0.05);

    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}


/* =========================================================
   HOVER
   ========================================================= */

.subcards:hover {
    transform: scale(1.03);

    box-shadow:
        0 16px 30px rgba(0, 0, 0, 0.12),
        0 8px 15px rgba(0, 0, 0, 0.08);
}


/* =========================================================
   IMAGEN
   ========================================================= */

.subcards figure {
    width: 100%;
    height: 180px;

    margin: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    background-color: transparent;
}

.subcards figure img {
    display: block;

    width: 100%;
    height: 100%;

    object-fit: contain;
}


/* =========================================================
   CONTENIDO DE LA CARD

   Título y texto en ROW
   ========================================================= */

.subcards-text {
    display: flex;
    flex-direction: column;

    align-items: flex-start;

    gap: 1.5rem;

    padding: 1.5rem;

    flex: 1;

    font-family: 'Noto Sans', sans-serif;
}


/* =========================================================
   TÍTULO
   ========================================================= */

.p-h4 {
    flex: 0 0 40%;

    margin: 0;

    color: rgb(56, 78, 158) !important;

    font-family: 'Noto Sans', sans-serif;

    font-size: 22px;
    font-weight: 700;

    line-height: 1.2;

    text-align: left;
}


/* =========================================================
   DESCRIPCIÓN
   ========================================================= */

.descripcion {
    flex: 1;

    margin: 0;

    font-family: 'Noto Sans', sans-serif;

    font-size: 15px;
    font-weight: 400;

    line-height: 1.5;

    text-align: left;
}


/* =========================================================
   TABLET

   [ CARD ][ CARD ]
   [ CARD         ]
   ========================================================= */

@media (max-width: 1024px) {

    .cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

}


/* =========================================================
   MÓVIL

   [ CARD ]
   [ CARD ]
   [ CARD ]
   ========================================================= */

@media (max-width: 640px) {

    .paquete-economico {
        grid-template-columns: 1fr;

        padding: 2.5rem 1.5rem 4rem;

        border-radius: 40px;
    }

    .paquete-contenido {
        grid-column: 1;
    }

    .cards {
        grid-template-columns: 1fr;

        gap: 1.5rem;
    }


    /* En móvil título y descripción también pueden
       mantenerse lado a lado */
    .subcards-text {
        gap: 1rem;

        padding: 1.25rem;
    }

    .p-h4 {
        flex-basis: 40%;

        font-size: 18px;
    }

    .descripcion {
        font-size: 14px;
    }

    .subcards figure {
        height: 150px;
    }

}
</style>