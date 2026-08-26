<template>
    <div
        class="
            absolute

           
            lg:-translate-x-1/2
            z-5000
            border
            opacity-0
            invisible
            group-hover:opacity-100
            group-hover:visible
    
            pointer-events-none
        "
        :class="{
            'left-[110%] lg:bottom-[calc(100%+0.5rem)] lg:left-1/2':position==='top',
            'left-[-300%] lg:top-[calc(100%+0.5rem)]':position==='bottom'
        }"
    >
        <div class="rounded-md  min-w-[15rem] bg-white shadow-xl px-3 py-2 text-sm text-black whitespace-nowrap">
            <span v-html="text"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string
    position?: "top" | "bottom" | "left" | "right"
  }>(),
  {
    position: "top"
  }
)
</script>