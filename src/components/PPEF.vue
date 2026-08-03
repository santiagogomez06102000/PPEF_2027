<template>
  <div class="header-cubo-nav">
    <h1 style="color:#06a5c1;">Paquete
      Económico 2027</h1>

  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import Mascota from './utils/Mascota.vue'

</script>

<style>
.header-cubo-nav {
  position: relative;
  min-height: 80dvh;
  /* max-width: 1500px;
  margin: 0 auto; */

  padding: 20px 0 0 0;
  background-color: transparent;
  /* border: solid 2px red; */

  display: flex;
  flex-direction: column;

  /* background-color: orange; */

  margin-top: 0.7rem;
  max-width: 1800px;
}

h1 {
  text-align: center;
  margin: 0 0 1rem 0;
  /*  border: solid 2px green; */
  font-size: 3rem;

  font-family: 'Noto Sans Black';
}
</style>
