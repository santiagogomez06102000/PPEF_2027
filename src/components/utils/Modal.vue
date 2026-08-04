<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    content: {
        type: Object,
        default: () => ({})
    },
    closeOnBackdrop: {
        type: Boolean,
        default: true
    },
    closeOnEscape: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue'])

const modalRef = ref(null)
const bodyRef = ref(null)

// Abrir / cerrar
const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
    toggleBodyScroll(val)
})

watch(isOpen, (val) => {
    emit('update:modelValue', val)
    toggleBodyScroll(val)
})

function close() {
    isOpen.value = false
}

function onBackdropClick(e) {
    if (props.closeOnBackdrop && e.target === modalRef.value) {
        close()
    }
}

function onKeydown(e) {
    if (props.closeOnEscape && e.key === 'Escape' && isOpen.value) {
        close()
    }
}

// Bloquear scroll del body
let originalOverflow = ''

function toggleBodyScroll(lock) {
    if (typeof document === 'undefined') return
    if (lock) {
        originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = originalOverflow || ''
    }
}

onMounted(() => {
    if (typeof document !== 'undefined') {
        document.addEventListener('keydown', onKeydown)
    }
    if (props.modelValue) toggleBodyScroll(true)
})

onUnmounted(() => {
    if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', onKeydown)
        document.body.style.overflow = originalOverflow || ''
    }
})

// Renderizado dinámico de bloques
function renderBlock(block) {
    if (!block || !block.type) return null

    const tagMap = {
        paragraph: 'p',
        heading: 'h3',
        subheading: 'h4',
        list: 'ul'
    }

    return {
        tag: tagMap[block.type] || 'div',
        class: `modal-block modal-block--${block.type}`,
        content: block.content || block.text || block.items || []
    }
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isOpen" ref="modalRef" class="modal-backdrop" @click="onBackdropClick" role="dialog"
                aria-modal="true">
                <div class="modal-container">
                    <!-- Header -->
                    <header class="modal-header">
                        <div class="modal-header__text">
                            <h2 v-if="content.title" class="modal-title">{{ content.title }}</h2>
                            <h3 v-if="content.subtitle" class="modal-subtitle">{{ content.subtitle }}</h3>
                        </div>
                        <button class="modal-close" @click="close" aria-label="Cerrar modal" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </header>

                    <!-- Divider -->
                    <div class="modal-divider"></div>

                    <!-- Body -->
                    <div ref="bodyRef" class="modal-body">
                        <template v-for="(block, index) in content.blocks" :key="index">
                            <!-- Párrafo -->
                            <p v-if="block.type === 'paragraph'" class="modal-block modal-block--paragraph"
                                v-html="block.content" />

                            <!-- Encabezado -->
                            <h3 v-else-if="block.type === 'heading'" class="modal-block modal-block--heading"
                                v-html="block.content" />

                            <!-- Sub-encabezado -->
                            <h4 v-else-if="block.type === 'subheading'" class="modal-block modal-block--subheading"
                                v-html="block.content" />

                            <!-- Lista -->
                            <ul v-else-if="block.type === 'list'" class="modal-block modal-block--list">
                                <li v-for="(item, i) in block.items" :key="i" v-html="item" />
                            </ul>

                            <!-- Imagen -->
                            <figure v-else-if="block.type === 'image'" class="modal-block modal-block--image">
                                <img :src="block.src" :alt="block.alt || ''" />
                                <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
                            </figure>

                            <!-- Bloque genérico fallback -->
                            <div v-else class="modal-block modal-block--default" v-html="block.content || block.text" />
                        </template>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* ========== Backdrop ========== */
.modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.55);
    padding: 1.5rem;
}

/* ========== Container ========== */
.modal-container {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    max-width: 640px;
    width: 100%;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* ========== Header ========== */
.modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.5rem 0.75rem;
    flex-shrink: 0;
}

.modal-header__text {
    flex: 1;
    min-width: 0;
}

.modal-title {
    margin: 0;
    font-size: 1.375rem;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.3;
}

.modal-subtitle {
    margin: 0.25rem 0 0;
    font-size: 1rem;
    font-weight: 500;
    color: #4a4a6a;
    line-height: 1.4;
}

/* ========== Close Button ========== */
.modal-close {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #666;
    font-size: 1.75rem;
    line-height: 1;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}

.modal-close:hover {
    background: #f0f0f5;
    color: #1a1a2e;
}

/* ========== Divider ========== */
.modal-divider {
    height: 1px;
    background: #e5e5ea;
    margin: 0 1.5rem;
    flex-shrink: 0;
}

/* ========== Body ========== */
.modal-body {
    padding: 1rem 1.5rem 1.5rem;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
}

/* ========== Blocks ========== */
.modal-block {
    margin: 0 0 1rem 0;
}

.modal-block:last-child {
    margin-bottom: 0;
}

.modal-block--paragraph {
    font-size: 1rem;
    line-height: 1.7;
    color: #333;
}

.modal-block--heading {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a2e;
    margin-top: 1.25rem;
}

.modal-block--subheading {
    font-size: 1rem;
    font-weight: 600;
    color: #3a3a5a;
    margin-top: 1rem;
}

.modal-block--list {
    padding-left: 1.5rem;
    margin: 0.75rem 0;
}

.modal-block--list li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
    color: #333;
}

.modal-block--image {
    margin: 1rem 0;
    text-align: center;
}

.modal-block--image img {
    max-width: 100%;
    border-radius: 8px;
}

.modal-block--image figcaption {
    font-size: 0.875rem;
    color: #666;
    margin-top: 0.5rem;
}

/* ========== Deep selectors para HTML interno ========== */
.modal-body :deep(strong),
.modal-body :deep(b) {
    font-weight: 700;
    color: #1a1a2e;
}

.modal-body :deep(em),
.modal-body :deep(i) {
    font-style: italic;
    color: #3a3a5a;
}

.modal-body :deep(a) {
    color: #2563eb;
    text-decoration: underline;
}

.modal-body :deep(a:hover) {
    color: #1d4ed8;
}

/* ========== Transición (preparado para GSAP) ========== */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

/* Scrollbar personalizado */
.modal-body::-webkit-scrollbar {
    width: 6px;
}

.modal-body::-webkit-scrollbar-track {
    background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
    background: #c5c5d0;
    border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: #a0a0b0;
}

/* ========== Responsive ========== */
@media (max-width: 480px) {
    .modal-backdrop {
        padding: 0.75rem;
        align-items: flex-end;
    }

    .modal-container {
        max-height: 90vh;
        border-radius: 12px 12px 0 0;
    }
}
</style>