import { ref } from 'vue'

/**
 * Composable para manejar el estado de un modal.
 * Permite abrir/cerrar y gestionar el contenido dinámico.
 *
 * @returns {Object} { isOpen, content, open, close, toggle }
 */
export function useModal() {
  const isOpen = ref(false)
  const content = ref({})

  /**
   * Abre el modal con el contenido especificado.
   * @param {Object} data - Objeto con title, subtitle y blocks
   */
  function open(data = {}) {
    content.value = data
    isOpen.value = true
  }

  /**
   * Cierra el modal y limpia el contenido.
   */
  function close() {
    isOpen.value = false
    // Opcional: limpiar contenido después de la transición
    // setTimeout(() => { content.value = {} }, 300)
  }

  /**
   * Alterna el estado del modal.
   */
  function toggle(data = {}) {
    if (!isOpen.value) {
      open(data)
    } else {
      close()
    }
  }

  return {
    isOpen,
    content,
    open,
    close,
    toggle,
  }
}
