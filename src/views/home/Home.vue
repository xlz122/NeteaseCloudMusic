<template>
  <div class="home">
    <banner />
    <div class="home-container">
      <div class="container-content">
        <home-content />
      </div>
      <div class="container-side">
        <home-side />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Banner from './banner/Banner.vue';
import HomeContent from './content/Content.vue';
import HomeSide from './side/Side.vue';
</script>

<style scoped lang="scss">
@use './home.scss';
</style>
