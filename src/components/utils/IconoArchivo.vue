<script lang="ts" setup>
import { computed } from 'vue';
import Csv from './Icons/Csv.vue';
import Excel from './Icons/Excel.vue';
import Link from './Icons/Link.vue';
import Pdf from './Icons/Pdf.vue';
import Zip from './Icons/Zip.vue';
import Diccionario from './Icons/Diccionario.vue';

interface IntIcono {
  extension: string
}

const props = defineProps<IntIcono>()

const extensionesExcel = ["xlsx", "xlsm"];
const extensionesZip = ["zip", "rar"];
const bgColor = computed(() => {
  if (props.extension === 'csv') return '#0369a1'
  if (extensionesExcel.includes(props.extension)) return '#16a34a'
  if (props.extension === 'pdf') return '#FF2B00'
  if (extensionesZip.includes(props.extension)) return '#b45309'
  if(props.extension === 'diccionario') return '#6d9de2'
  return '#b45309'
})
</script>

<template>
  <div
    class="flex items-center justify-center p-[0.5rem]"
      :style="{ backgroundColor: bgColor }"

  >
    <Csv class="text-white" v-if="extension === 'csv'" />
    <Excel class="text-white" v-else-if="extensionesExcel.includes(extension)" />
    <Pdf class="text-white" v-else-if="extension === 'pdf'" />
    <Zip class="text-white" v-else-if="extensionesZip.includes(extension)" />
    <Diccionario class="text-white" v-else-if="extension === 'diccionario'"/>
    <Link class="text-white" v-else />
  </div>
</template>