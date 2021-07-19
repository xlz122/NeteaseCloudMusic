<template>
  <div class="song-sheet-side-container">
    <h3 class="title">喜欢这个歌单的人</h3>
    <ul class="like-list">
      <li
        class="item"
        v-for="(item, index) in likePeople"
        :key="index"
        :class="{ 'first-item': !(index % 4) }"
      >
        <router-link class="item-link" to="" :title="item.nickname">
          <img class="item-img" :src="`${item.avatarUrl}?param=40y40`" />
        </router-link>
      </li>
    </ul>
    <h3 class="title">热门歌单</h3>
    <h3 class="title">网易云音乐多端下载</h3>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    likePeople: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    return {};
  }
});
</script>

<style lang="less" scoped>
@import './song-sheet-side.less';
</style>
