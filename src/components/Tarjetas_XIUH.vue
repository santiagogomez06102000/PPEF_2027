<script setup lang="ts">
import { baseUrl } from './secciones/Inversion/mapController';



const props = defineProps<Props>()

interface Props {
    card: Tarjeta
}


export interface Tarjeta {
    titulo: string;
    descripcion: string;
    img: string;
    lista?: string[];
    padding?:string;
}
</script>
<template>
    <div class="rounded-4xl card-xiuh flex flex-col items-center justify-start text-white p-8">
        <h3 v-html="card.titulo"></h3>
        <div class="flex items-start justify-between gap-4">
            <img :src="`${baseUrl}${card.img}`" :alt="card.titulo" class="w-[8rem]" :style="{
                padding:card.padding ?? 0
            }" />
            <div>
                <p v-html="card.descripcion" class="card-descripcion"></p>
                <div v-if="card.lista" class=" flex items-start justify-end me-16">
                    <ul class=" w-auto">
                        <li v-for="item in card.lista" :key="item" v-html="item"></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.card-xiuh {
    background-color: #52889f;
}

.card-descripcion {
    color: white;
    margin: 0;
}

ul {
    list-style: disc;
}

li::marker {
    color: #00f1ef;
}

li:nth-child(3n + 2)::marker {
    color: #33ccff;
}

li:nth-child(3n)::marker {
    color: #009999;
}
</style>