<script setup>
import Mascota from '../utils/Mascota.vue';
import Tooltip from './Desempenio/Tooltip.vue'
</script>

<template>
  <section
    class="cubo-track grid grid-cols-6 gap-x-4"
    data-face-id="paquete_economico"
    id="paquete_economico"
  >
    <div class="lg:col-start-2 lg:col-span-4 col-start-1 col-span-6">
      <h2>¿Cómo será el siguiente ciclo fiscal?</h2>
      <div class="flex flex-col-reverse lg:flex-row items-center">
        <Mascota :mascota="6"/>
        <p>
        Para el 2027 se perseguirá el objetivo de reducir el déficit público y preservar la
        sostenibilidad de las finanzas públicas a través de un proceso de normalización fiscal. Para
        lograrlo se tomarán las siguientes acciones:
      </p>
      </div>

      <div class="cards grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-min">
        <div
          class="subcards grid grid-rows-subgrid row-span-3 rounded-xl shadow-xl overflow-hidden"
        >
          <figure class="max-w-18 rounded-xl overflow-hidden bg-transparent self-start">
            <img src="/secciones/impactos/images/14_infraestructura.png" alt="Cambiar" />
          </figure>
          <p class="p-h4">
            Destacar la inversión en infraestructura en la estrategia de crecimiento
          </p>
          <p>
            Esto se realizará por medio del Plan de Inversión en Infraestructura para el Desarrollo
            con Bienestar y el Plan de Fortalecimiento y Expansión del Sistema Eléctrico Nacional
            2025-2030.
          </p>
        </div>

        <div
          class="subcards grid grid-rows-subgrid row-span-3 rounded-2xl shadow-xl overflow-hidden"
        >
          <figure class="max-w-18 rounded-xl overflow-hidden bg-transparent self-start">
            <img src="/secciones/impactos/images/15_impulsar_exportacion.png" alt="Cambiar" />
          </figure>
          <p class="p-h4">
            Impulsar una mayor integración productiva e incentivar un mayor contenido nacional en
            las exportaciones
          </p>
          <p>
            Esto se realizará por medio del fortalecimiento de cadenas productivas, el uso
            estratégico de las compras públicas y una mejor coordinación entre la inversión pública
            y privada, fomentado en el Plan México.
          </p>
        </div>

        <div
          class="subcards grid grid-rows-subgrid row-span-3 rounded-2xl shadow-xl overflow-hidden"
        >
          <figure class="max-w-18 rounded-xl overflow-hidden bg-transparent self-start">
            <img src="/secciones/impactos/images/16_responsable.png" alt="Cambiar" />
          </figure>
          <p class="p-h4">Mantener una política responsable y prudente</p>
          <p>
            Por medio de una gestión eficiente del gasto, una mayor solidez recaudatoria y una
            estrategia de financiamiento de bajo riesgo, enfocada en pasivos en moneda nacional, a
            tasa fija y vencimientos de largo plazo.
          </p>
        </div>
      </div>

      <p>
        Es por ello que se prevé la continuidad de los Programas para el Bienestar, el
        fortalecimiento de becas educativas, apoyo a mujeres, programas de salud y acciones
        orientadas a garantizar vivienda digna, con el objetivo de reforzar la capacidad de consumo
        de las familias, impulsar la demanda interna y generar condiciones más favorables para un
        crecimiento sostenido y con mayor participación social. Orientado a ello, se establecieron
        los siguientes Programas prioritarios, los cuales se encuentran alineados a los Ejes
        Generales y Ejes Transversales del Plan Nacional de Desarrollo.
        <Tooltip
          text="Fuente: PCGPE 2027, Pág 3, 4 y 29"
          :fuente
        >
          <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="rgb(78, 191, 86)"
                  class="bi bi-leaf-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M1.4 1.7c.217.289.65.84 1.725 1.274 1.093.44 2.885.774 5.834.528 2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045-.142-.162-.402-.102-.379.112.108.985 1.104 1.82 1.844 2.308 2.37 1.566 5.772-.118 7.6 3.071.505.8 1.374 2.7 1.75 4.292.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042 1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.124-.887-1.889-2.095-2.39-3.383-1-2.562-1-5.536-.65-7.28L.73.806z"
                  ></path>
                </svg>
        </Tooltip>
      </p>
    </div>
  </section>
</template>
<style scoped>
#paquete_economico{
  background: linear-gradient(90deg, rgb(170 236 248) 0%, rgba(122, 211, 227, 1) 100%);
  color: #2c4072
}
#paquete_economico p {
  color: #2c4072;
}
.cards {
  padding: 36px 0;
}

.subcards {
  padding: 20px 25px;
  background-color: white;
}

.p-h4 {
  color: rgb(56, 78, 158);
  font-family: 'Noto Sans';
  font-size: 24px;
  font-weight: 600;
  text-align: left;
}
</style>
