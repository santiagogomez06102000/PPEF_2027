<script setup>

</script>

<template>
    <section class="cubo-track paquete-economico" data-face-id="paquete_economico" id="paquete_economico">
        <div class="paquete-contenido">

            <h2>Ciudadanía informada</h2>

            <div class="introduccion">
                <p>
                    Participa, supervisa y ejerce tu derecho a saber: infórmate sobre el presupuesto y resultados,
                    da seguimiento a obras y acciones de gobierno. Usa y comparte datos abiertos. Tu participación
                    fortalece la transparencia y mejora los servicios públicos.
                </p>
            </div>

            <div class="cards">

                <div class="subcards">
                    <figure>
                        <img src="/secciones/impactos/images/14_infraestructura.png" alt="Cambiar" />
                    </figure>

                    <p class="p-h4">
                        Destacar la inversión en infraestructura en la estrategia de crecimiento
                    </p>

                    <p>
                        el gasto y los resultados de los programas presupuestarios de forma trimestral
                        en la sección Programas
                    </p>
                </div>

                <div class="subcards">
                    <figure>
                        <img src="/secciones/impactos/images/15_impulsar_exportacion.png" alt="Cambiar" />
                    </figure>

                    <p class="p-h4">
                        Impulsar una mayor integración productiva e incentivar un mayor contenido nacional
                        en las exportaciones
                    </p>

                    <p>
                        cada trimestre la sección de Obra Pública
                    </p>
                </div>

                <div class="subcards">
                    <figure>
                        <img src="/secciones/impactos/images/16_responsable.png" alt="Cambiar" />
                    </figure>

                    <p class="p-h4">
                        Mantener una política responsable y prudente
                    </p>

                    <p>
                        el gasto federalizado en la sección de entidades federativas
                    </p>
                </div>

            </div>
        </div>
    </section>
</template>

<style scoped>
/* =========================================================
   CONTENEDOR PRINCIPAL
   Equivalente a:
   grid grid-cols-6 gap-x-4
   ========================================================= */

.paquete-economico {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    column-gap: 1rem;
}


/* =========================================================
   CONTENIDO
   Equivalente a:
   lg:col-start-2 lg:col-span-4
   col-start-1 col-span-6
   ========================================================= */

.paquete-contenido {
    grid-column: 1 / span 6;
}


/* =========================================================
   COLORES
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
   Equivalente a:
   flex flex-col-reverse lg:flex-row items-center
   ========================================================= */

.introduccion {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
}


/* =========================================================
   CARDS
   Equivalente a:
   grid grid-cols-1 md:grid-cols-3
   gap-8
   auto-rows-min
   ========================================================= */

.cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    grid-auto-rows: min-content;

    padding: 36px 0;
}


/* =========================================================
   SUBCARDS
   Equivalente a:
   grid
   grid-rows-subgrid
   row-span-3
   rounded-xl / rounded-2xl
   shadow-xl
   overflow-hidden
   ========================================================= */

.subcards {
    display: grid;

    /*
     * En CSS Grid nativo no todos los navegadores/estructuras
     * necesitan row-span-3 de Tailwind.
     * Se mantienen tres filas para alinear el contenido.
     */
    grid-template-rows: subgrid;
    grid-row: span 3;

    padding: 20px 25px;

    background-color: white;

    border-radius: 16px;

    box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);

    overflow: hidden;
}


/* =========================================================
   FIGURE
   Equivalente a:
   max-w-18
   rounded-xl
   overflow-hidden
   bg-transparent
   self-start
   ========================================================= */

.subcards figure {
    width: 4.5rem;
    max-width: 4.5rem;

    margin: 0;

    border-radius: 12px;

    overflow: hidden;

    background-color: transparent;

    align-self: start;
}

.subcards figure img {
    display: block;

    width: 100%;
    height: auto;

    object-fit: contain;
}


/* =========================================================
   TÍTULOS DE LAS CARDS
   ========================================================= */

.p-h4 {
    color: rgb(56, 78, 158);

    font-family: 'Noto Sans', sans-serif;

    font-size: 24px;
    font-weight: 600;

    text-align: left;

    margin: 0;
}


/* =========================================================
   TEXTOS DE LAS CARDS
   ========================================================= */

.subcards>p:not(.p-h4) {
    margin: 0;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

/*
 * Tailwind md = 768px
 *
 * grid-cols-3
 */

@media (min-width: 768px) {
    .cards {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}


/*
 * Tailwind lg = 1024px
 *
 * col-start-2
 * col-span-4
 */

@media (min-width: 1024px) {
    .paquete-contenido {
        grid-column: 2 / span 4;
    }

    .introduccion {
        flex-direction: row;
    }
}


/*
 * Ajustes para pantallas pequeñas
 */

@media (max-width: 767px) {
    .paquete-economico {
        grid-template-columns: 1fr;
    }

    .paquete-contenido {
        grid-column: 1;
    }

    .p-h4 {
        font-size: 20px;
    }
}
</style>
