<template>
  <div class="djprogram-side-container">
    <h3 class="title">
      更多节目
      <span class="title-all"> 全部> </span>
    </h3>
    <ul class="djprogram-side-list">
      <li class="item" v-for="(item, index) in []" :key="index">
        <div class="item-cover">
          <img
            class="cover-img"
            :src="`${item?.coverImgUrl}?param=50y50`"
            alt=""
          />
        </div>
        <div class="item-info">
          <p class="info-title" :title="item?.name">
            {{ item?.name }}
          </p>
          <div class="info-desc">
            <span class="text" :title="item?.creator?.nickname">
              {{ item?.creator?.nickname }}
            </span>
          </div>
        </div>
      </li>
    </ul>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SideDownload from '@views/song-sheet-detail/side-downlod/SideDownload.vue';

export default defineComponent({
  components: {
    SideDownload
  },
  setup() {
    return {};
  }
});
</script>

<style lang="less" scoped>
@import './djprogram-side.less';
</style>
