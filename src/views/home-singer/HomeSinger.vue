<template>
  <div class="home-singer">
    <div class="home-singer-container">
      <div class="home-singer-menu">
        <SingerMenu />
      </div>
      <div class="home-singer-content">
        <SingerContent />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SingerMenu from './singer-menu/SingerMenu.vue';
import SingerContent from './singer-content/SingerContent.vue';

export default defineComponent({
  components: {
    SingerMenu,
    SingerContent
  }
});
</script>

<style lang="less">
@import './home-singer.less';
</style>
