<style lang="less" scoped>
@import './radioStation.less';
</style>

<template>
  <div class="radio-station">
    <div class="top dis-flex align-center justify-between">
      <div class="title ff2">
        <router-link to="">{{ name }}</router-link>
        <span class="ff1">·</span>
        电台
      </div>
      <router-link to="" class="more">更多 ></router-link>
    </div>
    <div class="dis-flex flex-wrap">
      <div
        class="rdilist dis-flex"
        v-for="item in musicList.slice(0, 4)"
        :key="item.id"
      >
        <div class="picUrl pointer">
          <img :src="item.picUrl" alt="电台图片" />
        </div>
        <div class="cnt">
          <div class="name" :title="item.name">{{ item.name }}</div>
          <div class="note">{{ item.rcmdtext }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    name: {
      type: String,
      default: ''
    },
    musicList: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    return {};
  }
});
</script>
