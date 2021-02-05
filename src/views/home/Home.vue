<template>
  <div class="home">
    <banner />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Banner from './banner/Banner.vue';

export default defineComponent({
  components: {
    Banner
  }
});
</script>
