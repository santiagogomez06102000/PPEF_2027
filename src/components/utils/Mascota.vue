<script lang="ts" setup>
interface TypeMascota {
  mascota?: number
  ancho?: string
  alto?: string
}
const props = withDefaults(defineProps<TypeMascota>(), {
  mascota: 0,
  alto: '10rem',
  ancho: '10rem',
})
const carpeta = 'mascota/'
const rutas = [
  '0_cabeza.png',
  '1_inicio.png',
  '2_ciclo_fiscal.png',
  '3_anterior.png',
  '4_siguiente.png',
  '5_ingresos.png',
  '6_siguiente_ciclo.png',
  '7_impulso.png',
  'dato.png'
]
const urlBase = import.meta.env.BASE_URL
</script>
<template>
  <div
    class="contenedor-img-mascota flex items-center"
    :style="{
      '--alto': alto,
      '--ancho': ancho,
    }"
  >
    <img :src="urlBase + carpeta + rutas[mascota]" v-if="rutas[mascota]" class="img-mascota" />
  </div>
</template>
<style lang="css" scoped>
.contenedor-img-mascota {
  min-width: var(--ancho);
}
.img-mascota {
  width: var(--ancho);
  height: var(--alto);
  flex: 1;
}
</style>
