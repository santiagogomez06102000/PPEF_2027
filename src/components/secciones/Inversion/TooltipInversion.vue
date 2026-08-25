<template>
    <div
        class="
            absolute

            left-[110%]

            lg:bottom-[calc(100%+0.5rem)]
            lg:left-1/2
            lg:-translate-x-1/2
            z-5000

            opacity-0
            invisible
            group-hover:opacity-100
            group-hover:visible

            pointer-events-none
        "
    >
        <div class="rounded-md bg-white shadow-xl px-3 py-2 text-sm text-black whitespace-nowrap">
            <span v-html="text"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    text: string
}>()
</script>