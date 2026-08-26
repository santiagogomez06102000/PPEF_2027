<script lang="ts" setup>
import Mascota from '@/components/utils/Mascota.vue';
import TooltipInversion from './TooltipInversion.vue';

const props = defineProps<Props>();
interface Props {
    bloques: Bloque[]
}
interface Bloque {
    tipo: string
    porcentaje: number
    descripcion: string
    monto: string
    unidad: string
    color: string
    ocultar?: boolean
}

</script>
<template>
    <div class="contenedor  w-full h-[80dvh] lg:h-[30dvh] relative overflow-visible flex flex-col lg:flex-row">
        <div class="mascota-hover hiddena lg:block">
            <Mascota :mascota="8" ancho="4rem" alto="4rem" />
        </div>

        <div v-for="(bloque) in bloques" :key="bloque.descripcion" class="
                bloque
                relative
                overflow-visible
                flex
                items-center
                justify-start
                lg:justify-center
                w-full
                h-[var(--alto)]
                lg:h-full
                lg:w-[var(--ancho)]
                lg:flex-col
                lg:gap-4
            " :style="{
                '--ancho': `${bloque.porcentaje}%`,
                '--alto': `calc(${bloque.porcentaje}%)`,
                '--color-bloque': bloque.color,
            }">

            <!-- Barra -->

            <div class="
        relative
        bg-[var(--color-bloque)]
        text-white
        overflow-visible
        flex
        items-center
        w-[50%]
        h-full
        px-2
        lg:w-full
        lg:h-[4rem]
        cursor-pointer
        group
    " :class="{ 'bloque-color': bloque.tipo === 'mascota' }">
                <span v-if="!bloque.ocultar" class="font-bold text-2xl lg:text-4xl flex flex-col">
                    {{ bloque.monto }}

                    <span class="text-sm font-normal">
                        {{ bloque.unidad }}
                    </span>
                </span>

                <TooltipInversion :text="`
                <div class='max-w-[50dvw] lg:max-w-[10rem] overflow-visible'>
                <span class='text-[#0a5a45] text-xl font-bold'>
                    ${bloque.porcentaje}%
                </span>

                <span class='text-black text-wrap text-xs'>${bloque.descripcion}</span>
                <span
                    class='font-bold text-base mt-2'
                >
                    ${bloque.monto}

                    <div class='text-xs font-normal'>
                        ${bloque.unidad}
                    </div>
                </span>
                </div>
                `" />
            </div>

            <!-- Descripción -->
            <div v-if="!bloque.ocultar" class="
                    absolute
                    flex
                    items-start
                    justify-center

                    w-[50%]
                    inset-y-0
                    right-0
                    flex-col
                    gap-0
                    px-2
                    lg:w-auto
                    lg:inset-y-auto
                    lg:right-auto
                    lg:left-0
                    lg:top-[1rem]
                    lg:flex-row
                    lg:items-baseline
                    lg:justify-start
                    lg:gap-4
                    lg:px-0
                ">
                <span class="text-[#0a5a45] text-4xl lg:text-[3rem]">
                    {{ bloque.porcentaje }}%
                </span>

                <span class="text-black text-sm" v-html="bloque.descripcion"></span>
            </div>

        </div>
    </div>
</template>
<style lang="css" scoped>
.mascota-hover {
    position: absolute;
    left: calc(50% - 4rem);
    bottom: 0;
    right: unset;
    top: unset;
    transition: transform 0.3s ease;
    pointer-events: none;
}


.contenedor:has(.bloque-color:hover) .mascota-hover {
    transform: translateX(4rem);
}

@media (min-width: 1024px) {
    .mascota-hover {
        position: absolute;
        right: 0;
        top: calc(50% - 2rem);
        left: unset;
        bottom: unset;
        transition: transform 0.3s ease;
        pointer-events: none;
    }
}
</style>