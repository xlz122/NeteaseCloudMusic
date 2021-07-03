<template>
  <div class="singer-content">
    <div class="title">
      <span class="text">
        {{ title }}
        <i class="icon-r"></i>
      </span>
    </div>
    <ul class="list-screen" v-if="sort">
      <li
        class="item"
        v-for="(item, index) in sortList"
        :key="index"
        :class="[
          { hot: index === 0 },
          { hot: index === sortList.length > 2 && sortList.length - 1 },
          { 'active-item': index === 0 }
        ]"
      >
        <span class="item-text">{{ item.large }}</span>
      </li>
    </ul>
    <ul class="list">
      <li class="item" v-for="(item, index) in main" :key="index">
        <div class="item-cover">
          <img class="item-cover-img" :src="item.picUrl" alt="" />
        </div>
        <div class="item-desc">
          <span class="item-desc-text">{{ item.name }}</span>
          <span class="item-desc-icon" v-if="item.albumSize < 50"></span>
        </div>
      </li>
    </ul>
    <div class="line" v-if="second.length > 0"></div>
    <ul class="list-small">
      <li class="item" v-for="(item, index) in second" :key="index">
        <span class="item-text">{{ item.name }}</span>
        <span class="item-icon" v-if="item.albumSize < 50"></span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    },
    sort: {
      type: Boolean,
      default: false
    },
    main: {
      type: Array,
      default: () => []
    },
    second: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const sortList = reactive([
      {
        large: '热门',
        small: -1
      },
      {
        large: 'A',
        small: 'a'
      },
      {
        large: 'B',
        small: 'b'
      },
      {
        large: 'C',
        small: 'c'
      }
    ]);
    // 'D'、'E'、'F'、'G'、'H'、'I'、'J'、'K'、'L'、'M'、'N'、'O'、'P'、'Q'、'R'、'S'、'T'、'U'、'V'、'W'、'X'、'Y'、'Z'
    return {
      sortList
    };
  }
});
</script>

<style lang="less">
@import './singer-content.less';
</style>
