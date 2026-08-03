<template>
  <div class="header-cubo-nav">
    <h1>Pre-Criterios Generales de<br />Política Económica 2027</h1>
    <div class="navegacion">
      <div class="cubo">
        <div id="tooltips-container">&nbsp;</div>
        <div id="canvas-container"></div>
      </div>
      <div class="contenido">
        <h2 id="panel-title" class="contenido-titulo">Titulo</h2>
        <div class="tagline" id="panel-tagline">Subtitulo</div>
        <p class="full-desc" id="panel-description">Descripción del la sección</p>
        <button class="btn-explore" id="verMasBtn">
          <span class="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="white"
              stroke-width="0.9"
              viewBox="0 0 16 16"
            >
              <path
                d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"
              />
              <path
                d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"
              />
            </svg>
          </span>
          <span class="text">Ver publicación</span>
        </button>
      </div>
    </div>
  </div>

  <div class="sections-area">
    <section class="section" data-face-id="panorama" id="panorama">
      <div class="section-content">
        <h1>&iquest;Qu&eacute; son?</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nisl nibh, feugiat nec
          ullamcorper in, ornare sit amet ex. In hac habitasse platea dictumst. Cras varius
          consequat vulputate. In eu convallis lorem, non hendrerit libero. Cras volutpat leo non
          tortor suscipit, et molestie sem commodo. Vestibulum aliquam diam eros, nec aliquam magna
          porttitor nec. Curabitur pretium massa in pretium interdum. Morbi sed ornare felis, et
          semper lacus
        </p>
      </div>
    </section>

    <section class="section" data-face-id="ciclo-anterior" id="ciclo-anterior">
      <div class="section-content">
        <h1>&iquest;Qu&eacute; paso el ciclo anterior?</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nisl nibh, feugiat nec
          ullamcorper in, ornare sit amet ex. In hac habitasse platea dictumst. Cras varius
          consequat vulputate. In eu convallis lorem, non hendrerit libero. Cras volutpat leo non
          tortor suscipit, et molestie sem commodo. Vestibulum aliquam diam eros, nec aliquam magna
          porttitor nec. Curabitur pretium massa in pretium interdum. Morbi sed ornare felis, et
          semper lacus
        </p>
      </div>
    </section>

    <section class="section" data-face-id="estimaciones_2026" id="estimaciones_2026">
      <div class="section-content">
        <h1>&iquest;Qu&eacute; se estima que pase en 2026?</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nisl nibh, feugiat nec
          ullamcorper in, ornare sit amet ex. In hac habitasse platea dictumst. Cras varius
          consequat vulputate. In eu convallis lorem, non hendrerit libero. Cras volutpat leo non
          tortor suscipit, et molestie sem commodo. Vestibulum aliquam diam eros, nec aliquam magna
          porttitor nec. Curabitur pretium massa in pretium interdum. Morbi sed ornare felis, et
          semper lacus
        </p>
      </div>
    </section>

    <section class="section" data-face-id="finanzas_publicas" id="finanzas_publicas">
      <div class="section-content">
        <h1>Finanzas p&uacute;blicas</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nisl nibh, feugiat nec
          ullamcorper in, ornare sit amet ex. In hac habitasse platea dictumst. Cras varius
          consequat vulputate. In eu convallis lorem, non hendrerit libero. Cras volutpat leo non
          tortor suscipit, et molestie sem commodo. Vestibulum aliquam diam eros, nec aliquam magna
          porttitor nec. Curabitur pretium massa in pretium interdum. Morbi sed ornare felis, et
          semper lacus
        </p>
      </div>
    </section>

    <section class="section" data-face-id="paquete_economico" id="paquete_economico">
      <div class="section-content">
        <h1>Impactos en el paquete econ&oacute;mico 2027</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nisl nibh, feugiat nec
          ullamcorper in, ornare sit amet ex. In hac habitasse platea dictumst. Cras varius
          consequat vulputate. In eu convallis lorem, non hendrerit libero. Cras volutpat leo non
          tortor suscipit, et molestie sem commodo. Vestibulum aliquam diam eros, nec aliquam magna
          porttitor nec. Curabitur pretium massa in pretium interdum. Morbi sed ornare felis, et
          semper lacus
        </p>
      </div>
    </section>

    <section class="section" data-face-id="p_prioritarios" id="p_prioritarios">
      <div class="section-content">
        <h1>Programas prioritarios</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nisl nibh, feugiat nec
          ullamcorper in, ornare sit amet ex. In hac habitasse platea dictumst. Cras varius
          consequat vulputate. In eu convallis lorem, non hendrerit libero. Cras volutpat leo non
          tortor suscipit, et molestie sem commodo. Vestibulum aliquam diam eros, nec aliquam magna
          porttitor nec. Curabitur pretium massa in pretium interdum. Morbi sed ornare felis, et
          semper lacus
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import { Cubo } from './Cubo'

onMounted(() => {
  nextTick(() => {
    const container = document.getElementById('canvas-container')
    if (container) {
      Cubo() // ← Inicializar el cubo
      window.dispatchEvent(new Event('resize')) // Forzar ajuste de cámara
    } else {
      console.error('No se encontró #canvas-container')
    }
  })
})
</script>

<style></style>
