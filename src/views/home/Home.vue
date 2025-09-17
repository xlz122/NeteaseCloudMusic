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

<script lang="ts" setup>
import Banner from './banner/Banner.vue';
import HomeContent from './content/Content.vue';
import HomeSide from './side/Side.vue';
</script>

<style lang="less" scoped>
@import url('./home.less');
</style>
