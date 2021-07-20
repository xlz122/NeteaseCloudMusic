<template>
  <div class="home-djprogram">
    <div class="home-djprogram-container">
      <Category @djCategorChange="djCategorChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import Category from './category/Category.vue';

export default defineComponent({
  name: 'home-djprogram',
  components: {
    Category
  },
  setup() {
    const $store = useStore();

    // 分类点击
    function djCategorChange(id: number): void {
      $store.commit('setMessage', {
        type: 'info',
        title: `分类id:${id}`
      });
    }
    return {
      djCategorChange
    };
  }
});
</script>

<style lang="less" scoped>
@import './home-djprogram.less';
</style>
