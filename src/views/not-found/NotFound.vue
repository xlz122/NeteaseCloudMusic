<template>
  <div class="not-found">
    <HeaderView />
    <div class="tip">
      <i class="icon"></i>
      <p class="text">很抱歉，你要查找的网页找不到</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderView from '@/views/header/Header.vue';
</script>

<style scoped lang="scss">
@use './not-found.scss';
</style>
