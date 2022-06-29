<template>
  <div class="home-djprogram">
    <div class="home-djprogram-container">
      <Category @djCategorChange="djCategorChange" />
      <div class="dis-flex justify-between">
        <Recommend />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { setMessage } from '@/components/message/useMessage';
import Category from './category/Category.vue';
import Recommend from './recommend/ReCommend.vue';

export default defineComponent({
  name: 'home-djprogram',
  components: {
    Category,
    Recommend
  },
  setup() {
    // 分类点击
    function djCategorChange(id: number): void {
      setMessage({ type: 'info', title: `分类id:${id}` });
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
