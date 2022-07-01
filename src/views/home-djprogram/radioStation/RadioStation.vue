<style lang="less" scoped>
@import './radioStation.less';
</style>

<template>
  <div class="radio-station">
    <div class="top dis-flex align-center justify-between">
      <div class="title ff2">
        <router-link to="">音乐推荐</router-link>
        <span class="ff1">·</span>
        电台
      </div>
      <router-link to="" class="more">更多 ></router-link>
    </div>
    <div class="dis-flex flex-wrap"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  }
});
</script>
