<template>
  <div class="hero">
    <div class="hero-title">
      <h1>Paquete Económico 2027</h1>
    </div>
    <div class="hero-image">Hola</div>

  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import Mascota from './utils/Mascota.vue'

</script>

<style>
.hero {
  position: relative;
  min-height: 80dvh;
  /* max-width: 1500px;
  margin: 0 auto; */

  padding: 20px 0 0 0;
  background-color: transparent;
  /* border: solid 2px red; */

  display: flex;

  /* background-color: orange; */

  margin-top: 0.7rem;
  max-width: 1800px;
}

.hero-title {
  flex: 1;
  color: white;
}

.hero-image {
  flex: 1;
  color: white;
  /* border: solid 2px blue; */
}

h1 {
  text-align: center;
  margin: 0 0 1rem 0;
  /*  border: solid 2px green; */
  font-size: 3rem;

  font-family: 'Noto Sans Black';
}
</style>
