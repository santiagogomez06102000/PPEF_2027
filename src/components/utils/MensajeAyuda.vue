<script lang="ts" setup>
interface TypeMensaje {
    mensaje?:string
}
const props = withDefaults(defineProps<TypeMensaje>(), {
  mensaje: ""
});
const rutas=["secciones/desempenio2025/img_circle.png"]
const urlBase=import.meta.env.BASE_URL;

</script>
<template>
    <div class="contenedor-mensaje shadow-xl rounded-xl">
        <div class="parrafo-mensaje" v-html="mensaje">

        </div>
                <img :src="urlBase+rutas[0]" class="img-mensaje"/>

    </div>
</template>
<style lang="css" scoped>
    .contenedor-mensaje{
        display: flex;
        position: absolute;
        min-width: 10rem;
        min-height: 4rem;
        top: 50%;
        right: -2rem;
        padding: 1rem;
        background-color: white;

    }
    .img-mensaje{
        width: 2.5rem;
        height: 2.5rem;
        position: absolute;
        top: -1.5rem;
        left: -1.5rem;
    }
</style>