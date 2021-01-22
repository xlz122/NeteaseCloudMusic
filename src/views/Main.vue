<template>
  <div class="home">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable */
import Header from '@/views/header/Header.vue';
import Footer from '@/views/footer/Footer.vue';
</script>
