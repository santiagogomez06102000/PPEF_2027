<template>
  <!-- Contenedor raíz local que albergará tanto los botones como el diálogo -->
  <div ref="container" class="large layout centered row">
    <div class="layout-container col grid-layout row">
      <button data-layout-id="A" data-duration="500" class="button item col">
        <h2 data-layout-id="A-title">Item A</h2>
        <h3 data-layout-id="A-duration">(500ms)</h3>
        <p>This p tag is hidden by default and only visible when appended inside the dialog element. Its position and opacity are automatically animated.</p>
      </button>
      <button data-layout-id="B" data-duration="1000" class="button item col">
        <h2 data-layout-id="B-title">Item B</h2>
        <h3 data-layout-id="B-duration">(1000ms)</h3>
        <p>This p tag is hidden by default and only visible when appended inside the dialog element. Its position and opacity are automatically animated.</p>
      </button>
      <button data-layout-id="C" data-duration="2000" class="button item col">
        <h2 data-layout-id="C-title">Item C</h2>
        <h3 data-layout-id="C-duration">(2000ms)</h3>
        <p>This p tag is hidden by default and only visible when appended inside the dialog element. Its position and opacity are automatically animated.</p>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { createLayout } from 'animejs';

const container = ref(null);
let modalLayout = null;
let dialog = null;
const listeners = [];

onMounted(() => {
  const rootEl = container.value;
  const buttons = rootEl.querySelectorAll('button');

  // CORRECCIÓN 1: Crear e inyectar el diálogo DENTRO del contenedor del componente.
  // Al estar usando Shadow DOM (.ce.vue), este elemento queda protegido del exterior automáticamente.
  dialog = document.createElement('dialog');
  dialog.id = 'layout-dialog';
  document.body.appendChild(dialog);

  modalLayout = createLayout(dialog, {
    children: ['.item', 'h2', 'h3', 'p'],
    properties: ['--overlay-alpha'],
  });

  const closeModal = (e) => {
    // Evitar que el clic en el contenido del clon cierre el modal involuntariamente
    if (e.type === 'click' && e.target !== dialog) return;

    modalLayout.update(() => {
      dialog.close();
      const $item = Array.from(buttons).find(btn => btn.classList.contains('is-open'));
      if ($item) {
        $item.classList.remove('is-open');
        $item.focus();
      }
    });
  };

  const openModal = (e) => {
    const $target = e.target;
    const $item = $target.closest('.item');
    if (!$item) return;
    const $clone = $item.cloneNode(true);
    dialog.innerHTML = '';
    dialog.appendChild($clone);
    
    modalLayout.update(() => {
      dialog.showModal();
      $item.classList.add('is-open');
    }, {
      duration: parseInt($item.dataset.duration) || 200
    });
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', openModal);
    listeners.push({ el: btn, event: 'click', handler: openModal });
  });

  dialog.addEventListener('cancel', closeModal);
  listeners.push({ el: dialog, event: 'cancel', handler: closeModal });

  dialog.addEventListener('click', closeModal);
  listeners.push({ el: dialog, event: 'click', handler: closeModal });
});

onUnmounted(() => {
  listeners.forEach(({ el, event, handler }) => {
    if (el) el.removeEventListener(event, handler);
  });
  if (dialog && dialog.parentNode) {
    dialog.parentNode.removeChild(dialog);
  }
});
</script>

<style>
/* 1. Obligatorio dentro de Shadow DOM: Registrar el diálogo en relación a su Host */
:root {
  --hex-black-1: #000000;
  --hex-green-1: #f0faf0;
  --hex-green-6: #2d8a4e;
  display: block;
}

p{
    font-size: 1rem;
}

/* 2. Ajuste del Diálogo para forzar el oscurecimiento en el Shadow DOM */
#layout-dialog {
  --overlay-alpha: 100%; /* Anime.js cambiará esto numéricamente */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Forzamos al diálogo a ocupar toda la pantalla sobre el Top Layer */
  position: fixed !important;
  z-index: 99999 !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100dvh !important;
  margin: 0 !important;
  padding: 0 !important;
  
  border: none;
  background: transparent;
  pointer-events: none;
  
  /* Transición del sombreado usando RGBA tradicional que tiene mejor soporte en Shadow Roots */
  background-color: rgba(0, 0, 0, calc((100 - var(--overlay-alpha)) / 100));
}

/* 3. Cuando el diálogo está abierto */
#layout-dialog[open] {
 /*  --overlay-alpha: 60%; */ /* Anime.js reduce la transparencia (dejando 60% oscuro) */
  background-color: #00000042;
  pointer-events: auto;
   width: 100vw !important;
  height: 100dvh !important;
}

/* 4. IMPORTANTE: Matar el sombreado nativo del navegador que bloquea el CSS personalizado */
 #layout-dialog::backdrop {
  /* background: transparent !important; */
  background-color: #00000042 !important;
  backdrop-filter: none !important;
} 


#layout-dialog .item {
  position: relative;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  width: 22rem;
  height: 14.5rem;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--hex-green-6);
  font-size: 1rem;
  color: var(--hex-green-6);
  background-color: var(--hex-green-1);
}

#layout-dialog[open] .item {
  visibility: visible;
}

#layout-dialog .item h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  will-change: font-size;
  text-wrap: nowrap;
}

#layout-dialog .item h3 {
  position: absolute;
  top: 2.9rem;
  right: 2rem;
}

#layout-dialog .item p {
  padding-top: 1rem;
  border-top: 1px solid currentColor;
  display: none;
}

#layout-dialog[open] .item p {
  display: block;
}

/* Estilos para los botones en el layout original */
.layout-container .item {
  cursor: pointer;
  border: 1px solid var(--hex-green-6);
  background-color: var(--hex-green-1);
  color: var(--hex-green-6);
  padding: 1.5rem;
  border-radius: 1rem;
  width: 15rem;
  text-align: left;
}

.layout-container .item.is-open {
  visibility: hidden;
}

.layout-container .item p {
  display: none;
}
</style>
