<template>
  <div class="home">
    <Header />
    <router-view />
    <Footer />
  </div>
  <music-audio />
</template>

<script lang="ts" setup>
/* eslint-disable */
import Header from '@/views/header/Header.vue';
import Footer from '@/views/footer/Footer.vue';
import MusicAudio from '@components/music-audio/MusicAudio.vue';
</script>
