<template>
  <ul class="search-song">
    <li
      class="item"
      v-for="(item, index) in list"
      :key="index"
      :class="{ 'even-item': index % 2 }"
    >
      <div class="td play-icon"></div>
      <div class="td td1">
        <div class="text">
          <span class="name">{{ item?.name }}</span>
          <span class="desc"></span>
        </div>
      </div>
      <div class="td td2"></div>
      <!-- 操作项 -->
      <div class="td td3">
        <div class="text">
          <span class="name">{{ item?.ar[0]?.name }}</span>
        </div>
      </div>
      <div class="td td4">
        <div class="text">
          <span class="name">{{ item?.al?.name }}</span>
        </div>
      </div>
      <div class="td">{{ timeStampToDuration(item.dt / 1000) }}</div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { timeStampToDuration } from '@utils/utils.ts';

export default defineComponent({
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    return {
      timeStampToDuration
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-song.less';
</style>
