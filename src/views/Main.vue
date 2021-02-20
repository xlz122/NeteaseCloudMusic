<template>
  <div class="home">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/views/header/Header.vue';
import Footer from '@/views/footer/Footer.vue';

export default defineComponent({
  components: {
    Header,
    Footer
  }
});
</script>
