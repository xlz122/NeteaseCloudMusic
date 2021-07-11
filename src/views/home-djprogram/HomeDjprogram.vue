<template>
  <div class="home-djprogram">
    <div class="home-djprogram-container">
      <Category />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Category from './category/Category.vue';

export default defineComponent({
  components: {
    Category
  },
  setup() {
    return {};
  }
});
</script>

<style lang="less" scoped>
@import './home-djprogram.less';
</style>
