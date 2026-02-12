<template>
  <div class="side-container">
    <h3 class="title">你可能也喜欢</h3>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
  </div>
</template>

<script setup lang="ts">
import SideDownload from '@/views/song-sheet-detail/side-download/SideDownload.vue';
</script>

<style scoped lang="scss">
@use './djradio-side.scss';
</style>
