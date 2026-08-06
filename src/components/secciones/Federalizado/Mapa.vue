<template>
    <div id="map"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

let map = null

onMounted(() => {
    map = L.map('map').setView([23.6345, -102.5528], 5)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map)
})

onBeforeUnmount(() => {
    if (map) {
        map.remove()
    }
})
</script>

<style scoped>
#map {
    width: 100%;
    height: 600px;
}
</style>